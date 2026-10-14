import React, { useState } from 'react';
import { ShoppingBag, Heart, User as UserIcon, Search, ShieldCheck, Check } from 'lucide-react';
import type { User as UserType } from '../types/bakery';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  user: UserType | null;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onOpenWishlist: () => void;
  onSelectCategory: (categoryId: string) => void;
  onNavigateHome: () => void;
  onOpenCustomizer: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  user,
  onOpenCart,
  onOpenAuth,
  onOpenOrders,
  onOpenAdmin,
  onOpenWishlist,
  onSelectCategory,
  onNavigateHome,
  onOpenCustomizer,
  onOpenAbout,
  onOpenContact,
  searchQuery,
  onSearchChange,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('SWEET10');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#111113]/95 backdrop-blur-md border-b border-[rgba(240,240,240,0.1)] transition-all">
      {/* Announcement Bar */}
      <div className="bg-[#1a1a1c] border-b border-[rgba(240,240,240,0.06)] text-[#f0f0f0]/80 font-mono text-[10px] tracking-widest uppercase py-2 px-4 text-center">
        <span className="inline-flex items-center gap-2">
          <span>Freshly Baked Every Morning</span>
          <span aria-hidden="true" className="text-[#d48b7a]">·</span>
          <span>Doorstep Delivery Across The City</span>
          <span aria-hidden="true" className="text-[#d48b7a]">·</span>
          <button
            onClick={handleCopyCode}
            className="text-[#d48b7a] hover:underline font-bold transition-all"
            title="Click to copy SWEET10 code"
          >
            {copiedCode ? 'COPIED: SWEET10' : 'CODE: SWEET10 (10% OFF)'}
          </button>
        </span>
      </div>

      {/* Main Viewport Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_360px] min-h-[72px] lg:h-20 divide-y lg:divide-y-0 lg:divide-x divide-[rgba(240,240,240,0.1)]">
        {/* Pane 1: Brand Wordmark */}
        <div className="px-6 py-3 flex items-center justify-between lg:justify-start gap-4 bg-[#111113]">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="font-syne font-extrabold text-xl sm:text-2xl text-[#f0f0f0] tracking-tighter uppercase leading-none group-hover:text-[#d48b7a] transition-colors">
              THE BAKER'S<br />CORNER
            </div>
          </button>

          {/* Mobile direct icons */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenCart}
              className="px-3 py-1.5 bg-[#f0f0f0] text-[#111113] font-mono text-[11px] font-bold uppercase"
            >
              Bag ({cartCount})
            </button>
          </div>
        </div>

        {/* Pane 2: Header Nav */}
        <nav className="px-6 py-3 flex items-center justify-center gap-6 sm:gap-8 font-mono text-xs uppercase tracking-wider font-bold overflow-x-auto bg-[#111113]">
          <button
            onClick={() => onSelectCategory('all')}
            className="text-[#d48b7a] hover:text-[#f0f0f0] transition-colors whitespace-nowrap shrink-0"
          >
            Catalogue
          </button>
          <button
            onClick={onOpenCustomizer}
            className="text-[#f0f0f0]/80 hover:text-[#d48b7a] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Bespoke Design</span>
            <span className="w-1.5 h-1.5 bg-[#d48b7a]" />
          </button>
          <button
            onClick={onOpenAbout}
            className="text-[#f0f0f0]/80 hover:text-[#d48b7a] transition-colors whitespace-nowrap shrink-0"
          >
            The Lab
          </button>
          <button
            onClick={onOpenContact}
            className="text-[#f0f0f0]/80 hover:text-[#d48b7a] transition-colors whitespace-nowrap shrink-0"
          >
            Contact
          </button>
        </nav>

        {/* Pane 3: Actions (Promo Code + Search + Wishlist + Orders + Auth + Bag) */}
        <div className="px-6 py-3 flex items-center justify-end gap-3 sm:gap-4 bg-[#111113]">
          {/* Promo code badge */}
          <button
            onClick={handleCopyCode}
            className="hidden xl:flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#d48b7a] hover:text-white transition-colors cursor-pointer"
            title="Click to copy promo code"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">COPIED!</span>
              </>
            ) : (
              <span>CODE: SWEET10</span>
            )}
          </button>

          {/* Search Toggle / Box */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] px-3 py-1.5 w-40 sm:w-56 transition-all">
                <Search className="w-3.5 h-3.5 text-[#f0f0f0]/60 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="w-full font-mono text-xs bg-transparent focus:outline-none text-[#f0f0f0]"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="font-mono text-xs text-[#f0f0f0]/60 hover:text-white ml-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                title="Search cakes"
                className="p-2 text-[#f0f0f0]/80 hover:text-[#d48b7a] hover:bg-[#1a1a1c] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Orders */}
          <button
            onClick={onOpenOrders}
            className="p-2 text-[#f0f0f0]/70 hover:text-[#d48b7a] hover:bg-[#1a1a1c] transition-colors hidden sm:block font-mono text-xs uppercase"
            title="Track Orders"
          >
            Orders
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            title="Saved Cakes"
            className="relative p-2 text-[#f0f0f0]/80 hover:text-[#d48b7a] hover:bg-[#1a1a1c] transition-colors"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#d48b7a]" />
            )}
          </button>

          {/* Admin Portal quick link */}
          <button
            onClick={onOpenAdmin}
            title="Admin Portal"
            className="p-2 text-[#f0f0f0]/70 hover:text-[#d48b7a] hover:bg-[#1a1a1c] transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Customer Auth Account */}
          <button
            onClick={onOpenAuth}
            title={user ? `Signed in as ${user.fullName}` : 'Sign In'}
            className="flex items-center gap-1.5 p-2 text-[#f0f0f0]/80 hover:text-[#d48b7a] hover:bg-[#1a1a1c] transition-colors"
          >
            <UserIcon className="w-4 h-4" />
            {user && (
              <span className="hidden sm:inline font-mono text-[10px] uppercase font-bold text-[#f0f0f0]/90">
                {user.fullName.split(' ')[0]}
              </span>
            )}
          </button>

          {/* Bag Button */}
          <button
            onClick={onOpenCart}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag ({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
