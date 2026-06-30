import React, { createContext, useState, useEffect, useContext } from 'react';
import { Capacitor } from '@capacitor/core';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile 
} from 'firebase/auth';

const AppContext = createContext();

// Dynamically configure API_BASE_URL based on the environment
let API_BASE_URL = 'http://localhost:8000/api';

try {
  if (Capacitor && Capacitor.getPlatform() === 'android') {
    // We will use localhost + ADB Reverse to bypass Hotspot network isolation
    API_BASE_URL = 'http://localhost:8000/api'; 
  } else if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // If accessing via local network IP (e.g., 192.168.x.x)
    API_BASE_URL = `http://${window.location.hostname}:8000/api`;
  }
} catch (e) {
  console.log("Capacitor not found, using default URL");
}

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // UI States
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Data States
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [news, setNews] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync theme with document class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // 'auto' mode
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Configure headers with Bearer token
  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Login handler using Firebase Auth
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // 2. Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // 3. Exchange for local access token
      const response = await fetch(`${API_BASE_URL}/auth/firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Backend verification failed');
      }
      setToken(data.access_token);
      const userProfile = { email: data.email, name: data.name, id: data.user_id, has_completed_tour: data.has_completed_tour };
      setUser(userProfile);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(userProfile));
      return true;
    } catch (err) {
      let friendlyMsg = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMsg = 'Incorrect email or password';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMsg = 'Invalid email address';
      }
      setError(friendlyMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register handler using Firebase Auth
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // 2. Update display name in Firebase
      await updateProfile(firebaseUser, { displayName: name });
      
      // 3. Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // 4. Register on our backend
      const response = await fetch(`${API_BASE_URL}/auth/firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Backend registration failed');
      }
      setToken(data.access_token);
      const userProfile = { email: data.email, name: data.name, id: data.user_id, has_completed_tour: data.has_completed_tour };
      setUser(userProfile);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(userProfile));
      return true;
    } catch (err) {
      let friendlyMsg = err.message;
      if (err.code === 'auth/email-already-in-use') {
        friendlyMsg = 'Email is already registered';
      } else if (err.code === 'auth/weak-password') {
        friendlyMsg = 'Password should be at least 6 characters';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMsg = 'Invalid email address';
      }
      setError(friendlyMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const [devOtp, setDevOtp] = useState('');

  const requestOtp = async (email, type) => {
    return true;
  };


  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      let friendlyMsg = err.message;
      if (err.code === 'auth/user-not-found') {
        friendlyMsg = 'No account found with this email';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMsg = 'Invalid email address';
      }
      setError(friendlyMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const googleLogin = async (tokenId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Google login failed');
      
      setToken(data.access_token);
      const userProfile = { email: data.email, name: data.name, id: data.user_id, has_completed_tour: data.has_completed_tour };
      setUser(userProfile);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(userProfile));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setDashboardData(null);
    setTransactions([]);
    setPortfolio(null);
    setNews([]);
    setActiveTab('dashboard');
  };

  // Complete tour handler
  const completeTour = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/complete-tour`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (response.ok) {
        const updatedUser = { ...user, has_completed_tour: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Error completing tour:", err);
    }
  };

  // Fetch all user dashboard and list data
  const refreshData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Dashboard summary
      const dashRes = await fetch(`${API_BASE_URL}/advisor/summary`, {
        headers: getHeaders()
      });
      if (dashRes.status === 401) {
        logout();
        return;
      }
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setDashboardData(dashData);
      }

      // 2. Transaction List
      const txnRes = await fetch(`${API_BASE_URL}/transactions/`, {
        headers: getHeaders()
      });
      if (txnRes.ok) {
        const txnData = await txnRes.json();
        setTransactions(txnData);
      }

      // 3. Portfolio
      const portRes = await fetch(`${API_BASE_URL}/portfolio/`, {
        headers: getHeaders()
      });
      if (portRes.ok) {
        const portData = await portRes.json();
        setPortfolio(portData);
      }

      // 4. News
      const newsRes = await fetch(`${API_BASE_URL}/news/`, {
        headers: getHeaders()
      });
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData);
      }

      // 5. Budgets
      const budgRes = await fetch(`${API_BASE_URL}/budgets/`, {
        headers: getHeaders()
      });
      if (budgRes.ok) {
        const budgData = await budgRes.json();
        setBudgets(budgData);
      }

    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to fetch fresh data. Is backend server running?");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh when token becomes available or activeTab changes
  useEffect(() => {
    if (token) {
      refreshData();
    }
  }, [token, activeTab]);

  return (
    <AppContext.Provider value={{
      token,
      user,
      activeTab,
      setActiveTab,
      theme,
      setTheme,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      dashboardData,
      transactions,
      portfolio,
      news,
      budgets,
      loading,
      error,
      login,
      register,
      logout,
      requestOtp,
      resetPassword,
      googleLogin,
      refreshData,
      getHeaders,
      completeTour,
      API_BASE_URL,
      devOtp,
      setDevOtp
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
