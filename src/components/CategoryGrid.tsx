import React from 'react';
import type { Category } from '../types/bakery';
import { CakeFallbackImage } from './CakeFallbackImage';

interface CategoryGridProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <section className="py-12 bg-[#111113] border-b border-[rgba(240,240,240,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-[rgba(240,240,240,0.1)]">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#d48b7a] mb-1">
              Section 02 / Curated Collections
            </div>
            <h2 className="font-syne text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#f0f0f0]">
              Explore Our Cake Categories
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className={`font-mono text-xs uppercase tracking-wider transition-colors pb-1 border-b ${
              selectedCategoryId === 'all'
                ? 'text-[#d48b7a] border-[#d48b7a]'
                : 'text-[#f0f0f0]/60 border-transparent hover:text-[#f0f0f0]'
            }`}
          >
            All Collections ({categories.length})
          </button>
        </div>

        {/* 12 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`text-left group p-3 transition-all duration-200 border relative ${
                  isSelected
                    ? 'bg-[#1a1a1c] border-[#d48b7a] shadow-lg ring-1 ring-[#d48b7a]'
                    : 'bg-[#161618] border-[rgba(240,240,240,0.1)] hover:bg-[#1a1a1c] hover:border-[rgba(240,240,240,0.25)]'
                }`}
              >
                <div className="aspect-square overflow-hidden mb-2.5 relative bg-[#111113]">
                  <CakeFallbackImage
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#d48b7a]/15 border-2 border-[#d48b7a] pointer-events-none" />
                  )}
                </div>
                <h3 className={`font-syne font-bold text-xs uppercase line-clamp-1 transition-colors ${
                  isSelected ? 'text-[#d48b7a]' : 'text-[#f0f0f0] group-hover:text-[#d48b7a]'
                }`}>
                  {cat.name}
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#f0f0f0]/50 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

