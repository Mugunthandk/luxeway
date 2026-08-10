import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Property } from '../types';
import { apiService } from '../services/api';
import { useApp } from '../context/AppContext';
import { MapPin, Star, Heart, Bed, Users, Filter, SlidersHorizontal, Layers, Plus, Minus, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MapExplorerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeDestination, setActiveDestination] = useState<string>(
    searchParams.get('destination') || 'All'
  );
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'light'>('dark');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  const { formatPrice, isInWishlist, toggleWishlist } = useApp();

  useEffect(() => {
    apiService.getProperties().then((props) => {
      setProperties(props);
      if (props.length > 0) {
        // If query destination exists, pick first matching
        const initialDest = searchParams.get('destination');
        if (initialDest && initialDest !== 'All') {
          const match = props.find(p => p.destination.toLowerCase() === initialDest.toLowerCase());
          setSelectedProperty(match || props[0]);
        } else {
          setSelectedProperty(props[0]);
        }
      }
    });
  }, [searchParams]);

  const handleDestinationChange = (dest: string) => {
    setActiveDestination(dest);
    if (dest === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ destination: dest });
    }
    const matching = properties.filter(p => dest === 'All' || p.destination === dest);
    if (matching.length > 0) {
      setSelectedProperty(matching[0]);
    }
  };

  const filtered = activeDestination === 'All'
    ? properties
    : properties.filter(p => p.destination.toLowerCase() === activeDestination.toLowerCase());

  // Map pin coordinate positioning math helper
  const getCanvasCoords = (index: number, total: number) => {
    // Generate organic scattered positions across map canvas for visualization
    const angles = [
      { x: 30, y: 25 },
      { x: 65, y: 35 },
      { x: 45, y: 60 },
      { x: 20, y: 70 },
      { x: 75, y: 75 },
      { x: 80, y: 20 },
      { x: 35, y: 45 },
      { x: 55, y: 80 },
      { x: 15, y: 40 },
      { x: 70, y: 50 },
    ];
    return angles[index % angles.length];
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden bg-[#fbf9f9]">
      
      {/* Left Sidebar List */}
      <div className="w-full md:w-[460px] lg:w-[500px] h-1/2 md:h-full border-r border-[#e6e2e2] flex flex-col bg-white z-10 shadow-lg">
        
        {/* Header Filters */}
        <div className="p-4 border-b border-[#f0ecec] space-y-3 bg-[#faf7f2]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-[#8a6314]" />
              <h2 className="font-serif font-bold text-xl text-[#1b1c1c]">Privé Map Explorer</h2>
            </div>
            <span className="text-xs font-bold text-[#8a6314] bg-[#f2e8d8] px-2.5 py-1 rounded-full border border-[#e8d7be]">
              {filtered.length} Residences
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
            {['All', 'Seychelles', 'Maldives', 'St. Barts', 'Amalfi Coast', 'Zermatt', 'Bali', 'Lake Como', 'Bora Bora', 'Aspen', 'Kyoto', 'Dubai'].map((dest) => (
              <button
                key={dest}
                onClick={() => handleDestinationChange(dest)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all ${
                  activeDestination === dest
                    ? 'bg-[#1b1c1c] text-[#ffdea5] border-[#1b1c1c] shadow-sm'
                    : 'bg-white text-[#4a4646] border-[#e2dede] hover:border-[#8a6314]'
                }`}
              >
                {dest === 'All' ? 'All Destinations' : dest}
              </button>
            ))}
          </div>
        </div>

        {/* Property Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#8c8888] space-y-2">
              <p className="font-serif font-bold text-base text-[#1c1815]">No residences found</p>
              <p className="text-xs">Try selecting 'All Destinations' to view our global portfolio.</p>
              <button
                onClick={() => handleDestinationChange('All')}
                className="px-4 py-2 bg-[#1c1815] text-[#ffdea5] rounded-xl text-xs font-bold mt-2 hover:bg-[#2e2924]"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filtered.map((prop) => {
              const isSelected = selectedProperty?.id === prop.id;
              const isWishlisted = isInWishlist(prop.id);
              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 relative group ${
                    isSelected
                      ? 'border-[#8a6314] bg-[#fcf8f2] shadow-md ring-1 ring-[#8a6314]/30'
                      : 'border-[#e8e4e4] bg-white hover:border-[#8a6314]/50 hover:shadow-xs'
                  }`}
                >
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {prop.verified && (
                      <span className="absolute top-1.5 left-1.5 bg-[#1c1815]/80 backdrop-blur-md text-[#ffdea5] p-1 rounded-md text-[9px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-[#ffdea5]" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between text-xs py-0.5">
                    <div>
                      <div className="flex items-center justify-between text-[#7a7676] mb-0.5">
                        <span className="font-semibold text-[11px] text-[#8a6314] truncate max-w-[150px]">
                          {prop.destination} • {prop.location}
                        </span>
                        <span className="font-bold text-[#1b1c1c] flex items-center gap-0.5 text-xs">
                          <Star className="w-3 h-3 text-[#b8860b] fill-current" />
                          {prop.rating}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#1b1c1c] line-clamp-1">
                        {prop.title}
                      </h4>
                      <p className="text-[11px] text-[#6e6860] line-clamp-1 mt-0.5">
                        {prop.bedrooms} Beds • {prop.maxGuests} Guests • {prop.propertyType}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#f0ecec] pt-2 mt-1">
                      <div>
                        <span className="font-serif font-bold text-sm text-[#1b1c1c]">
                          {formatPrice(prop.pricePerNight)}
                        </span>
                        <span className="text-[10px] font-normal text-[#8c8888]"> / night</span>
                      </div>
                      <Link
                        to={`/stays/${prop.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#8a6314] font-bold text-xs hover:underline flex items-center gap-0.5"
                      >
                        Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Right Interactive Map Canvas */}
      <div className={`flex-1 h-1/2 md:h-full relative overflow-hidden transition-colors duration-500 ${
        mapStyle === 'dark' ? 'bg-[#0f1422]' : mapStyle === 'satellite' ? 'bg-[#0a1120]' : 'bg-[#e5e1da]'
      }`}>
        
        {/* Real Map / Aerial Satellite Photo Background Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Base Map Image based on Map Style */}
          <img
            src={
              mapStyle === 'satellite'
                ? 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2000&q=80'
                : mapStyle === 'dark'
                ? 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=2000&q=80'
                : 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=2000&q=80'
            }
            alt="Map Canvas Background"
            className={`w-full h-full object-cover transition-all duration-700 ${
              mapStyle === 'dark'
                ? 'opacity-40 mix-blend-luminosity brightness-75 contrast-125'
                : mapStyle === 'satellite'
                ? 'opacity-65 brightness-90 saturate-125'
                : 'opacity-50 mix-blend-multiply brightness-105'
            }`}
          />

          {/* Active Selected Property / Destination Aerial Vignette Overlay */}
          {selectedProperty && (
            <img
              key={selectedProperty.id}
              src={selectedProperty.images[0]}
              alt="Destination Map Overlay"
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md transition-opacity duration-1000 mix-blend-overlay"
            />
          )}

          {/* Stylized Compass Grid and Coordinate Overlays */}
          <div 
            className={`absolute inset-0 transition-opacity duration-500 ${
              mapStyle === 'dark' 
                ? 'opacity-30 bg-[radial-gradient(#ffdea5_1px,transparent_1px)]' 
                : mapStyle === 'satellite'
                ? 'opacity-20 bg-[radial-gradient(#40e0d0_1px,transparent_1px)]'
                : 'opacity-40 bg-[radial-gradient(#1c1815_1px,transparent_1px)]'
            } [background-size:32px_32px]`} 
          />

          {/* Vignette Shadow Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        {/* Top Controls Bar */}
        <div className="absolute top-4 right-4 z-30 flex items-center space-x-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-[#e8e4e4]">
          <button
            onClick={() => setMapStyle('dark')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mapStyle === 'dark' ? 'bg-[#1c1815] text-[#ffdea5]' : 'text-[#4a4646] hover:bg-[#f2ece4]'
            }`}
          >
            Night Vector
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mapStyle === 'satellite' ? 'bg-[#1c1815] text-[#ffdea5]' : 'text-[#4a4646] hover:bg-[#f2ece4]'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapStyle('light')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mapStyle === 'light' ? 'bg-[#1c1815] text-[#ffdea5]' : 'text-[#4a4646] hover:bg-[#f2ece4]'
            }`}
          >
            Light Topo
          </button>
        </div>

        {/* Map Zoom Controls */}
        <div className="absolute bottom-6 right-6 z-30 flex flex-col space-y-1 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-[#e8e4e4]">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
            className="p-2 hover:bg-[#f2ece4] rounded-lg text-[#1c1815] font-bold cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="w-full h-px bg-[#e8e4e4]" />
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            className="p-2 hover:bg-[#f2ece4] rounded-lg text-[#1c1815] font-bold cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Map Pins Area */}
        <div 
          className="absolute inset-0 p-8 transition-transform duration-500 ease-out flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {filtered.map((prop, idx) => {
            const isSelected = selectedProperty?.id === prop.id;
            const pos = getCanvasCoords(idx, filtered.length);

            return (
              <div
                key={prop.id}
                style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  onClick={() => setSelectedProperty(prop)}
                  className={`group relative flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#b8860b] text-white scale-125 z-30 ring-4 ring-[#ffdea5]/50 shadow-2xl'
                      : 'bg-[#1c1815] text-[#ffdea5] hover:bg-[#8a6314] hover:text-white hover:scale-110 border border-[#ffdea5]/30'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'animate-bounce text-white' : 'text-[#ffdea5]'}`} />
                  <span>{formatPrice(prop.pricePerNight)}</span>
                </button>
              </div>
            );
          })}

          {/* Active Property Card Popup Overlay */}
          <AnimatePresence mode="wait">
            {selectedProperty && (
              <motion.div
                key={selectedProperty.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-6 left-6 right-6 md:left-auto md:right-auto md:w-96 z-30"
              >
                <div className="bg-[#1c2445]/95 backdrop-blur-2xl p-5 rounded-3xl border border-[#ffdea5]/40 text-white shadow-2xl space-y-3.5">
                  <div className="relative h-44 rounded-2xl overflow-hidden">
                    <img
                      src={selectedProperty.images[0]}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12172a] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 bg-[#12172a]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#ffdea5] border border-[#ffdea5]/30">
                      {selectedProperty.destination}
                    </span>
                    <button
                      onClick={() => toggleWishlist(selectedProperty.id)}
                      className="absolute top-3 right-3 p-2 bg-[#12172a]/70 backdrop-blur-md rounded-full text-white hover:text-[#ffdea5] transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(selectedProperty.id) ? 'fill-[#ffdea5] text-[#ffdea5]' : ''}`} />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="font-serif font-bold text-lg text-[#ffdea5]">
                        {formatPrice(selectedProperty.pricePerNight)} <span className="text-xs text-white/80 font-normal">/ night</span>
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1 bg-[#12172a]/80 px-2 py-0.5 rounded-md text-[#ffdea5]">
                        <Star className="w-3 h-3 fill-current text-[#ffdea5]" /> {selectedProperty.rating}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-white line-clamp-1">{selectedProperty.title}</h3>
                    <p className="text-xs text-[#b0badb] line-clamp-1">{selectedProperty.location} • {selectedProperty.bedrooms} Bedrooms • {selectedProperty.maxGuests} Guests</p>
                  </div>

                  <Link
                    to={`/stays/${selectedProperty.id}`}
                    className="flex items-center justify-center space-x-2 w-full py-3 bg-[#ffdea5] text-[#12172a] font-bold text-xs rounded-xl hover:bg-[#ffe6b8] transition-all shadow-md cursor-pointer"
                  >
                    <span>Reserve Residence Sanctuary</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
};

