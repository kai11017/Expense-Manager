import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // UI States
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Data States
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync theme with document class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
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

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      setToken(data.access_token);
      const userProfile = { email: data.email, name: data.name, id: data.user_id };
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

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
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

  // Fetch all user dashboard and list data
  const refreshData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Dashboard summary
      const dashRes = await fetch(`${API_BASE_URL}/advisor/summary`, {
        headers: getHeaders()
      });
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
      loading,
      error,
      login,
      register,
      logout,
      refreshData,
      getHeaders,
      API_BASE_URL
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
