import React from 'react';
import { useApp } from '../context/AppContext';
import { Newspaper, ExternalLink, Calendar, Bookmark, TrendingUp, Zap, ChevronRight } from 'lucide-react';

export default function News() {
  const { news, loading } = useApp();

  if (loading && news.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-blue-500 border-r-blue-500/30"></div>
          </div>
          <span className="text-[11px] text-indigo-600/80 font-semibold uppercase tracking-[0.2em] animate-pulse">Loading feed...</span>
        </div>
      </div>
    );
  }

  const getAssetColor = (asset) => {
    if (!asset) return { border: '#8B5CF6', bg: 'rgba(59,130,246,0.08)', text: 'text-indigo-600' };
    const a = asset.toLowerCase();
    if (a.includes('gym') || a.includes('health') || a.includes('office') || a.includes('ergonomic'))
      return { border: '#4F46E5', bg: 'rgba(16,185,129,0.08)', text: 'text-indigo-600' };
    if (a.includes('book') || a.includes('bootcamp') || a.includes('course') || a.includes('learn'))
      return { border: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', text: 'text-purple-400' };
    if (a.includes('market') || a.includes('nifty') || a.includes('stock'))
      return { border: '#8B5CF6', bg: 'rgba(59,130,246,0.08)', text: 'text-indigo-600' };
    return { border: '#F59E0B', bg: 'rgba(245,158,11,0.08)', text: 'text-amber-400' };
  };

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-end animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-green">
              <Zap size={10} />
              Curated
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Market <span className="text-gradient-brand">Intelligence</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">Custom financial and wellness news matched to your active portfolios.</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <TrendingUp size={14} className="text-indigo-600" />
          <span>{news.length} articles matched</span>
        </div>
      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {news.map((item, index) => {
          const colors = getAssetColor(item.relevant_asset);
          return (
            <div 
              key={index} 
              className="glass-card glass-card-hover p-5 flex flex-col justify-between animate-fade-in-up group"
              style={{ 
                animationDelay: `${index * 75}ms`,
                borderLeft: `3px solid ${colors.border}`
              }}
            >
              <div>
                {/* Meta row */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] px-2.5 py-1 rounded-md bg-gray-50 text-[var(--text-muted)] border border-white/5 font-semibold uppercase tracking-[0.1em]">
                    {item.source}
                  </span>
                  
                  {/* Linked Asset tag badge */}
                  <span 
                    className={`text-[10px] ${colors.text} font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md`}
                    style={{ backgroundColor: colors.bg }}
                  >
                    <Bookmark size={10} />
                    <span className="max-w-[120px] truncate">{item.relevant_asset}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-2 leading-snug group-hover:text-indigo-600 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-3">
                  {item.summary}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="flex justify-between items-center border-t border-white/5 pt-3 text-[10px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} />
                  <span>{item.published_at}</span>
                </span>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert("Redirecting to full coverage article..."); }}
                  className="text-indigo-600 hover:text-emerald-300 font-semibold flex items-center gap-1 group/link"
                >
                  <span>Read Article</span>
                  <ChevronRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}

        {news.length === 0 && (
          <div className="col-span-2 py-16 glass-card text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-white/5 flex items-center justify-center mx-auto mb-4">
              <Newspaper size={24} className="text-gray-600" />
            </div>
            <p className="text-sm text-gray-400 font-medium mb-1">No personalized news yet</p>
            <p className="text-xs text-gray-500">Add portfolio assets (traditional or life) to compile news matching your holdings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
