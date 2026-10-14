import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onCustomize: () => void;
  onSelectCategory?: (categoryId: string) => void;
  onOpenAdmin?: () => void;
  activeCategoryId?: string;
  featuredProductImage?: string;
  onOpenProductByName?: (name: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopNow,
  onCustomize,
  onSelectCategory,
  onOpenAdmin,
  activeCategoryId = 'all',
  onOpenProductByName,
}) => {
  return (
    <section className="border-b border-[rgba(240,240,240,0.1)] bg-[#111113]">
      {/* 3-Pane Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_360px] divide-y lg:divide-y-0 lg:divide-x divide-[rgba(240,240,240,0.1)] min-h-[580px]">
        {/* Left Sidebar Pane */}
        <div className="p-6 sm:p-8 flex flex-col justify-between bg-[#111113]">
          <div>
            <div className="font-mono text-[11px] text-[#f0f0f0]/60 uppercase tracking-widest mb-6">
              Section 01 / Navigation
            </div>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('cat-1')}
                  className={`text-left font-mono text-xs uppercase tracking-wider font-semibold transition-all block w-full ${
                    activeCategoryId === 'cat-1'
                      ? 'text-[#d48b7a]'
                      : 'text-[#f0f0f0]/60 hover:text-[#f0f0f0]'
                  }`}
                >
                  Everyday Celebration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('cat-4')}
                  className={`text-left font-mono text-xs uppercase tracking-wider font-semibold transition-all block w-full ${
                    activeCategoryId === 'cat-4'
                      ? 'text-[#d48b7a]'
                      : 'text-[#f0f0f0]/60 hover:text-[#f0f0f0]'
                  }`}
                >
                  Artisanal Pâtisserie
                </button>
              </li>
              <li>
                <button
                  onClick={onCustomize}
                  className="text-left font-mono text-xs uppercase tracking-wider font-semibold text-[#f0f0f0]/60 hover:text-[#d48b7a] transition-all block w-full flex items-center justify-between"
                >
                  <span>Bespoke Workshop</span>
                  <span className="w-1.5 h-1.5 bg-[#d48b7a]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('cat-10')}
                  className={`text-left font-mono text-xs uppercase tracking-wider font-semibold transition-all block w-full ${
                    activeCategoryId === 'cat-10'
                      ? 'text-[#d48b7a]'
                      : 'text-[#f0f0f0]/60 hover:text-[#f0f0f0]'
                  }`}
                >
                  Bulk & Wedding
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAdmin && onOpenAdmin()}
                  className="text-left font-mono text-xs uppercase tracking-wider font-semibold text-[#f0f0f0]/40 hover:text-[#d48b7a] transition-all block w-full flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-[rgba(240,240,240,0.1)]">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#d48b7a]">
              Since 2012
            </div>
            <p className="font-sans text-xs text-[#f0f0f0]/70 mt-2 leading-relaxed">
              Handcrafted in our master bakery using farm-fresh ingredients, pure dairy butter, and artisanal passion.
            </p>
          </div>
        </div>

        {/* Center Main Hero Pane */}
        <div
          className="p-8 sm:p-12 lg:p-16 flex flex-col justify-end relative min-h-[460px] lg:min-h-full bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to top, #111113 0%, rgba(17,17,19,0.7) 45%, rgba(17,17,19,0.3) 100%), url('https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80')`,
          }}
        >
          <div className="relative z-10 max-w-2xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#d48b7a] mb-4 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[#d48b7a]" />
              <span>Master Pâtisserie & Cake Atelier</span>
            </div>

            <h1 className="font-syne font-extrabold text-4xl sm:text-6xl lg:text-7xl uppercase text-[#f0f0f0] tracking-tight leading-[0.88] mb-6 text-balance">
              Every Celebration<br />Deserves A Cake
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#f0f0f0]/80 max-w-xl leading-relaxed mb-8">
              From multilayer Belgian chocolate ganache to bespoke tiered wedding centerpieces, our pastry chefs hand-bake each order using pure dairy butter and artisanal love.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onShopNow}
                className="px-7 py-3.5 bg-[#f0f0f0] text-[#111113] hover:bg-[#d48b7a] font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onCustomize}
                className="px-7 py-3.5 bg-transparent border border-[#f0f0f0] text-[#f0f0f0] hover:border-[#d48b7a] hover:text-[#d48b7a] font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#d48b7a]" />
                <span>Start Customizer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Pane */}
        <div className="divide-y divide-[rgba(240,240,240,0.1)] bg-[#111113] flex flex-col">
          {/* Sub-pane 1: Hot Selections */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#f0f0f0]/60 mb-4">
                Hot Selections
              </div>
              <div className="border-b border-[rgba(240,240,240,0.1)] pb-5 mb-4">
                <div className="font-syne font-extrabold text-4xl sm:text-5xl text-[#d48b7a] tabular-nums">
                  ₹699
                </div>
                <div className="font-mono text-[11px] text-[#f0f0f0]/80 uppercase tracking-wider mt-1">
                  Belgian Truffle / Start
                </div>
              </div>
              <p className="font-sans text-xs text-[#f0f0f0]/70 leading-relaxed">
                Rich 54% Callebaut Ganache · 100% Eggless Option. Our most ordered signature item.
              </p>
            </div>

            <button
              onClick={() => onOpenProductByName && onOpenProductByName('Belgian Chocolate Truffle')}
              className="mt-6 text-left font-mono text-[11px] text-[#d48b7a] hover:text-white uppercase tracking-wider transition-colors"
            >
              Order Signature Truffle →
            </button>
          </div>

          {/* Sub-pane 2: Customer Favorites Strip */}
          <div className="p-6 sm:p-8">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#f0f0f0]/60 mb-4">
              Customer Favorites
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onOpenProductByName && onOpenProductByName('Black Forest')}
                className="text-left group bg-[#1a1a1c] p-2 border border-[rgba(240,240,240,0.1)] hover:border-[#d48b7a] transition-all"
              >
                <div className="aspect-square bg-[#111113] overflow-hidden mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=400&q=80"
                    alt="Black Forest"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-syne font-bold text-[10px] text-[#f0f0f0] uppercase truncate group-hover:text-[#d48b7a]">
                  Black Forest
                </h4>
              </button>

              <button
                onClick={() => onOpenProductByName && onOpenProductByName('Red Velvet')}
                className="text-left group bg-[#1a1a1c] p-2 border border-[rgba(240,240,240,0.1)] hover:border-[#d48b7a] transition-all"
              >
                <div className="aspect-square bg-[#111113] overflow-hidden mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=400&q=80"
                    alt="Red Velvet"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-syne font-bold text-[10px] text-[#f0f0f0] uppercase truncate group-hover:text-[#d48b7a]">
                  Red Velvet
                </h4>
              </button>

              <button
                onClick={() => onOpenProductByName && onOpenProductByName('Cupcake')}
                className="text-left group bg-[#1a1a1c] p-2 border border-[rgba(240,240,240,0.1)] hover:border-[#d48b7a] transition-all"
              >
                <div className="aspect-square bg-[#111113] overflow-hidden mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=400&q=80"
                    alt="Cupcakes"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-syne font-bold text-[10px] text-[#f0f0f0] uppercase truncate group-hover:text-[#d48b7a]">
                  Cupcakes
                </h4>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
