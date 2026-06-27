import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Upload, 
  Trash2, Edit2, 
  Filter, 
  Sparkles, 
  FileSpreadsheet, 
  AlertCircle,
  TrendingDown,
  Zap,
  ChevronRight,
  Receipt,
  Info
} from 'lucide-react';

export default function Expenses() {
  const { transactions, refreshData, getHeaders, API_BASE_URL } = useApp();
  
  // Manual Entry Form State
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [merchant, setMerchant] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [isLifePortfolio, setIsLifePortfolio] = useState(false);
  const [editingTxnId, setEditingTxnId] = useState(null);
  const [lifeCategory, setLifeCategory] = useState('Health');

  // File Upload State
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [showFormatModal, setShowFormatModal] = useState(false);

  // Filtering State
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('expense');
  const [filterLife, setFilterLife] = useState('All');

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/transactions/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          amount: parseFloat(amount),
          type,
          category,
          date,
          merchant: merchant || 'Unknown Merchant',
          payment_mode: paymentMode,
          notes,
          is_life_portfolio: isLifePortfolio,
          life_category: isLifePortfolio ? lifeCategory : null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save transaction');
      }

      // Reset form
      setAmount('');
      setMerchant('');
      setNotes('');
      setIsLifePortfolio(false);
      
      // Refresh
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // File dropzone/input changes
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadError('');
    setUploadSuccess('');
  };

  // Statement upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/transactions/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to parse statement file.');
      }

      setUploadSuccess(`Success! Fully parsed and imported ${data.length} transactions from statement.`);
      setFile(null);
      
      // Clear file input visually
      document.getElementById('file-input').value = '';
      
      await refreshData();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Delete transaction
  const handleEdit = (txn) => {
    setEditingTxnId(txn.id);
    setType(txn.type);
    setAmount(txn.amount);
    setMerchant(txn.merchant);
    setDate(txn.date);
    setCategory(txn.category);
    setPaymentMode(txn.payment_mode);
    setNotes(txn.notes || '');
    setIsLifePortfolio(txn.is_life_portfolio);
    if (txn.life_category) setLifeCategory(txn.life_category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction.');
      }
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Standard Categories list
  const standardCategories = ["Food", "Rent", "Bills", "Health", "Learning", "Experiences", "Shopping", "Miscellaneous"];

  // Filter logic
  const filteredTransactions = transactions.filter(t => {
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesType = filterType === 'All' || t.type === filterType;
    const matchesLife = filterLife === 'All' || 
      (filterLife === 'Life' && t.is_life_portfolio) || 
      (filterLife === 'Financial' && !t.is_life_portfolio);
    return matchesCategory && matchesType && matchesLife;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-amber">
            <Receipt size={10} />
            Registry
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Expense <span className="text-gradient-brand">Registry</span> & Imports
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">Log expenses manually or ingest digital bank statements instantly.</p>
      </div>

      {/* Forms grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Manual Expense Form */}
        <div className="lg:col-span-2 glass-card p-5 animate-fade-in-up delay-75">
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 pb-3 border-b border-white/5">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <Plus size={15} className="text-indigo-600" />
            </div>
            {editingTxnId ? "Edit Transaction" : "Manual Transaction Ledger"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-[0.1em]">Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 glass-input text-sm"
              >
                <option value="expense">Expense (-)</option>
                <option value="income">Income (+)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-[0.1em]">Amount (₹)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2.5 glass-input text-sm font-semibold"
                placeholder="₹ 450"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-[0.1em]">Merchant / Source</label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full p-2.5 glass-input text-sm"
                placeholder="Zomato / Employer Salary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-[0.1em]">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-[0.1em]">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  // Auto toggle isLifePortfolio if category fits
                  if (["Health", "Learning", "Experiences"].includes(e.target.value)) {
                    setIsLifePortfolio(true);
                    setLifeCategory(e.target.value);
                  }
                }}
                className="w-full p-2.5 glass-input text-sm"
              >
                {standardCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-[0.1em]">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full p-2.5 glass-input text-sm"
              >
                <option value="UPI">UPI (GPay/PhonePe)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-[0.1em]">Notes / Description</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 glass-input text-sm"
                placeholder="E.g., monthly groceries, project reference materials..."
              />
            </div>

            {/* Life Portfolio custom checkbox toggle */}
            <div className="md:col-span-2 p-3 bg-blue-950/20 border border-indigo-100 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="life-checkbox"
                  checked={isLifePortfolio}
                  onChange={(e) => setIsLifePortfolio(e.target.checked)}
                  className="rounded bg-gray-900 border-gray-700 text-indigo-600 focus:ring-blue-500/50 w-4 h-4"
                />
                <label htmlFor="life-checkbox" className="text-xs font-semibold text-[var(--text-primary)] cursor-pointer flex items-center space-x-1.5">
                  <Sparkles size={14} className="text-indigo-600" />
                  <span>Mark as Life Portfolio Capital Investment</span>
                </label>
              </div>

              {isLifePortfolio && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[var(--text-muted)]">Classify as:</span>
                  <select
                    value={lifeCategory}
                    onChange={(e) => setLifeCategory(e.target.value)}
                    className="p-1.5 glass-input text-xs"
                  >
                    <option value="Health">🏃 Health Asset</option>
                    <option value="Learning">📚 Learning Asset</option>
                    <option value="Experiences">✈️ Experience Asset</option>
                    <option value="Emergency Fund">🛡️ Emergency Buffer</option>
                  </select>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={14} />
                {editingTxnId ? "Update Transaction" : "Log Transaction"}
              </button>
            </div>
          </form>
        </div>

        {/* Bank Statement Ingestion */}
        <div className="glass-card p-5 flex flex-col justify-between animate-fade-in-up delay-150">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg">
                <Upload size={15} className="text-indigo-600" />
              </div>
              Statement Parser
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] mb-4">Ingest CSV/Excel/PDF exports from HDFC, SBI, ICICI, PhonePe, or standard bank accounts.</p>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className={`border-2 border-dashed ${!file ? 'border-emerald-500/40 animate-pulse-slow bg-emerald-500/[0.02]' : 'border-emerald-500/20 bg-indigo-50'} rounded-2xl p-8 text-center transition-all duration-300 hover:border-emerald-500/60 hover:bg-emerald-500/[0.05] flex flex-col items-center justify-center cursor-pointer relative glow-emerald`}>
                <input
                  type="file"
                  id="file-input"
                  required
                  accept=".csv, .xlsx, .xls, .pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileSpreadsheet className="text-[var(--text-muted)] mb-2" size={32} />
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {file ? file.name : "Select statement (CSV, Excel, PDF)"}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1">Supports drag & drop</span>
              </div>

              <button 
                type="button" 
                onClick={() => setShowFormatModal(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] text-[var(--text-muted)] hover:text-indigo-600 transition-colors uppercase font-semibold tracking-wider"
              >
                <Info size={12} />
                View Supported Formats
              </button>

              {uploadError && (
                <div className="p-2.5 bg-red-950/30 border border-red-500/20 text-red-300 text-xs rounded-lg flex items-center space-x-1.5">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span className="truncate">{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs rounded-lg">
                  {uploadSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {uploading ? "Ingesting..." : "Import Bank Statement"}
              </button>
            </form>
          </div>
          
          <div className="text-[10px] text-[var(--text-muted)] border-t border-gray-200/40 pt-3 mt-4 text-center">
            Statement parser normalizes date structures & parses descriptions for Swiggy, Gym, Courses, etc.
          </div>
        </div>
      </div>

      {/* Transaction History Filter and List */}
      <div className="glass-card p-5 animate-fade-in-up delay-225">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 rounded-lg">
              <Filter size={15} className="text-purple-400" />
            </div>
            Transaction Timeline
            <span className="text-[10px] text-[var(--text-muted)] font-normal ml-1">({filteredTransactions.length} records)</span>
          </h3>
          
          {/* Filters controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="p-2 glass-input text-xs"
              >
                <option value="All">All Categories</option>
                {standardCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 glass-input text-xs"
              >
                <option value="All">All Types</option>
                <option value="expense">Expenses Only</option>
                <option value="income">Income Only</option>
              </select>
            </div>

            {/* Life Portfolio Filter */}
            <div>
              <select
                value={filterLife}
                onChange={(e) => setFilterLife(e.target.value)}
                className="p-2 glass-input text-xs"
              >
                <option value="All">All Portfolios</option>
                <option value="Life">Life Portfolio Capital</option>
                <option value="Financial">Financial Expenses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="overflow-x-auto pr-1">
          <table className="w-full text-left text-sm text-[var(--text-primary)]">
            <thead className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] bg-emerald-500/[0.03] border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 rounded-l-lg font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Merchant / Source</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 text-right font-semibold">Amount</th>
                <th className="py-3 px-4 rounded-r-lg text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-emerald-500/[0.04] transition-all duration-200 group border-b border-gray-200/50 last:border-0">
                  <td className="py-3.5 px-4 font-mono text-xs">{t.date}</td>
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-semibold text-[var(--text-primary)]">{t.merchant}</span>
                      {t.notes && <p className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate max-w-[200px]">{t.notes}</p>}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs">{t.category}</span>
                      {t.is_life_portfolio && (
                        <span className="badge badge-emerald text-[8px]">
                          Life Asset
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200 uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                      {t.payment_mode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`font-bold ${t.type === 'income' ? 'text-indigo-600 dark:text-indigo-600' : 'text-[var(--text-primary)]'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        type="button"
                        onClick={() => handleEdit(t)}
                        className="text-[var(--text-muted)] hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-all mr-1"
                        title="Edit transaction"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id)}
                        className="text-[var(--text-muted)] hover:text-red-400 p-1.5 rounded-lg hover:bg-rose-50 transition-all"
                        title="Delete transaction"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-[var(--text-muted)] text-xs">
                    No transactions match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supported Formats Modal */}
      {showFormatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--bg-surface)] border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in">
            <div className="sticky top-0 bg-[var(--bg-surface)] border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileSpreadsheet className="text-indigo-600" />
                Supported Statement Formats
              </h3>
              <button 
                onClick={() => setShowFormatModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* CSV / Excel Example */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  CSV / Excel Format
                </h4>
                <p className="text-xs text-[var(--text-muted)] mb-3">Ensure your spreadsheet contains headers similar to Date, Merchant/Details, Amount, and Type (Optional).</p>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 border-b border-gray-200 text-[var(--text-muted)] uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Transaction Details</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glassBorder text-[var(--text-primary)]">
                      <tr>
                        <td className="p-3">2026-06-24</td>
                        <td className="p-3">Paid to Amazon</td>
                        <td className="p-3">2500</td>
                        <td className="p-3">DEBIT</td>
                      </tr>
                      <tr>
                        <td className="p-3">24/06/2026</td>
                        <td className="p-3">Salary Credit</td>
                        <td className="p-3">85000</td>
                        <td className="p-3">CREDIT</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PDF Example */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  PDF Format (PhonePe / Standard)
                </h4>
                <p className="text-xs text-[var(--text-muted)] mb-3">PDFs should contain clear text blocks or tables. Scanned images without OCR are not supported.</p>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-gray-50 font-mono text-xs text-[var(--text-primary)] leading-relaxed">
                  <div className="border-b border-gray-200 pb-2 mb-2 text-[var(--text-muted)]">
                    Transaction Statement<br/>
                    28 May, 2026 - 27 Jun, 2026
                  </div>
                  <div>
                    <span className="text-indigo-600">Jun 24, 2026</span><br/>
                    07:53 pm<br/>
                    Paid to YASH BHARATBHAI LIMBANI <span className="text-amber-400">DEBIT</span> ₹200<br/>
                    <span className="text-[10px] text-gray-500">Transaction ID T2606241953219174296744</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-indigo-600">Jun 24, 2026</span><br/>
                    07:26 pm<br/>
                    Received from MAA <span className="text-blue-400">CREDIT</span> ₹500<br/>
                    <span className="text-[10px] text-gray-500">Transaction ID T2606241926436169300551</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 text-xs text-emerald-200">
                <strong>Pro Tip:</strong> Our AI parser automatically categorizes merchants (e.g. Swiggy → Food, Amazon → Shopping) and infers expense/income if "DEBIT" or "CREDIT" isn't explicitly mentioned.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
