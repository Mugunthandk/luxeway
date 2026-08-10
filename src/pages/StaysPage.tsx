import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types';
import { apiService } from '../services/api';
import { SEED_PROPERTIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { Search, Filter, SlidersHorizontal, MapPin, Grid, Map as MapIcon, RotateCcw, ShieldCheck, X, Camera, ExternalLink } from 'lucide-react';

export const StaysPage: React.FC = () => {
  const { formatPrice } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>(SEED_PROPERTIES);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid');

  // Lightbox State
  const [lightboxData, setLightboxData] = useState<{
    url: string;
    title: string;
    location: string;
    category: string;
    propertySlug?: string;
  } | null>(null);

  // Filter States
  const [destinationFilter, setDestinationFilter] = useState(searchParams.get('destination') || 'All');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(searchParams.get('propertyType') || 'All');
  const [minPrice, setMinPrice] = useState(Number(searchParams.get('minPrice')) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 20000);
  const [bedroomsFilter, setBedroomsFilter] = useState(Number(searchParams.get('bedrooms')) || 0);
  const [guestsFilter, setGuestsFilter] = useState(Number(searchParams.get('guests')) || 0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'rating'>('recommended');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || searchParams.get('aiQuery') || '');

  useEffect(() => {
    fetchFilteredProperties();
  }, [destinationFilter, propertyTypeFilter, minPrice, maxPrice, bedroomsFilter, guestsFilter, selectedAmenities, sortBy, searchQuery]);

  const fetchFilteredProperties = async () => {
    setLoading(true);
    const filters: Record<string, any> = {};
    if (destinationFilter !== 'All') filters.destination = destinationFilter;
    if (propertyTypeFilter !== 'All') filters.propertyType = propertyTypeFilter;
    if (minPrice > 0) filters.minPrice = minPrice;
    if (maxPrice < 20000) filters.maxPrice = maxPrice;
    if (bedroomsFilter > 0) filters.bedrooms = bedroomsFilter;
    if (guestsFilter > 0) filters.guests = guestsFilter;
    if (searchQuery) filters.search = searchQuery;

    try {
      let data = await apiService.getProperties(filters);

      if (selectedAmenities.length > 0) {
        data = data.filter(p => selectedAmenities.every(a => p.amenities.includes(a)));
      }

      if (sortBy === 'priceAsc') data.sort((a, b) => a.pricePerNight - b.pricePerNight);
      if (sortBy === 'priceDesc') data.sort((a, b) => b.pricePerNight - a.pricePerNight);
      if (sortBy === 'rating') data.sort((a, b) => b.rating - a.rating);

      setProperties(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setDestinationFilter('All');
    setPropertyTypeFilter('All');
    setMinPrice(0);
    setMaxPrice(20000);
    setBedroomsFilter(0);
    setGuestsFilter(0);
    setSelectedAmenities([]);
    setSortBy('recommended');
    setSearchQuery('');
    setSearchParams({});
  };

  const allAmenities = ['Private Pool', 'Beach Access', 'Private Chef', 'Butler', 'Spa', 'Gym', 'Helipad', 'Ski-in/Ski-out', 'Breakfast'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Title & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e6e2e2] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#8a7a58] font-bold uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Privé Vetted Portfolio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1b1c1c]">
            Stays & Private Villas
          </h1>
          <p className="text-xs sm:text-sm text-[#6a6666] mt-1">
            Showing {properties.length} curated luxury residences worldwide
          </p>
        </div>

        {/* View Mode & Sort */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-[#f5f2ed] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#1b1c1c] shadow-sm' : 'text-[#6a6666]'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors ${
                viewMode === 'split' ? 'bg-white text-[#1b1c1c] shadow-sm' : 'text-[#6a6666]'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Split Map</span>
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white border border-[#e2dede] rounded-xl text-xs font-medium text-[#1b1c1c] focus:outline-none"
          >
            <option value="recommended">Curator's Recommendation</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Highest Rated (5.0)</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout (Filter Curations Sidebar + Listings) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTER CURATIONS SIDEBAR */}
        <aside className="lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-[#e8e4e4] h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ecec]">
            <h3 className="font-serif font-bold text-sm text-[#1b1c1c] flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#8a7a58]" />
              <span>Filter Curations</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#8a7a58] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Query */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a4646]">Search Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#8a857b] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Title, beach, butler..."
                className="w-full pl-9 pr-3 py-2 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs text-[#1b1c1c] focus:outline-none focus:border-[#1b1c1c]"
              />
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a4646]">Destination</label>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs text-[#1b1c1c] focus:outline-none"
            >
              <option value="All">All Destinations</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Maldives">Maldives</option>
              <option value="St. Barts">St. Barts</option>
              <option value="Amalfi Coast">Amalfi Coast</option>
              <option value="Zermatt">Zermatt</option>
              <option value="Bali">Bali</option>
              <option value="Santorini">Santorini</option>
              <option value="Paris">Paris</option>
              <option value="Dubai">Dubai</option>
              <option value="Lake Como">Lake Como</option>
              <option value="Bora Bora">Bora Bora</option>
              <option value="Kyoto">Kyoto</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a4646]">Property Type</label>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Villa', 'Private Estate', 'Resort', 'Chalet', 'Penthouse'].map((type) => (
                <button
                  key={type}
                  onClick={() => setPropertyTypeFilter(type)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                    propertyTypeFilter === type
                      ? 'bg-[#1b1c1c] text-[#ffdea5] border-[#1b1c1c]'
                      : 'bg-[#f8f6f4] text-[#4a4646] border-[#e2dede] hover:bg-[#e2dede]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-[#f0ecec]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#4a4646]">Max Price / Night</span>
              <span className="font-bold text-[#b8860b]">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={20000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1b1c1c] cursor-pointer"
            />
          </div>

          {/* Amenities Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-[#f0ecec]">
            <label className="text-xs font-bold text-[#4a4646] block">Privé Services & Amenities</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {allAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 text-xs text-[#524e4e] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded text-[#1b1c1c] focus:ring-0 cursor-pointer"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* LISTINGS CONTAINER */}
        <main className={`${viewMode === 'split' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-[#e8e4e4]" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center space-y-4 border border-[#e8e4e4]">
              <p className="font-serif font-semibold text-lg text-[#1b1c1c]">No properties match these criteria.</p>
              <p className="text-xs text-[#7a7676]">Try resetting filters or modifying keywords.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#1b1c1c] text-[#ffdea5] text-xs font-semibold rounded-xl hover:bg-[#2e2d2d] cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onInspectPhoto={(data) => setLightboxData(data)}
                />
              ))}
            </div>
          )}
        </main>

        {/* SPLIT MAP PANEL */}
        {viewMode === 'split' && (
          <aside className="hidden lg:block lg:col-span-1 bg-[#141a32] rounded-2xl p-4 text-white border border-[#2d3866] h-[750px] sticky top-24 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d3866]">
              <span className="font-serif text-sm font-bold text-[#ffdea5]">Interactive Map View</span>
              <span className="text-[10px] text-[#8e96b5]">{properties.length} Markers</span>
            </div>
            <div className="relative w-full h-[670px] mt-3 rounded-xl overflow-hidden bg-[#1c2445] flex items-center justify-center p-4 text-center">
              <div className="space-y-3">
                <MapPin className="w-8 h-8 text-[#ffdea5] mx-auto animate-bounce" />
                <p className="font-serif text-sm text-white font-semibold">Global Map Overlay</p>
                <p className="text-xs text-[#b3b9d1] max-w-xs">
                  Coordinates plotted for {properties[0]?.location || 'St. Barts & Amalfi'}.
                </p>
                <button
                  onClick={() => navigate('/map-explorer')}
                  className="px-4 py-2 bg-[#ffdea5] text-[#141a32] font-bold text-xs rounded-xl hover:bg-[#ffe7be] transition-colors cursor-pointer"
                >
                  Open Fullscreen Map Explorer
                </button>
              </div>
            </div>
          </aside>
        )}

      </div>

      {/* High-Res Photo Lightbox Modal */}
      {lightboxData && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all animate-fadeIn"
          onClick={() => setLightboxData(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#1c1815] rounded-3xl overflow-hidden border border-[#ebdcc8]/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxData(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-[#1c1815] transition-all cursor-pointer shadow border border-white/20"
              title="Close High-Res Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video w-full bg-black">
              <img
                src={lightboxData.url}
                alt={lightboxData.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-[#1c1815] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#ebdcc8]/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffdea5] bg-[#ffdea5]/10 px-2.5 py-0.5 rounded-full border border-[#ffdea5]/30">
                    {lightboxData.category}
                  </span>
                  <span className="text-xs text-[#d6c7b2] flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#ffdea5]" />
                    {lightboxData.location}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {lightboxData.title}
                </h3>
              </div>

              {lightboxData.propertySlug && (
                <button
                  onClick={() => {
                    const slug = lightboxData.propertySlug;
                    setLightboxData(null);
                    navigate(`/${slug}`);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#ffdea5] text-[#1c1815] font-bold text-xs hover:bg-white transition-all flex items-center justify-center gap-2 shadow cursor-pointer shrink-0"
                >
                  <span>Explore Residence Details</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
