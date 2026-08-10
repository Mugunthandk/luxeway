import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { X, ArrowRight, Layers } from 'lucide-react';

export const CompareBar: React.FC = () => {
  const { compareList, toggleCompare, clearCompare, formatPrice } = useApp();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-3xl bg-[#1b1c1c] text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-[#3b3838] flex items-center justify-between animate-slideUp">
      
      <div className="flex items-center space-x-3 overflow-x-auto py-1 scrollbar-none">
        <div className="flex items-center space-x-2 pr-3 border-r border-[#3b3838]">
          <Layers className="w-5 h-5 text-[#ffdea5]" />
          <div>
            <p className="font-serif font-bold text-xs text-[#ffdea5]">Comparison Engine</p>
            <p className="text-[10px] text-[#9a9696]">{compareList.length} of 4 selected</p>
          </div>
        </div>

        {compareList.map((p) => (
          <div
            key={p.id}
            className="flex items-center space-x-2 bg-[#2d2a2a] px-2.5 py-1.5 rounded-lg shrink-0 border border-[#4a4646]"
          >
            <img src={p.images[0]} alt={p.title} className="w-8 h-8 rounded object-cover" />
            <div className="text-[11px]">
              <p className="font-semibold text-white line-clamp-1 max-w-[100px]">{p.title}</p>
              <p className="text-[#ffdea5] text-[10px]">{formatPrice(p.pricePerNight)}</p>
            </div>
            <button
              onClick={() => toggleCompare(p)}
              className="p-1 text-[#9a9696] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2 shrink-0 ml-2">
        <button
          onClick={clearCompare}
          className="text-[11px] text-[#9a9696] hover:text-white px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
        <Link
          to="/compare"
          className="px-4 py-2 bg-[#ffdea5] text-[#1b1c1c] font-bold text-xs rounded-xl hover:bg-[#ffe7be] transition-colors flex items-center space-x-1 shadow"
        >
          <span>Compare Stays</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
