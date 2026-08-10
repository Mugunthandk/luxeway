import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Destination, Property } from '../types';
import { apiService } from '../services/api';
import { SEED_DESTINATIONS, SEED_PROPERTIES } from '../data/seedData';
import { PropertyCard } from '../components/PropertyCard';
import { Sun, Calendar, DollarSign, Info, MapPin, ArrowLeft, ShieldCheck } from 'lucide-react';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Instant synchronous seed initialization
  const initialDest = slug ? (SEED_DESTINATIONS.find(d => d.slug === slug || d.id === slug) || null) : null;
  const initialProps = initialDest
    ? SEED_PROPERTIES.filter(p => p.destination.toLowerCase().includes(initialDest.name.toLowerCase()) || p.location.toLowerCase().includes(initialDest.name.toLowerCase()))
    : [];

  const [destination, setDestination] = useState<Destination | null>(initialDest);
  const [properties, setProperties] = useState<Property[]>(initialProps);
  const [loading, setLoading] = useState<boolean>(!initialDest);

  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      if (!initialDest) setLoading(true);
      apiService.getDestinationBySlug(slug).then((dest) => {
        if (dest) {
          setDestination(dest);
          apiService.getProperties({ destination: dest.name }).then((props) => {
            setProperties(props);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    }
  }, [slug]);

  if (loading || !destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1b1c1c] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-serif font-bold text-[#1b1c1c]">Loading Destination Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      
      {/* Destination Hero Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[60vh] flex items-end p-6 sm:p-12 overflow-hidden rounded-b-3xl"
      >
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        <div className="relative z-10 max-w-5xl mx-auto w-full text-white space-y-3">
          <button
            onClick={() => navigate('/destinations')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold hover:bg-white/30 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Destinations</span>
          </button>

          <span className="text-xs uppercase tracking-widest font-bold text-[#ffdea5] block">
            {destination.country} • {destination.region}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold">{destination.name}</h1>
          <p className="max-w-2xl text-xs sm:text-sm text-[#e0e4f2] leading-relaxed">
            {destination.description}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-[#ffdea5]">
            <span className="px-3.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
              <Sun className="w-4 h-4" /> {destination.weather.tempC}°C • {destination.weather.condition}
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Best Season: {destination.bestTime}
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> Currency: {destination.currency}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Local Logistics & Transfers Dossier Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="bg-gradient-to-r from-[#12182b] to-[#1c2445] text-white p-6 sm:p-8 rounded-3xl border border-[#ffdea5]/30 shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2d3866] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffdea5] block">
                DESTINATION GEOGRAPHIC DOSSIER
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#ffdea5]" />
                <span>{destination.name} Regional Location & Logistics</span>
              </h3>
            </div>
            <button
              onClick={() => navigate(`/trip-planner?destination=${destination.name}`)}
              className="px-5 py-2.5 bg-[#ffdea5] text-[#141a32] font-bold text-xs rounded-xl hover:bg-[#ffe7be] transition-colors shrink-0 cursor-pointer shadow"
            >
              Plan Custom {destination.name} Itinerary
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1">
              <span className="font-bold text-[#ffdea5] block">Arrival Air Hub & Seaplane</span>
              <p className="text-white leading-relaxed">{destination.localInfo}</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1">
              <span className="font-bold text-[#ffdea5] block">Optimal Travel Climate</span>
              <p className="text-white leading-relaxed">
                Best season: {destination.bestTime}. Current conditions average {destination.weather.tempC}°C ({destination.weather.condition}).
              </p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1">
              <span className="font-bold text-[#ffdea5] block">Privé Concierge Service</span>
              <p className="text-white leading-relaxed">
                Chauffeured Maybach transfers, private yacht charter bookings, and VIP customs clearance included.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Available Residences */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between border-b border-[#e6e2e2] pb-4"
        >
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1b1c1c]">
            Residences in {destination.name}
          </h2>
          <span className="text-xs font-semibold text-[#8a7a58]">
            {properties.length} Available Stays
          </span>
        </motion.div>

        {properties.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-[#e8e4e4]">
            <p className="text-xs text-[#7a7676]">All properties in this destination are currently fully booked.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

