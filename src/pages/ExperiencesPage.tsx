import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Experience } from '../types';
import { apiService } from '../services/api';
import { useApp } from '../context/AppContext';
import { Star, ShieldCheck, Clock, Users, ArrowRight, Anchor, Plane, Compass } from 'lucide-react';

export const ExperiencesPage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { formatPrice } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getExperiences().then(setExperiences);
  }, []);

  const categories = ['All', 'Luxury', 'Food', 'Adventure', 'Wellness'];

  const filtered = categoryFilter === 'All'
    ? experiences
    : experiences.filter(e => e.category === categoryFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#b8860b]">
          Aviation & Marine Aviation
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1b1c1c]">
          Charters & Curated Experiences
        </h1>
        <p className="text-xs sm:text-sm text-[#6a6666]">
          Private mega-yacht sailings, helicopter mountain summits, Michelin in-villa chef tastings, and overwater marine wellness.
        </p>
      </div>

      {/* Category Chips */}
      <div className="flex justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              categoryFilter === cat
                ? 'bg-[#1b1c1c] text-[#ffdea5] border-[#1b1c1c]'
                : 'bg-white text-[#4a4646] border-[#e2dede] hover:bg-[#f5f2ed]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Experience Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filtered.map((exp) => (
          <div
            key={exp.id}
            onClick={() => navigate(`/experiences/${exp.id}`)}
            className="group bg-white rounded-3xl border border-[#e8e4e4] overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row h-full"
          >
            <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden">
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#ffdea5] text-[10px] font-bold uppercase">
                {exp.category}
              </span>
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#7a7676]">
                  <span>{exp.location}</span>
                  <span className="font-bold text-[#1b1c1c] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#b8860b] fill-current" />
                    {exp.rating} ({exp.reviewCount})
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-[#1b1c1c] group-hover:text-[#b8860b] transition-colors leading-snug">
                  {exp.title}
                </h3>

                <p className="text-xs text-[#6a6666] line-clamp-3 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#f2eded] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8c8888] block">{exp.duration} • Max {exp.maxGroupSize} Guests</span>
                  <span className="font-serif font-bold text-lg text-[#1b1c1c]">
                    {formatPrice(exp.price)}
                  </span>
                </div>
                <span className="px-4 py-2 bg-[#1b1c1c] text-[#ffdea5] rounded-xl text-xs font-semibold hover:bg-[#2e2d2d] transition-colors">
                  Reserve Charter
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
