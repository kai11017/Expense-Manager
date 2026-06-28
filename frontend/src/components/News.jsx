import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart2, TrendingUp, TrendingDown, Minus, 
  MessageCircle, Bookmark, Share2, Zap, Sparkles, 
  Activity, ArrowRight 
} from 'lucide-react';

export default function News() {
  const { news, loading } = useApp();
  const [activeTab, setActiveTab] = useState('All News');
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  
  const toggleBookmark = (index, e) => {
    e.stopPropagation();
    setBookmarkedArticles(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleShare = async (item, e) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.summary,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${item.title}\n${item.summary}\n${window.location.href}`);
        alert("Article copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading && news.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-primary border-r-primary/30"></div>
          </div>
          <span className="text-[11px] text-primary/80 font-semibold uppercase tracking-[0.2em] animate-pulse">Loading feed...</span>
        </div>
      </div>
    );
  }

  const getSentiment = (index) => {
    // Mocking sentiment based on index for the UI presentation
    if (index % 3 === 0) return { label: 'Bullish', class: 'bg-primary-container/10 text-primary-container border border-primary-container/20', icon: <TrendingUp size={14} />, impactClass: 'text-primary' };
    if (index % 3 === 1) return { label: 'Neutral', class: 'bg-surface-container-highest text-on-surface-variant border border-outline-variant', icon: <Minus size={14} />, impactClass: 'text-on-surface-variant' };
    return { label: 'Bearish', class: 'bg-error-container/20 text-error border border-error-container', icon: <TrendingDown size={14} />, impactClass: 'text-error' };
  };

  const tabs = ['All News', 'IT Services', 'Finance', 'Big Tech'];

  const filteredNews = news.filter(item => {
    if (activeTab === 'All News') return true;
    
    const searchText = `${item.title} ${item.summary} ${item.relevant_asset || ''}`.toLowerCase();
    
    if (activeTab === 'IT Services') {
      return ['it', 'tech', 'software', 'service', 'tcs', 'infosys', 'wipro', 'hcl', 'cloud'].some(keyword => searchText.includes(keyword));
    }
    
    if (activeTab === 'Finance') {
      return ['finance', 'bank', 'fund', 'market', 'gold', 'crypto', 'loan', 'hdfc', 'icici', 'capital', 'nifty'].some(keyword => searchText.includes(keyword));
    }
    
    if (activeTab === 'Big Tech') {
      return ['ai', 'google', 'apple', 'meta', 'amazon', 'microsoft', 'big tech', 'techcrunch', 'gemini'].some(keyword => searchText.includes(keyword));
    }
    
    return true;
  });

  return (
    <div className="flex-1 space-y-6 max-w-[1440px] mx-auto pb-10 animate-fade-in-up">
      {/* Header & Sector Focus */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-lg pt-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Market Intelligence</h2>
          <p className="text-on-surface-variant mt-xs">Curated news based on your $2.4M portfolio holdings.</p>
        </div>
        
        {/* Sector Focus Tabs */}
        <div className="flex bg-surface-container p-1 rounded-xl">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-lg py-sm rounded-lg text-sm transition-all ${
                activeTab === tab 
                  ? 'bg-white shadow-sm text-primary font-bold' 
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Portfolio News Feed (Primary) */}
        <div className="col-span-12 lg:col-span-8 space-y-md">
          <div className="flex items-center justify-between px-sm mb-xs">
            <h3 className="font-headline-sm text-headline-sm flex items-center gap-sm">
              <BarChart2 className="text-primary" size={24} />
              Portfolio News
            </h3>
            <button className="text-primary font-bold text-sm hover:underline">Mark all read</button>
          </div>

          {filteredNews.map((item, index) => {
            const sentiment = getSentiment(index);
            const assetTicker = item.relevant_asset ? item.relevant_asset.substring(0, 4).toUpperCase() : 'MKT';
            
            return (
              <article key={index} className="glass-card p-lg rounded-brand hover:border-primary/20 transition-all cursor-pointer group bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
                <div className="flex items-start justify-between mb-md">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 bg-on-background rounded-xl flex items-center justify-center">
                      <span className="text-white font-black text-sm">{assetTicker}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{item.relevant_asset || 'Market Update'}</h4>
                      <p className="text-xs text-on-surface-variant">{item.source || 'Bloomberg'} • {item.published_at || 'Just now'}</p>
                    </div>
                  </div>
                  <span className={`px-sm py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${sentiment.class}`}>
                    {sentiment.label}
                  </span>
                </div>
                
                <h5 className="text-body-lg font-semibold mb-sm group-hover:text-primary transition-colors">
                  {item.title}
                </h5>
                <p className="text-on-surface-variant text-sm line-clamp-2 mb-md">
                  {item.summary}
                </p>
                
                <div className="flex items-center gap-xl">
                  <div className={`flex items-center gap-xs font-bold text-xs ${sentiment.impactClass}`}>
                    {sentiment.icon}
                    Impact: {sentiment.label === 'Neutral' ? 'Minimal' : (sentiment.label === 'Bullish' ? '+2.1%' : '-1.2%')}
                  </div>
                  <div className="flex items-center gap-xs text-on-surface-variant text-xs">
                    <MessageCircle size={14} />
                    {Math.floor(Math.random() * 50) + 5} comments
                  </div>
                  <div className="ml-auto flex gap-sm">
                    <button 
                      onClick={(e) => toggleBookmark(index, e)}
                      className="p-xs hover:bg-surface-container rounded-full transition-colors"
                    >
                      <Bookmark size={16} className={bookmarkedArticles.has(index) ? "fill-primary text-primary" : "text-on-surface-variant"} />
                    </button>
                    <button 
                      onClick={(e) => handleShare(item, e)}
                      className="p-xs hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredNews.length === 0 && (
            <div className="py-16 glass-card text-center animate-fade-in bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-brand shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
                <BarChart2 size={24} className="text-on-surface-variant" />
              </div>
              <p className="text-sm text-on-surface font-bold mb-1">No personalized news yet</p>
              <p className="text-xs text-on-surface-variant">Add portfolio assets to compile news matching your holdings.</p>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          {/* AI News Pulse */}
          <section className="bg-white p-lg rounded-brand overflow-hidden relative shadow-[0_0_20px_rgba(139,92,246,0.15)] border-t-2 border-[#8B5CF6]">
            <div className="absolute top-0 right-0 p-lg opacity-10">
              <Sparkles className="w-16 h-16 text-tertiary" />
            </div>
            <div className="flex items-center gap-sm mb-md relative z-10">
              <Zap className="text-tertiary" fill="currentColor" size={24} />
              <h3 className="font-headline-sm text-headline-sm text-tertiary">AI News Pulse</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-lg relative z-10">
              Finny analyzed 1,400+ articles to find what matters for you today:
            </p>
            
            <div className="space-y-lg relative z-10">
              <div className="flex gap-md">
                <div className="font-mono-sm text-tertiary font-bold bg-tertiary/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0">1</div>
                <p className="text-sm text-on-surface leading-relaxed">
                  <strong>Tech Sector Rotation:</strong> High AAPL correlation suggests watching $185 resistance levels closely today.
                </p>
              </div>
              <div className="flex gap-md">
                <div className="font-mono-sm text-tertiary font-bold bg-tertiary/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0">2</div>
                <p className="text-sm text-on-surface leading-relaxed">
                  <strong>Interest Rate Hedging:</strong> Bank margin stability provides a 4% safety buffer against projected rate hikes.
                </p>
              </div>
              <div className="flex gap-md">
                <div className="font-mono-sm text-tertiary font-bold bg-tertiary/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0">3</div>
                <p className="text-sm text-on-surface leading-relaxed">
                  <strong>IT Sector Warning:</strong> Sector-wide IT attrition is high; diversification may mitigate risk.
                </p>
              </div>
            </div>
            
            <button className="w-full mt-xl border border-tertiary text-tertiary py-sm rounded-xl text-sm font-bold hover:bg-tertiary hover:text-white transition-all relative z-10">
              Ask Finny for Details
            </button>
          </section>

          {/* Correlated Market Movers */}
          <section className="glass-card p-lg rounded-brand bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-bold text-on-surface flex items-center gap-sm">
                <Activity className="text-secondary" size={20} />
                Market Movers
              </h3>
              <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded uppercase font-bold">Correlated</span>
            </div>
            
            <div className="space-y-md">
              {/* Mover 1 */}
              <div className="group p-md rounded-xl hover:bg-surface-container transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-on-surface">TCS.NS</span>
                  <span className="text-primary font-bold text-xs">+1.4%</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2">Secures $2B deal with UK retail giant, lifting IT sector sentiment.</p>
                <div className="mt-sm flex items-center gap-xs">
                  <span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span>
                  <span className="text-[10px] text-on-surface-variant">Linked to your <strong>IT Holdings</strong></span>
                </div>
              </div>
              
              {/* Mover 2 */}
              <div className="group p-md rounded-xl hover:bg-surface-container transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-on-surface">GOOGL</span>
                  <span className="text-primary font-bold text-xs">+0.8%</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2">New Gemini API pricing announced, analysts upgrade targets.</p>
                <div className="mt-sm flex items-center gap-xs">
                  <span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span>
                  <span className="text-[10px] text-on-surface-variant">Linked to your <strong>Tech Holdings</strong></span>
                </div>
              </div>
              
              {/* Mover 3 */}
              <div className="group p-md rounded-xl hover:bg-surface-container transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-on-surface">ICICI.NS</span>
                  <span className="text-error font-bold text-xs">-0.4%</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2">RBI audits unsecured loan portfolios across private banks.</p>
                <div className="mt-sm flex items-center gap-xs">
                  <span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span>
                  <span className="text-[10px] text-on-surface-variant">Linked to your <strong>Finance Holdings</strong></span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-md text-secondary font-bold text-xs flex items-center justify-center gap-xs hover:gap-md transition-all">
              View All Movers <ArrowRight size={14} />
            </button>
          </section>

          {/* Market Health Widget */}
          <div className="rounded-brand overflow-hidden h-40 relative shadow-sm border border-slate-200/80">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCwi6I_Lg41JS9j1os__lxool00g3sahrgyouzo1GHwlhV7G0T6vU-N4j4iruZcLZ30BCgl27n15neIo4sH5W98JVtJyAXZEy1o0LlhvcTIclxYZW9lTOgENoAXLb24TsjY6RSFuITDjpskplj9vsVz4BNng5fZt1XVPOsuALLo8a-yteV3PXmbOqdtxJV8UBs0WgBD1fpvpYjD2lLfeTXPWkFsShfKaVREG2p5hucoMeSQK5WxtAbbLe-lZvo7w30RDbQdFi9tic"
              alt="Market Health"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-lg">
              <span className="text-white font-bold text-sm">Global Market Sentiment</span>
              <div className="flex items-center gap-md mt-sm">
                <div className="h-2 flex-grow bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[68%]"></div>
                </div>
                <span className="text-primary font-bold text-xs uppercase">Greed 68%</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
