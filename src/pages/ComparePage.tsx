import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Check, X, ArrowLeft, Star, Bed, Users, ShieldCheck } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { compareList, toggleCompare, clearCompare, formatPrice } = useApp();
  const navigate = useNavigate();

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#1b1c1c]">No Residences Selected for Comparison</h2>
        <p className="text-xs text-[#6a6666]">Browse our portfolio and click "Compare" on properties to evaluate side-by-side.</p>
        <Link
          to="/stays"
          className="inline-block px-6 py-3 bg-[#1b1c1c] text-[#ffdea5] font-bold text-xs rounded-xl hover:bg-[#2e2d2d]"
        >
          Explore Stays
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between border-b border-[#e6e2e2] pb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#4a4646] hover:text-[#1b1c1c] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1b1c1c]">
            Side-by-Side Evaluation
          </h1>
        </div>
        <button
          onClick={clearCompare}
          className="px-4 py-2 border border-[#a33838] text-[#a33838] font-semibold text-xs rounded-xl hover:bg-[#a33838] hover:text-white transition-colors"
        >
          Clear Matrix
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] grid grid-cols-5 gap-4">
          
          {/* Label Header Column */}
          <div className="space-y-6 pt-24 font-semibold text-xs text-[#6a6666] border-r border-[#e8e4e4] pr-4">
            <div className="h-10 flex items-center">Price / Night</div>
            <div className="h-10 flex items-center">Location</div>
            <div className="h-10 flex items-center">Property Type</div>
            <div className="h-10 flex items-center">Bedrooms & Guests</div>
            <div className="h-10 flex items-center">Rating</div>
            <div className="h-10 flex items-center">Host Superhost</div>
            <div className="h-24 flex items-center">Top Amenities</div>
            <div className="h-12 flex items-center">Action</div>
          </div>

          {/* Item Columns */}
          {compareList.map((p) => (
            <div key={p.id} className="space-y-6 bg-white p-4 rounded-2xl border border-[#e8e4e4] relative">
              <button
                onClick={() => toggleCompare(p)}
                className="absolute top-2 right-2 p-1 text-[#9a9696] hover:text-[#a33838]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2 h-20">
                <img src={p.images[0]} alt={p.title} className="w-full h-12 object-cover rounded-lg" />
                <h4 className="font-serif font-bold text-xs text-[#1b1c1c] line-clamp-1">{p.title}</h4>
              </div>

              <div className="h-10 font-serif font-bold text-base text-[#1b1c1c]">
                {formatPrice(p.pricePerNight)}
              </div>

              <div className="h-10 text-xs text-[#524e4e]">{p.location}</div>
              <div className="h-10 text-xs text-[#524e4e]">{p.propertyType}</div>
              <div className="h-10 text-xs text-[#524e4e]">{p.bedrooms} Beds • {p.maxGuests} Guests</div>
              
              <div className="h-10 text-xs font-bold text-[#1b1c1c] flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#b8860b] fill-current" />
                {p.rating}
              </div>

              <div className="h-10 text-xs text-[#524e4e]">
                {p.host.superhost ? <span className="text-[#b8860b] font-bold">Yes (Superhost)</span> : 'Standard Host'}
              </div>

              <div className="h-24 text-[11px] text-[#524e4e] overflow-y-auto space-y-1">
                {p.amenities.slice(0, 4).map((a, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#b8860b]" /> {a}
                  </div>
                ))}
              </div>

              <div className="h-12">
                <Link
                  to={`/stays/${p.id}`}
                  className="block text-center py-2 bg-[#1b1c1c] text-[#ffdea5] font-bold text-xs rounded-xl hover:bg-[#2e2d2d]"
                >
                  Reserve
                </Link>
              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
};
