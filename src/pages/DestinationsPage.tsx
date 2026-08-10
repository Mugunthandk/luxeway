import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Destination } from '../types';
import { apiService } from '../services/api';
import { MapPin, Sun, Compass, ArrowRight } from 'lucide-react';

export const DestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [regionFilter, setRegionFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getDestinations().then(setDestinations);
  }, []);

  const filtered = regionFilter === 'All'
    ? destinations
    : destinations.filter(d => d.region === regionFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-[#b8860b]">
          Global Sanctuaries
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1b1c1c]">
          Privé Destinations
        </h1>
        <p className="text-xs sm:text-sm text-[#6a6666]">
          Hand-vetted luxury micro-destinations across coastal, alpine, tropical, and island regions.
        </p>
      </motion.div>

      {/* Region Filter Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center flex-wrap gap-2"
      >
        {['All', 'Coastal', 'Island', 'Alpine', 'Tropical', 'Metropolitan'].map((region) => (
          <button
            key={region}
            onClick={() => setRegionFilter(region)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              regionFilter === region
                ? 'bg-[#1b1c1c] text-[#ffdea5] border-[#1b1c1c]'
                : 'bg-white text-[#4a4646] border-[#e2dede] hover:bg-[#f5f2ed]'
            }`}
          >
            {region}
          </button>
        ))}
      </motion.div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((dest, index) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: (index % 3) * 0.08,
            }}
            onClick={() => navigate(`/destinations/${dest.slug}`)}
            className="group bg-white rounded-3xl border border-[#e8e4e4] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-full"
          >
            <div className="relative h-64 overflow-hidden bg-[#1c1815]">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Top Privacy Tag */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[#ffdea5] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#ffdea5]/30 shadow">
                  {dest.privacyScore || '10/10 Seclusion Index'}
                </span>
              </div>

              {/* Top Weather Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[#1c1815] text-[11px] font-bold border border-[#ebdcc8] shadow flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#8a6314]" />
                <span>{dest.weather.tempC}°C • {dest.weather.condition}</span>
              </div>

              {/* Transfer Tag */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] text-white/90">
                <span className="bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10 font-mono">
                  {dest.transferTag || 'VIP Helicopter & Yacht'}
                </span>
                <span className="text-[#ffdea5] font-semibold">
                  Best: {dest.bestTime}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a6314]">
                    {dest.country} • {dest.region}
                  </span>
                  <span className="text-[10px] font-medium text-[#7a7676] bg-[#f7f4ef] px-2 py-0.5 rounded-full border border-[#ebe6df]">
                    {dest.currency}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-2xl text-[#1c1815] group-hover:text-[#8a6314] transition-colors leading-tight">
                  {dest.name}
                </h3>

                <p className="text-xs text-[#524e4e] line-clamp-2 leading-relaxed font-light">
                  {dest.description}
                </p>

                {dest.highlights && dest.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dest.highlights.map((hl, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#f5f0eb] text-[#5e4b2d] px-2.5 py-1 rounded-full font-medium border border-[#ebdcc8]"
                      >
                        ✨ {hl}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#f0eae1] flex items-center justify-between text-xs font-semibold text-[#1c1815]">
                <span className="text-[#4a4646]">{dest.propertiesCount} Privé Residences</span>
                <span className="flex items-center gap-1.5 text-[#8a6314] font-bold group-hover:translate-x-1 transition-transform">
                  Explore Stays <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

