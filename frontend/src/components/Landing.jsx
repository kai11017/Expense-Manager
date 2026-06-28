import React, { useEffect } from 'react';

export default function Landing({ onLoginClick }) {
  useEffect(() => {
    // Add scroll fade-in effects
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.bento-grid > div, .testimonial-card');
    elements.forEach(el => {
      el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
      observer.observe(el);
    });

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="font-body-md text-body-md overflow-x-hidden bg-background text-on-surface">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-gutter py-md bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-xl">
          <a className="text-headline-lg md:text-display-sm font-bold text-primary tracking-tight whitespace-nowrap" href="/">FinPilot</a>
          <div className="hidden md:flex items-center gap-lg">
            <a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md" href="#">Stocks</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-250 font-body-md text-body-md" href="#">Mutual Funds</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-250 font-body-md text-body-md" href="#">F&amp;O</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-250 font-body-md text-body-md" href="#">Gold</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-250 font-body-md text-body-md" href="#">Fixed Deposits</a>
          </div>
        </div>
        <div className="flex items-center gap-xs md:gap-md">
          <button onClick={onLoginClick} className="px-sm py-xs md:px-lg md:py-sm bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-95 transition-all shadow-sm text-sm md:text-base whitespace-nowrap">Get Started</button>
        </div>
      </nav>

      <main className="pt-xxl">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-gutter overflow-hidden bg-white">
          <div className="max-w-container-max mx-auto grid lg:grid-cols-2 gap-xxl items-center py-xxl">
            <div className="z-10 text-center lg:text-left space-y-lg">
              <div className="inline-flex items-center gap-sm px-md py-xs bg-surface-container-low rounded-full border border-outline-variant">
                <span className="flex h-2 w-2 rounded-full bg-primary-container animate-pulse"></span>
                <span className="text-label-md uppercase tracking-wider text-on-surface-variant">India's #1 Investing Platform</span>
              </div>
              <h1 className="font-display-lg text-display-lg text-on-surface leading-tight">
                Your Financial Universe, <br /><span className="text-primary-container">Simplified.</span>
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-xl">
                Invest in Stocks, Mutual Funds, and Futures with FinPilot—the enterprise-grade OS for your personal wealth. Precision tools for high-growth operators.
              </p>
              <div className="flex flex-col sm:flex-row gap-md justify-center lg:justify-start">
                <button onClick={onLoginClick} className="px-xl py-lg bg-primary text-white text-body-lg font-bold rounded-xl hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-sm">
                  Get Started <span className="material-symbols-outlined">trending_up</span>
                </button>
                <button className="px-xl py-lg border border-outline-variant text-on-surface text-body-lg font-bold rounded-xl hover:bg-surface-container transition-all flex items-center justify-center gap-sm">
                  Watch Demo <span className="material-symbols-outlined">play_circle</span>
                </button>
              </div>
              <div className="pt-lg flex items-center justify-center lg:justify-start gap-xl opacity-60">
                <div className="flex flex-col">
                  <span className="text-headline-sm font-bold">2M+</span>
                  <span className="text-label-md">Active Investors</span>
                </div>
                <div className="w-[1px] h-10 bg-outline-variant"></div>
                <div className="flex flex-col">
                  <span className="text-headline-sm font-bold">4.8/5</span>
                  <span className="text-label-md">App Rating</span>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative animate-bounce-slow">
                <img alt="FinPilot Isometric Universe" className="w-full max-w-[640px] drop-shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0fE60MOdvm-C_ffhWXqSSTxGmXwCWI0dUkz3rDPaBhs8yZ3Ra-CcSTuS3ouBVsT3NgWikD-396LYewi0cSBKWkUGkd5THQejqyzstz-o3eVfXOAXHiIuIRyF-SwOB4EQ1G6FFS3NeZW8Kjgjd6IuUqwmT4OKfBl126khLME5TbWzZcmMaNi-b07urzPHJAgYHCI6AuVRsc9mSKXYZ6MFntBhl1xn5rwpNn0-ssyJpX3-0ZgTqrOg8twzyfNa5A8AUpJe6xEqK_4I" />
              </div>
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </section>

        {/* Product Pillars */}
        <section className="py-xxl px-gutter bg-background">
          <div className="max-w-container-max mx-auto">
            <div className="mb-xxl text-center max-w-2xl mx-auto space-y-md">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Precision instruments for every asset class</h2>
              <p className="text-body-md text-on-surface-variant">From casual SIPs to high-frequency terminal trading, FinPilot provides the infrastructure you need to scale your net worth.</p>
            </div>
            <div className="bento-grid grid grid-cols-12 gap-lg">
              {/* Stocks Card */}
              <div className="col-span-12 lg:col-span-8 bg-white p-lg rounded-xl soft-shadow border border-outline-variant flex flex-col md:flex-row gap-lg hover-lift">
                <div className="flex-1 space-y-sm">
                  <div className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-headline-sm">analytics</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm">Stocks &amp; ETFs</h3>
                  <p className="text-body-sm text-on-surface-variant">Fast, secure trading with real-time analytics. Monitor top intraday performers, access advanced filters like RSI and PE ratios, and manage corporate actions with zero friction.</p>
                  <ul className="grid grid-cols-2 gap-xs text-body-sm text-on-surface font-medium">
                    <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> 100% Paperless</li>
                    <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Instant Order Execution</li>
                    <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Real-time P&amp;L</li>
                    <li className="flex items-center gap-xs"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> MTF (4x Leverage)</li>
                  </ul>
                  <button className="text-primary font-bold flex items-center gap-xs group text-sm">
                    Explore Stocks <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">arrow_forward</span>
                  </button>
                </div>
                <div className="flex-1 bg-surface-container-low rounded-lg p-sm overflow-hidden flex items-end justify-center min-h-[180px]">
                  <img className="w-4/5 rounded-t-lg shadow-md transform rotate-2" alt="Mobile UI" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAFNZXFjCasGSPuv2_mHxJOgo_eyX_SNeHl2b3mvFxr9Ai7lHPc9JByRdW0LYu9tzXved84iSavVaQV0Q9g_3WJIf1IyGNyfmTGQwi-vKRLE8Fyvumk9SEpybb7d8Fc1WrPC-Tjvk8mvgUh8LPLppeQMF2DMIHQPVSNKl2rlST_Q-Mp4_g2gcKkPAP9tw7YSbRObAQMFSVeDCjALh092fAqzWOZ6ilthkXDX4ZPXebp_H78YV9jNCMVHdaWoOI-P87Gf1O435iQsU" />
                </div>
              </div>

              {/* Mutual Funds Card */}
              <div className="col-span-12 lg:col-span-4 bg-white p-lg rounded-xl soft-shadow border border-outline-variant flex flex-col gap-sm hover-lift">
                <div className="w-10 h-10 bg-secondary-container/10 rounded-lg flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-headline-sm">account_balance_wallet</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm">Mutual Funds</h3>
                <p className="text-body-sm text-on-surface-variant">Build long-term wealth with automated SIPs. Compare 5000+ direct funds with zero commission.</p>
                <div className="mt-auto py-sm border-t border-outline-variant">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="text-label-md uppercase text-on-surface-variant">Popular Choice</span>
                    <span className="text-primary font-bold text-sm">+24.5% p.a.</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container w-3/4"></div>
                  </div>
                </div>
                <button className="w-full py-sm border border-outline-variant rounded-lg font-bold hover:bg-surface-container transition-all text-sm mt-xs">Start an SIP</button>
              </div>

              {/* FinPilot Terminal Card */}
              <div className="col-span-12 lg:col-span-4 bg-inverse-surface p-lg rounded-xl soft-shadow text-white flex flex-col gap-sm hover-lift">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-primary-fixed">
                  <span className="material-symbols-outlined text-headline-sm">terminal</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm">FinPilot Terminal</h3>
                <p className="text-body-sm opacity-80">Advanced charting and customisable layout for professional traders. Analyse chains, view payoffs, and create baskets with scalper mode.</p>
                <div className="bg-black/20 p-sm rounded-lg mt-xs">
                  <div className="flex items-center gap-xs mb-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></div>
                    <span className="text-label-md opacity-60">NIFTY 50 LIVE</span>
                  </div>
                  <span className="text-headline-sm font-mono-sm">22,456.80 <span className="text-error text-xs font-normal">-0.45%</span></span>
                </div>
                <button className="mt-auto py-sm bg-primary-container text-on-primary-container rounded-lg font-bold hover:brightness-110 transition-all text-sm">Open Terminal</button>
              </div>

              {/* AI & Automation Card */}
              <div className="col-span-12 lg:col-span-8 bg-white p-lg rounded-xl soft-shadow border border-outline-variant ai-glow flex flex-col md:flex-row items-center gap-lg hover-lift">
                <div className="flex-1 space-y-sm">
                  <div className="inline-block px-sm py-xs bg-tertiary-container/20 text-tertiary rounded-md text-label-md font-bold mb-xs">AI POWERED</div>
                  <h3 className="font-headline-sm text-headline-sm">Intelligent Insights</h3>
                  <p className="text-body-sm text-on-surface-variant">Personalized advisory that understands your risk capacity. Get real-time alerts on market events, dividends, and portfolio rebalancing suggestions powered by FinPilot AI.</p>
                  <div className="flex gap-sm">
                    <div className="p-xs bg-surface-container rounded-lg flex items-center gap-xs">
                      <span className="material-symbols-outlined text-tertiary text-sm">psychology</span>
                      <span className="text-label-md text-on-surface">Predictive Trends</span>
                    </div>
                    <div className="p-xs bg-surface-container rounded-lg flex items-center gap-xs">
                      <span className="material-symbols-outlined text-tertiary text-sm">shield</span>
                      <span className="text-label-md text-on-surface">Risk Mitigation</span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex justify-center py-xs">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-tertiary-container/30 rounded-full animate-ping"></div>
                    <div className="relative z-10 w-full h-full bg-tertiary text-white rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Social Proof */}
        <section className="py-xxl px-gutter bg-white">
          <div className="max-w-container-max mx-auto">
            <div className="text-center space-y-sm mb-xxl">
              <h2 className="font-headline-lg text-headline-lg">Trusted by 2 Crore+ active investors</h2>
              <p className="text-body-md text-on-surface-variant">Real stories from the people building their future on FinPilot.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {/* Testimonial 1 */}
              <div className="testimonial-card p-xl bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col gap-md italic text-on-surface-variant hover:bg-surface-container-low transition-colors">
                <div className="flex gap-xs text-primary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="text-body-md leading-relaxed">"When I came across FinPilot, I found it much easier to understand because of user-friendly design and selection tools. The cherry on top, I got advice that understands my risk capacity."</p>
                <div className="mt-auto pt-md flex items-center gap-md not-italic">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-white font-bold">RG</div>
                  <div>
                    <h4 className="font-bold text-on-surface">Rahul Gupta</h4>
                    <p className="text-label-md uppercase opacity-60">Entrepreneur</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="testimonial-card p-xl bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col gap-md italic text-on-surface-variant hover:bg-surface-container-low transition-colors">
                <div className="flex gap-xs text-primary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="text-body-md leading-relaxed">"Great platform for investment. Features like creating your own portfolio are great. I started investing in MF due to FinPilot only. Very responsive support team."</p>
                <div className="mt-auto pt-md flex items-center gap-md not-italic">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">AS</div>
                  <div>
                    <h4 className="font-bold text-on-surface">Anoop Singh</h4>
                    <p className="text-label-md uppercase opacity-60">Team Lead, Esyasoft</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="testimonial-card p-xl bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col gap-md italic text-on-surface-variant hover:bg-surface-container-low transition-colors">
                <div className="flex gap-xs text-primary-container">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="text-body-md leading-relaxed">"Actually, the UI is extremely simple and easy for users to adapt, that's what makes it unique. Many of my referrals have also joined and are enjoying the platform."</p>
                <div className="mt-auto pt-md flex items-center gap-md not-italic">
                  <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-white font-bold">SM</div>
                  <div>
                    <h4 className="font-bold text-on-surface">Sangeeta Mukherjee</h4>
                    <p className="text-label-md uppercase opacity-60">Principal Solutions Architect, AWS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Teaser */}
        <section className="py-xxl px-gutter bg-background border-t border-outline-variant overflow-hidden">
          <div className="max-w-container-max mx-auto bg-primary rounded-3xl p-xxl text-white relative flex flex-col lg:flex-row items-center gap-xxl">
            <div className="z-10 lg:w-1/2 space-y-lg">
              <h2 className="font-display-lg text-display-lg leading-tight">Finance on the go. <br /><span className="opacity-60">Always with you.</span></h2>
              <p className="text-body-lg opacity-80 max-w-lg">Get the full FinPilot experience on your smartphone. Real-time updates, one-tap trades, and enterprise-grade security wherever you are.</p>
              <div className="flex flex-wrap gap-md pt-md">
                <a className="flex items-center gap-sm px-xl py-md bg-black rounded-xl border border-white/20 hover:bg-black/80 transition-all" href="#">
                  <img className="w-8 h-8" alt="App Store" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXfMdSwZERs_MMTI6QQa5QdCAHlqzm8aWKgy5tUZsIK7Uc55x-TOf2dEZ5_s8vW-WH3NFGd6mhov_9sJtqyi5SpcpjOA02B2rMe_w3CigteQzoT8ZL1Ji6-d50yNw5IVPIzsrsZBpX2fVtAYn-LvngjYW9_FuagE32XAMAK55sYXj7TxRnbwQ-TOUwdgPXX7qD4A7yt_OWkIOCy-QLfsEju4rO_XELjusS6cgsXqL23fWasnrhnx7PwaUyDUWrjRUDOizkn9iCB3g" />
                  <div className="text-left">
                    <p className="text-xs uppercase opacity-60">Download on the</p>
                    <p className="text-lg font-bold">App Store</p>
                  </div>
                </a>
                <a className="flex items-center gap-sm px-xl py-md bg-black rounded-xl border border-white/20 hover:bg-black/80 transition-all" href="#">
                  <img className="w-8 h-8" alt="Google Play" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdmaOdkBp-u0oupI2hCvk0uUZhfo9qKdt5xTKtod7gZ71I47kHwLt7wgvVQKAH4YoiuVJgZxhGLs4UzZ7m4KrLPR2fM1-V83djEGP5z9JGl3UllSnVUmfeBvQlsxWHYPeu2IxMYfF6JMZvtvYLokX6NOUkTL2YG9mfsuEV1Gr8CM4gQpF_cWa2-wCRuMP2L1YjTUxAJnWUiT6iC0fvotRx3XdBKAMh9-t45jCYNoHPuJKTx2vuF9wXO7Fce1en-8mRpCX5XHrFZmo" />
                  <div className="text-left">
                    <p className="text-xs uppercase opacity-60">Get it on</p>
                    <p className="text-lg font-bold">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 relative flex justify-center lg:justify-end">
              <img className="w-full max-w-lg drop-shadow-2xl translate-y-20 lg:translate-y-0" alt="Smartphones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfZOuGsyi1gtooSuw0CMRHErMAN6dstVuTFb2zH_KNoF6RdYkYMY2OLH-ZkPoNydcMrfq5JUhruTsI64u6pxPgvE3bA1zNhnwqnPXKpA5qT938EtT84rYq4LbFY2YG_f3HtX2eZGwg-8H_mp2LOVi1msROU7aPDNY2KxAlM19nx7u0XO1cTb2ciQw29UrcBO4vfwJyhwTyY3kp6hmAvwNUFOV4wApMY-ycUnJpzKioELKRYWx_G6AM6f5QkSjM609_bZaCyFClq84" />
            </div>

            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="90" cy="10" fill="white" r="30"></circle>
                <circle cx="10" cy="90" fill="white" r="40"></circle>
              </svg>
            </div>
          </div>
        </section>

        {/* CTA Final Section */}
        <section className="py-xxl px-gutter text-center space-y-lg">
          <div className="relative w-24 h-24 mx-auto rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container mb-md">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg">No account opening charges, no barriers.</h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">Join the 2 crore Indians already building wealth. Just Groww with FinPilot OS.</p>
          <button onClick={onLoginClick} className="px-xxl py-lg bg-primary text-white text-headline-sm font-bold rounded-xl hover:scale-105 transition-transform shadow-xl">Start Your Journey Now</button>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-xxl px-gutter bg-surface-container mt-xxl border-t border-outline-variant">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-xl mb-xxl">
            <div className="col-span-2 space-y-md">
              <span className="text-headline-sm font-bold text-on-surface">FinPilot</span>
              <p className="text-body-sm text-on-surface-variant">Vaishnavi Tech Park, South Tower, 3rd Floor, Bellandur, Bengaluru – 560103, Karnataka.</p>
              <div className="flex gap-md pt-sm">
                <a className="text-on-surface-variant hover:text-primary transition-all" href="#"><span className="material-symbols-outlined">share</span></a>
                <a className="text-on-surface-variant hover:text-primary transition-all" href="#"><span class="material-symbols-outlined">group</span></a>
                <a className="text-on-surface-variant hover:text-primary transition-all" href="#"><span class="material-symbols-outlined">mail</span></a>
              </div>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="font-bold text-on-surface">Products</span>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Stocks</a>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Mutual Funds</a>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">F&amp;O</a>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">IPO</a>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="font-bold text-on-surface">FinPilot</span>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">About Us</a>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Pricing</a>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Blog</a>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Careers</a>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="font-bold text-on-surface">Legal</span>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Privacy Policy</a>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Terms of Service</a>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Disclosure</a>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="font-bold text-on-surface">Support</span>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Help Center</a>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Contact Us</a>
              <a className="text-body-sm text-on-surface-variant hover:underline" href="#">Trust &amp; Safety</a>
            </div>
          </div>
          <div className="pt-xl border-t border-outline-variant text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-md">
            <p className="text-body-sm text-on-surface-variant">© 2024 FinPilot Financial Services. All rights reserved. SEBI Registration No. INZ000000000.</p>
            <div className="flex items-center gap-md">
              <span className="px-sm py-xs bg-surface-container-high rounded border border-outline-variant text-label-md">NSE</span>
              <span className="px-sm py-xs bg-surface-container-high rounded border border-outline-variant text-label-md">BSE</span>
              <span className="px-sm py-xs bg-surface-container-high rounded border border-outline-variant text-label-md">MCX</span>
            </div>
          </div>
          <div className="mt-xl p-md bg-surface-container-low rounded-lg text-label-md text-on-surface-variant leading-relaxed opacity-60">
            <p>Disclaimer: Investment in securities market are subject to market risks, read all the related documents carefully before investing. Mutual fund investments are subject to market risks. Please read all scheme related documents carefully before investing. Past performance of the schemes is neither an indicator nor a guarantee of future performance. Terms and conditions of the website/app are applicable.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
