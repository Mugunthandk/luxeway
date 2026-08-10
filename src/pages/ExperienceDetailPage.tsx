import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Experience } from '../types';
import { apiService } from '../services/api';
import { SEED_EXPERIENCES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { Star, Clock, Users, Check, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export const ExperienceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Instant synchronous seed initialization
  const initialExp = id ? (SEED_EXPERIENCES.find(e => e.id === id || e.slug === id) || null) : null;
  const [experience, setExperience] = useState<Experience | null>(initialExp);
  const [loading, setLoading] = useState<boolean>(!initialExp);
  
  const { formatPrice } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      if (!initialExp) setLoading(true);
      apiService.getExperienceById(id).then((exp) => {
        if (exp) setExperience(exp);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !experience) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1b1c1c] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-serif font-bold text-[#1b1c1c]">Loading Charter Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#4a4646] hover:text-[#1b1c1c] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Charters</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Column Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#e2dede] h-[480px]">
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#ffdea5] text-xs font-bold uppercase">
            {experience.category}
          </span>
        </div>

        {/* Right Column Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#b8860b]">
              {experience.location}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1b1c1c]">
              {experience.title}
            </h1>
            <div className="flex items-center space-x-4 text-xs font-bold text-[#1b1c1c]">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#b8860b] fill-current" />
                {experience.rating} ({experience.reviewCount} Reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#6a6666]">
                <Clock className="w-4 h-4 text-[#8a857b]" />
                {experience.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#6a6666]">
                <Users className="w-4 h-4 text-[#8a857b]" />
                Max {experience.maxGroupSize} Guests
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#4a4646] leading-relaxed">
            {experience.description}
          </p>

          <div className="p-5 bg-white rounded-2xl border border-[#e8e4e4] space-y-3">
            <h4 className="font-serif font-bold text-base text-[#1b1c1c]">Inclusions & Privé Amenities</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#524e4e]">
              {experience.includes.map((inc, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#b8860b] shrink-0" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#141a32] text-white rounded-3xl space-y-4 border border-[#2d3866]">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#b3b9d1] block">Charter Price</span>
                <span className="font-serif font-bold text-3xl text-[#ffdea5]">
                  {formatPrice(experience.price)}
                </span>
              </div>
              <span className="text-xs text-[#cbd1e6]">All Taxes & Transfers Included</span>
            </div>

            <button
              onClick={() => alert(`Charter reservation request for ${experience.title} transmitted to Privé Aviation desk.`)}
              className="w-full py-3.5 bg-[#ffdea5] text-[#141a32] font-bold text-xs rounded-xl hover:bg-[#ffe7be] transition-colors cursor-pointer text-center shadow"
            >
              Reserve Private Charter
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
