import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenCustomizer: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenCustomizer,
  onOpenAbout,
  onOpenContact,
  onOpenAdmin,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#111113] text-[#f0f0f0] border-t border-[rgba(240,240,240,0.1)]">
      {/* Newsletter Architectural Pane */}
      <div className="border-b border-[rgba(240,240,240,0.1)] py-12 px-6 sm:px-12 bg-[#161618]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#d48b7a] font-bold">
              Dispatch 01 / The Baker's Circle
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase text-[#f0f0f0]">
              Subscribe for Secret Recipes & 15% Off
            </h3>
            <p className="font-sans text-xs text-[#f0f0f0]/60 max-w-xl">
              Receive weekend pastry chef creations, secret dessert formulas, and seasonal private collections.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="bg-emerald-950/60 text-emerald-300 px-5 py-3 border border-emerald-700/60 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Welcome! Check your inbox for code SWEET15.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-md">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-3 bg-[#111113] border border-[rgba(240,240,240,0.2)] text-xs text-[#f0f0f0] placeholder-[#f0f0f0]/40 font-mono focus:outline-none focus:border-[#d48b7a] flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap"
                >
                  Join Circle
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main 4-Column Architectural Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 font-sans text-xs text-[#f0f0f0]/70">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="font-syne font-extrabold text-xl text-[#f0f0f0] tracking-tight uppercase leading-none">
            THE BAKER'S<br />CORNER
          </div>
          <p className="leading-relaxed">
            Handcrafted artisanal cakes, master chocolates, and bespoke wedding centerpieces prepared daily with premium dairy butter and unmatched love.
          </p>
          <div className="font-mono text-[10px] text-[#f0f0f0]/40 tracking-wider">
            FSSAI LIC: 13624011000492 · 100% CERTIFIED ATELIER
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#d48b7a]">
            Curated Collections
          </h4>
          <ul className="space-y-2.5 font-mono text-xs uppercase">
            <li>
              <button
                onClick={() => onSelectCategory('cat-1')}
                className="hover:text-[#d48b7a] transition-colors text-left"
              >
                Everyday Celebration
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('cat-4')}
                className="hover:text-[#d48b7a] transition-colors text-left"
              >
                Belgian Truffle Ganache
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('cat-6')}
                className="hover:text-[#d48b7a] transition-colors text-left"
              >
                Red Velvet Cream Cheese
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('cat-11')}
                className="hover:text-[#d48b7a] transition-colors text-left"
              >
                100% Pure Eggless
              </button>
            </li>
            <li>
              <button
                onClick={onOpenCustomizer}
                className="text-[#d48b7a] hover:underline transition-colors text-left font-bold"
              >
                Start Cake Customizer →
              </button>
            </li>
          </ul>
        </div>

        {/* The Atelier Details */}
        <div className="space-y-4">
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#d48b7a]">
            The Atelier
          </h4>
          <ul className="space-y-2.5">
            <li>
              <button onClick={onOpenAbout} className="hover:text-[#d48b7a] transition-colors text-left">
                Our Story & Heritage
              </button>
            </li>
            <li>
              <button onClick={onOpenContact} className="hover:text-[#d48b7a] transition-colors text-left">
                Kitchen Directions & Contact
              </button>
            </li>
            <li>Same-Day Delivery: 09:00 AM – 11:30 PM</li>
            <li>Midnight Surprise Delivery Available</li>
            <li>Bespoke Wedding & Corporate Catering</li>
          </ul>
        </div>

        {/* Operations & Admin */}
        <div className="space-y-4">
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#d48b7a]">
            Operations & Portal
          </h4>
          <ul className="space-y-2.5">
            <li>Freshness Guarantee & Tamper-Proof Packaging</li>
            <li>Cancellation up to 4 hours prior to dispatch</li>
            <li>Simulated Payment Gateway Verified</li>
            <li className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="font-mono text-xs text-[#d48b7a] hover:text-white uppercase font-bold flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Executive Admin Portal →</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Ticker Pane */}
      <div className="border-t border-[rgba(240,240,240,0.1)] py-5 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between font-mono text-[11px] text-[#f0f0f0]/50 gap-4">
        <div>© 2026 THE BAKER'S CORNER · ALL RIGHTS RESERVED</div>
        <div className="flex items-center gap-4 text-[#f0f0f0]/60">
          <span>SINCE 2012</span>
          <span>·</span>
          <span>BOUTIQUE PÂTISSERIE</span>
          <span>·</span>
          <span className="text-[#d48b7a]">CODE: SWEET10</span>
        </div>
      </div>
    </footer>
  );
};
