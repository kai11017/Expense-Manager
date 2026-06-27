import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Send, 
  Paperclip,
  CheckCircle,
  TrendingUp,
  Shield,
  ArrowRight,
  History,
  Share2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export default function AIAdvisor() {
  const { dashboardData, getHeaders, API_BASE_URL } = useApp();
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      role: 'assistant',
      content: "Your portfolio is currently **outperforming** the Nifty 50 by **2.4%** over the last 30 days. This alpha is primarily driven by your early exposure to the Energy sector and a recent rally in mid-cap tech holdings.",
      showChart: true
    }
  ]);
  const [asking, setAsking] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, asking]);

  // Adjust textarea height dynamically
  const handleTextareaInput = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  // Submit custom advisory query
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = question;
    setQuestion('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setChatLog(prev => [...prev, { role: 'user', content: userMsg }]);
    setAsking(true);

    try {
      const response = await fetch(`${API_BASE_URL}/advisor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getHeaders()
        },
        body: JSON.stringify({ message: userMsg })
      });
      
      const data = await response.json();
      
      setChatLog(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply || "I'm having trouble thinking right now.", 
        showChart: data.show_chart || false 
      }]);
    } catch (err) {
      setChatLog(prev => [...prev, { role: 'assistant', content: "I encountered an error connecting to my AI core. Make sure the backend is running and API keys are set." }]);
    } finally {
      setAsking(false);
    }
  };

  const handleShareChat = async () => {
    const text = chatLog.map(msg => `${msg.role === 'user' ? 'You' : 'Finny AI'}: ${msg.content}`).join("\n\n");
    try {
      if (navigator.share) {
        await navigator.share({
          title: "FinPilot AI Chat",
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Chat copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing chat:", err);
    }
  };

  const parseBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const quickPrompts = [
    "Analyse Tesla P/E",
    "Tax Harvest Strategy",
    "Top ETFs for 2024"
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-3rem)] overflow-hidden pb-4">
      
      {/* Left Column: Context & Insights */}
      <div className="w-full lg:w-[380px] flex flex-col gap-6 overflow-y-auto pr-1">
        
        {/* AI Context Sync Status */}
        <div className="glass-card p-6 border border-outline-variant">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-on-surface">AI Context</h3>
            <span className="bg-tertiary/10 text-tertiary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></span> Live Sync
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Portfolio Active</p>
                <p className="text-xs text-on-surface-variant">Last updated 2m ago</p>
              </div>
              <CheckCircle className="text-emerald-500" size={18} />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Market Data Feed</p>
                <p className="text-xs text-on-surface-variant">Real-time NYSE/NSE active</p>
              </div>
              <CheckCircle className="text-emerald-500" size={18} />
            </div>
          </div>
        </div>

        {/* Top Opportunities */}
        <div className="glass-card p-6 border border-outline-variant relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-primary" size={20} />
            <h3 className="text-lg font-bold text-on-surface">Top Opportunities</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-transparent hover:border-primary/20">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">Wipro Limited</p>
                  <p className="text-xs text-on-surface-variant">Sector: IT Services</p>
                </div>
                <span className="text-emerald-600 font-bold text-sm">+4.2%</span>
              </div>
              <p className="text-xs text-on-surface-variant mb-3 leading-snug">AI suggests increasing stake based on projected 12% dividend yield and technical breakout.</p>
              <button 
                onClick={(e) => { e.target.innerText = "Recommendation Applied"; e.target.className="w-full bg-emerald-100 text-emerald-700 py-2 rounded-lg text-xs font-bold transition-all"; setTimeout(() => alert("Wipro recommendation applied to plan!"), 100); }}
                className="w-full bg-primary-container text-on-primary-container py-2 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all"
              >
                Apply Recommendation
              </button>
            </div>
            
            <div className="p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-900">HDFC Bank</p>
                  <p className="text-xs text-on-surface-variant">Sector: Finance</p>
                </div>
                <span className="text-emerald-600 font-bold text-sm">+1.8%</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">Undervalued relative to private sector peers. Suggested entry point: ₹1,620.</p>
            </div>
          </div>
        </div>

        {/* Risk Monitor */}
        <div className="glass-card p-6 border border-outline-variant bg-error-container/5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-rose-600" size={20} />
            <h3 className="text-lg font-bold text-on-surface">Risk Monitor</h3>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-gray-200" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="5"></circle>
                <circle className="text-rose-600" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="176" stroke-dashoffset="44" stroke-width="5"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">75%</div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">High Concentration</p>
              <p className="text-xs text-on-surface-variant leading-snug">IT sector exposure exceeds 40% of total portfolio value.</p>
            </div>
          </div>
          <button 
            onClick={() => { setQuestion("Please create a diversification plan to reduce my IT sector exposure."); document.querySelector('textarea')?.focus(); }}
            className="text-primary font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all"
          >
            View Diversification Plan <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

      </div>

      {/* Right Column: AI Workspace (Chat) */}
      <div className="flex-1 flex flex-col glass-card rounded-2xl border border-outline-variant bg-white relative overflow-hidden shadow-lg shadow-purple-500/5">
        
        {/* Chat Header */}
        <div className="p-5 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center shadow-lg shadow-tertiary/20 text-white">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Ask Finny</h2>
              <p className="text-xs text-on-surface-variant">Your premium AI financial co-pilot</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors" title="Chat History">
              <History size={18} />
            </button>
            <button onClick={handleShareChat} type="button" className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors" title="Share Chat">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatLog.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {msg.role === 'assistant' ? (
                  <div className="w-9 h-9 rounded-full bg-tertiary flex-shrink-0 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
                    {useApp().user?.name ? useApp().user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-surface-container-high text-gray-900 rounded-tr-none border border-outline-variant/30 shadow-sm' 
                      : 'bg-tertiary/5 border border-tertiary/10 text-gray-900 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line">{parseBoldText(msg.content)}</p>

                    {/* Conditional Comparison Chart */}
                    {msg.showChart && (
                      <div className="bg-white rounded-xl border border-outline-variant p-4 mt-3">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">30D Performance Comparison</h4>
                          <div className="flex gap-3">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span className="text-[10px] font-bold text-gray-700">Portfolio (+8.1%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                              <span className="text-[10px] font-bold text-gray-700">Nifty 50 (+5.7%)</span>
                            </div>
                          </div>
                        </div>
                        <div className="h-32 flex items-end gap-3 px-2 pb-2 border-b border-gray-100">
                          <div className="flex-1 bg-blue-50 rounded-t relative h-[40%]">
                            <div className="absolute bottom-0 w-full bg-blue-300 h-[60%] rounded-t"></div>
                            <div className="absolute bottom-0 w-full bg-emerald-500 h-[85%] rounded-t opacity-70"></div>
                          </div>
                          <div className="flex-1 bg-blue-50 rounded-t relative h-[45%]">
                            <div className="absolute bottom-0 w-full bg-blue-300 h-[65%] rounded-t"></div>
                            <div className="absolute bottom-0 w-full bg-emerald-500 h-[90%] rounded-t opacity-70"></div>
                          </div>
                          <div className="flex-1 bg-blue-50 rounded-t relative h-[55%]">
                            <div className="absolute bottom-0 w-full bg-blue-300 h-[70%] rounded-t"></div>
                            <div className="absolute bottom-0 w-full bg-emerald-500 h-[95%] rounded-t opacity-70"></div>
                          </div>
                          <div className="flex-1 bg-blue-50 rounded-t relative h-[75%]">
                            <div className="absolute bottom-0 w-full bg-blue-300 h-[75%] rounded-t"></div>
                            <div className="absolute bottom-0 w-full bg-emerald-500 h-[100%] rounded-t"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-[9px] text-on-surface-variant mt-2 font-semibold">
                          <span>MAR 01</span>
                          <span>MAR 15</span>
                          <span>TODAY</span>
                        </div>
                      </div>
                    )}

                    {msg.role === 'assistant' && (
                      <p className="text-xs text-on-surface-variant italic border-l-2 border-tertiary pl-3 mt-3">
                        "Finny Insight: Rebalancing is recommended in the next 14 days to lock in gains and manage sector risk."
                      </p>
                    )}
                  </div>
                  <span className="text-[9px] text-on-surface-variant uppercase font-semibold pl-1">
                    {msg.role === 'user' ? 'You' : 'Finny AI'}
                  </span>
                </div>

              </div>
            </div>
          ))}
          {asking && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-tertiary flex-shrink-0 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div className="bg-tertiary/5 border border-tertiary/10 px-4 py-3 rounded-2xl rounded-tl-none">
                <div className="flex gap-1.5 items-center py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Chat Input */}
        <div className="p-5 bg-white relative border-t border-gray-100">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setQuestion(prompt)}
                className="bg-surface-container px-3.5 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-tertiary hover:text-white transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
          
          <form onSubmit={handleAskQuestion} className="flex items-center gap-3 bg-surface-container p-2 rounded-2xl border border-outline-variant focus-within:border-tertiary transition-all">
            <button type="button" className="p-2 text-on-surface-variant hover:text-tertiary transition-colors" title="Attach file">
              <Paperclip size={18} />
            </button>
            <textarea
              ref={textareaRef}
              rows="1"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onInput={handleTextareaInput}
              placeholder="Type your message to Finny..."
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none focus:outline-none text-sm placeholder:text-on-surface-variant/50 resize-none py-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAskQuestion(e);
                }
              }}
            />
            <button 
              type="submit"
              disabled={asking || !question.trim()}
              className="bg-primary-container text-on-primary-container w-11 h-11 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="text-[10px] text-center text-on-surface-variant mt-3">Finny AI can make mistakes. Always verify with your financial advisor before trading.</p>
        </div>

      </div>

    </div>
  );
}
