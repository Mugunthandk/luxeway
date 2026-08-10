import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Property, Review } from '../types';
import { apiService } from '../services/api';
import { SEED_PROPERTIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { DateRangePicker } from '../components/DateRangePicker';
import {
  Star, Heart, MapPin, ShieldCheck, Users, Bed, Bath, Sparkles, Check,
  Calendar, Award, MessageSquare, ChevronRight, Share2, DollarSign, Tag, Info, ArrowLeft,
  Navigation, Plane, Anchor, Compass, Maximize2, X, Eye
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Instant synchronous seed initialization
  const initialProp = id ? (SEED_PROPERTIES.find(p => p.id === id || p.slug === id) || null) : null;
  const [property, setProperty] = useState<Property | null>(initialProp);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(!initialProp);

  // Gallery State
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Booking Box State
  const [checkIn, setCheckIn] = useState('2026-10-12');
  const [checkOut, setCheckOut] = useState('2026-10-18');
  const [guests, setGuests] = useState(2);

  // AI Recommendation Match State
  const [aiMatch, setAiMatch] = useState<{ matchScore: number; reasons: string[] } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Write Review State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const { formatPrice, isInWishlist, toggleWishlist, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Check seed property instantly
      const seedProp = SEED_PROPERTIES.find(p => p.id === id || p.slug === id);
      if (seedProp) {
        setProperty(seedProp);
        setLoading(false);
        fetchAiMatch(seedProp.id);
      } else {
        setLoading(true);
      }

      apiService.getPropertyById(id).then((p) => {
        if (p) {
          setProperty(p);
          fetchAiMatch(p.id);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const fetchAiMatch = async (propId: string) => {
    setIsAiLoading(true);
    try {
      const match = await apiService.aiGetPropertyRecommendations(propId, {
        preferences: "Beachfront, private pool, butler, high privacy, luxury dining"
      });
      setAiMatch(match);
    } catch (e) {
      setAiMatch({
        matchScore: 97,
        reasons: ["Matches your preference for secluded coastal access", "Includes 24/7 butler service", "Rated 4.98+ by verified guests"]
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !newComment.trim()) return;

    const revData = {
      propertyId: property.id,
      user: {
        name: user ? user.name : 'Verified Guest',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      rating: newRating,
      cleanliness: 5,
      location: 5,
      service: 5,
      value: 5,
      comment: newComment,
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revData),
      });
      if (res.ok) {
        const saved = await res.json();
        setReviews(prev => [saved, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
    setIsReviewModalOpen(false);
    setNewComment('');
  };

  if (loading || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1b1c1c] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-serif font-bold text-[#1b1c1c]">Loading Privé Property Sanctuary...</p>
      </div>
    );
  }

  // Fallback Location Details if not populated
  const locDetails = property.locationDetails || {
    address: `${property.location}, ${property.destination}`,
    nearestAirport: property.destination === 'Maldives'
      ? 'Velana International Airport (MLE) - 25 min by private seaplane'
      : property.destination === 'St. Barts'
      ? 'Gustaf III Airport (SBH) - 5 min by private SUV transfer'
      : property.destination === 'Amalfi Coast'
      ? 'Naples International Airport (NAP) - 60 min by private helicopter or luxury car'
      : `${property.destination} International Airport - 20 min VIP transfer`,
    transferMethod: property.destination === 'Maldives'
      ? 'Trans Maldivian Seaplane / Private Yacht Charter Mooring'
      : property.destination === 'St. Barts'
      ? 'VIP Chauffeured Maybach or Private Helicopter'
      : 'Private Chauffeur & Helipad Landing',
    neighborhood: `${property.location} Exclusive Enclave`,
    nearbyAttractions: [
      `${property.destination} Private Bay`,
      'Michelin Star Dining',
      'Yacht Marina & Helipad'
    ],
    privacyScore: '9.9/10 Ultra-Private Estate',
    coordinatesDms: `${property.coordinates.lat.toFixed(4)}° N, ${property.coordinates.lng.toFixed(4)}° E`,
  };

  // Calculate Nights & Pricing
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  const subtotal = property.pricePerNight * nights;
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  const isWishlisted = isInWishlist(property.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-[#1c1815]">
      
      {/* Back Button & Header Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#4a4646] hover:text-[#1b1c1c] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => toggleWishlist(property.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
              isWishlisted
                ? 'bg-[#a33838] text-white border-[#a33838]'
                : 'bg-white text-[#1b1c1c] border-[#e2dede] hover:bg-[#fbf9f9]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            <span>{isWishlisted ? 'Saved to Wishlist' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Property Title & Summary Header */}
      <div className="space-y-3 border-b border-[#f0ecec] pb-6">
        <div className="flex flex-wrap gap-2 items-center text-xs">
          {property.badge && (
            <span className="px-3 py-1 rounded-full bg-[#1b1c1c] text-[#ffdea5] font-bold uppercase tracking-wider text-[10px]">
              {property.badge}
            </span>
          )}
          {property.verified && (
            <span className="px-3 py-1 rounded-full bg-[#f2ede4] text-[#8a7a58] font-bold flex items-center gap-1 border border-[#dcd3c1] text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#b8860b]" /> Privé Vetted & Verified
            </span>
          )}
          <span className="text-[#8a7a58] font-semibold uppercase tracking-wider text-[10px]">
            {property.destination} • {property.propertyType}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1b1c1c] leading-tight">
          {property.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#524e4e] pt-1">
          <span className="flex items-center gap-1 font-bold text-[#1b1c1c]">
            <MapPin className="w-4 h-4 text-[#b8860b]" />
            {property.location}
          </span>
          <span className="flex items-center gap-1 font-bold text-[#1b1c1c]">
            <Star className="w-4 h-4 text-[#b8860b] fill-current" />
            {property.rating} ({property.reviewCount} Verified Reviews)
          </span>
          <span className="font-medium text-[#6a6666]">
            {property.bedrooms} Bedrooms • {property.bathrooms} Baths • Max {property.maxGuests} Guests
          </span>
        </div>
      </div>

      {/* 📸 SECTION 1: SEPARATED MEDIA & PHOTO GALLERY SHOWCASE */}
      <section className="bg-white p-5 rounded-3xl border border-[#ebdcc8] shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0ecec] pb-3">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-[#b8860b]" />
            <h2 className="font-serif font-bold text-base text-[#1b1c1c]">Visual Showcase & Residence Gallery</h2>
          </div>
          <span className="text-[11px] font-semibold text-[#8a7a58]">
            Photo {selectedImgIndex + 1} of {property.images.length}
          </span>
        </div>

        {/* Featured Large Viewer */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-[#1c1815] group shadow-inner">
          <img
            src={property.images[selectedImgIndex] || property.images[0]}
            alt={`${property.title} preview`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70" />

          {/* Image Tag / Label */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-2">
            <span className="px-3 py-1 bg-[#1c1815]/85 text-[#ffdea5] text-xs font-bold rounded-full backdrop-blur-md border border-[#ffdea5]/30">
              {selectedImgIndex === 0 ? 'Main Oceanfront View' : selectedImgIndex === 1 ? 'Sanctuary Interior' : 'Private Deck & Pool'}
            </span>
          </div>

          {/* Fullscreen Expand Button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 text-[#1b1c1c] hover:bg-white backdrop-blur-md transition-all cursor-pointer shadow-lg z-10"
            title="Open Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnails Reel */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-1">
          {property.images.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImgIndex(idx)}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedImgIndex === idx
                  ? 'border-[#b8860b] ring-2 ring-[#ffdea5] scale-105 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full max-h-[80vh] flex items-center justify-center">
            <img
              src={property.images[selectedImgIndex]}
              alt="Fullscreen"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
          </div>

          <div className="mt-6 flex items-center space-x-3 text-white text-xs">
            {property.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImgIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  selectedImgIndex === idx ? 'bg-[#ffdea5] scale-125' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN LAYOUT (Content Cards on Left, Reserve Box on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* LEFT COLUMN: SEPARATED CONTENT SECTIONS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 📍 SECTION 2: SEPARATED DETAILED LOCATION & ARRIVAL LOGISTICS DOSSIER */}
          <section className="bg-gradient-to-br from-[#12182b] via-[#1a233f] to-[#0f1424] text-white p-6 sm:p-8 rounded-3xl border border-[#ffdea5]/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#2d3866] pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#ffdea5] text-[#141a32]">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    Detailed Location & Arrival Logistics
                  </h3>
                  <span className="text-[10px] text-[#ffdea5] font-bold uppercase tracking-widest block">
                    SANCTUARY GEOGRAPHIC DOSSIER
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 bg-[#ffdea5]/15 text-[#ffdea5] text-[10px] font-bold rounded-full border border-[#ffdea5]/30">
                Privacy Index: {locDetails.privacyScore}
              </span>
            </div>

            {/* Grid of Location Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Address & Neighborhood */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#ffdea5] text-xs font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Exact Residence Address</span>
                </div>
                <p className="text-xs text-white font-semibold leading-relaxed">
                  {locDetails.address}
                </p>
                <span className="text-[10px] text-[#cbd1e6] block">
                  Neighborhood: {locDetails.neighborhood}
                </span>
              </div>

              {/* Airport & Transit */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#ffdea5] text-xs font-bold">
                  <Plane className="w-4 h-4" />
                  <span>Nearest Airport & Flight Time</span>
                </div>
                <p className="text-xs text-white font-semibold leading-relaxed">
                  {locDetails.nearestAirport}
                </p>
                <span className="text-[10px] text-[#cbd1e6] block">
                  Direct transfer managed by Privé Concierge
                </span>
              </div>

              {/* Transfer Method */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#ffdea5] text-xs font-bold">
                  <Anchor className="w-4 h-4" />
                  <span>Arrival & Mooring Method</span>
                </div>
                <p className="text-xs text-white font-semibold leading-relaxed">
                  {locDetails.transferMethod}
                </p>
                <span className="text-[10px] text-[#cbd1e6] block">
                  Private Helipad & Deep-water Yacht Docking available
                </span>
              </div>

              {/* GPS Coordinates */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#ffdea5] text-xs font-bold">
                  <Navigation className="w-4 h-4" />
                  <span>Spatial GPS Coordinates</span>
                </div>
                <p className="font-mono text-xs text-[#ffdea5] font-bold">
                  {locDetails.coordinatesDms}
                </p>
                <span className="text-[10px] text-[#cbd1e6] block">
                  Lat {property.coordinates.lat}, Lng {property.coordinates.lng}
                </span>
              </div>

            </div>

            {/* Nearby Highlights */}
            {locDetails.nearbyAttractions && locDetails.nearbyAttractions.length > 0 && (
              <div className="pt-2 border-t border-[#2d3866] space-y-2">
                <span className="text-[11px] font-bold uppercase text-[#ffdea5] tracking-wider block">
                  Nearby Excursions & Marine Highlights
                </span>
                <div className="flex flex-wrap gap-2">
                  {locDetails.nearbyAttractions.map((attr, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/10 border border-white/15 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#ffdea5]" />
                      <span>{attr}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Map Link Box */}
            <div className="p-4 bg-[#141a32] border border-[#ffdea5]/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-[#ffdea5] shrink-0 animate-bounce" />
                <div className="text-left text-xs">
                  <p className="font-bold text-white">Interactive Map Explorer Active</p>
                  <p className="text-[11px] text-[#cbd1e6]">View surrounding topography, yacht routes, and airstrips on full map.</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/map-explorer`)}
                className="px-4 py-2 bg-[#ffdea5] text-[#141a32] text-xs font-bold rounded-xl hover:bg-[#ffe7be] transition-colors cursor-pointer shrink-0"
              >
                Launch Map Explorer
              </button>
            </div>

          </section>

          {/* 🤖 SECTION 3: AI MATCH ANALYSIS CARD */}
          <section className="bg-[#1b1c1c] text-white p-6 rounded-3xl border border-[#ebdcc8]/30 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#ffdea5]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Luxe AI Match Score Analysis
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#ffdea5] text-[#1b1c1c] font-bold text-xs">
                {aiMatch ? `${aiMatch.matchScore}% Match` : '98% Match'}
              </span>
            </div>
            <p className="text-xs text-[#cbd1e6]">
              Based on your quiet luxury preference profile and past booking inquiries:
            </p>
            <ul className="space-y-1.5 text-xs text-[#e0e4f2]">
              {(aiMatch?.reasons || [
                "Matches your preference for secluded ocean views and infinity pool access",
                "Includes 24/7 dedicated butler & resident chef",
                "Rated 4.98+ by verified luxury travelers"
              ]).map((reason, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#ffdea5] shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 📜 SECTION 4: RESIDENCE OVERVIEW & ARCHITECTURE */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8e4e4] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[#1b1c1c]">About This Residence</h3>
            <p className="text-xs sm:text-sm text-[#4a4646] leading-relaxed whitespace-pre-line">
              {property.description}
            </p>

            <div className="pt-4 border-t border-[#f0ecec] grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-[#fcfaf6] rounded-2xl border border-[#ebdcc8]">
                <span className="text-[10px] font-bold text-[#8a7a58] uppercase block">Bedrooms</span>
                <p className="font-serif font-bold text-xl text-[#1b1c1c]">{property.bedrooms} Suites</p>
              </div>
              <div className="p-3 bg-[#fcfaf6] rounded-2xl border border-[#ebdcc8]">
                <span className="text-[10px] font-bold text-[#8a7a58] uppercase block">Bathrooms</span>
                <p className="font-serif font-bold text-xl text-[#1b1c1c]">{property.bathrooms} Baths</p>
              </div>
              <div className="p-3 bg-[#fcfaf6] rounded-2xl border border-[#ebdcc8]">
                <span className="text-[10px] font-bold text-[#8a7a58] uppercase block">Max Occupancy</span>
                <p className="font-serif font-bold text-xl text-[#1b1c1c]">{property.maxGuests} Guests</p>
              </div>
            </div>
          </section>

          {/* 🛎️ SECTION 5: PRIVÉ SERVICES & AMENITIES */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8e4e4] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[#1b1c1c]">Privé Services & Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-medium text-[#3b3838]">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 p-3.5 bg-[#fcfaf6] rounded-2xl border border-[#ebdcc8]">
                  <Check className="w-4 h-4 text-[#b8860b] shrink-0" />
                  <span className="font-semibold text-[#1c1815]">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 👤 SECTION 6: HOST & ESTATE SECURITY PROFILE */}
          <section className="p-6 bg-white rounded-3xl border border-[#e8e4e4] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={property.host.avatar}
                alt={property.host.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#b8860b] shadow-md"
              />
              <div>
                <h4 className="font-serif font-bold text-lg text-[#1b1c1c] flex items-center gap-2">
                  <span>Hosted by {property.host.name}</span>
                  {property.host.superhost && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#f2ede4] text-[#8a7a58] font-sans font-bold border border-[#dcd3c1]">
                      Privé Superhost
                    </span>
                  )}
                </h4>
                <p className="text-xs text-[#7a7676]">{property.host.responseRate}</p>
              </div>
            </div>
            <button className="px-5 py-2.5 border-2 border-[#1b1c1c] rounded-2xl text-xs font-bold text-[#1b1c1c] hover:bg-[#1b1c1c] hover:text-white transition-all cursor-pointer">
              Contact Concierge & Host
            </button>
          </section>

          {/* 🌟 SECTION 7: VERIFIED GUEST REVIEWS */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8e4e4] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-2xl text-[#1b1c1c] flex items-center gap-2">
                <Star className="w-5 h-5 text-[#b8860b] fill-current" />
                <span>{property.rating} • Guest Reviews ({property.reviewCount})</span>
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 bg-[#1b1c1c] text-[#ffdea5] rounded-xl text-xs font-bold hover:bg-[#2e2d2d] cursor-pointer shadow"
              >
                Write Privé Review
              </button>
            </div>

            {/* Write Review Form */}
            {isReviewModalOpen && (
              <form onSubmit={handlePostReview} className="bg-[#f5f2ed] p-5 rounded-2xl border border-[#e2dccf] space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#1b1c1c]">Share Your Experience</h4>
                <div>
                  <label className="text-xs font-semibold text-[#4a4646] block mb-1">Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="px-3 py-1.5 bg-white border border-[#e2dede] rounded-lg text-xs"
                  >
                    <option value={5}>5 Stars - Exceptional</option>
                    <option value={4}>4 Stars - High Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#4a4646] block mb-1">Review Comment</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe the hospitality, butler service, view..."
                    rows={3}
                    className="w-full p-3 bg-white border border-[#e2dede] rounded-xl text-xs"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-[#6a6666] hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#1b1c1c] text-[#ffdea5] text-xs font-bold rounded-lg"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}

            {/* Existing Reviews */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-[#fcfaf6] rounded-2xl border border-[#ebdcc8] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1b1c1c]">{rev.user.name}</span>
                    <span className="text-[#8c8888]">{rev.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#b8860b] fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#524e4e] leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

          </section>

        </div>

        {/* Right Column (Reserve Pricing Card) */}
        <aside className="sticky top-24 bg-white p-6 rounded-3xl border border-[#e2dede] shadow-xl space-y-6">
          
          <div className="flex items-baseline justify-between border-b border-[#f0ecec] pb-4">
            <div>
              <span className="font-serif font-bold text-3xl text-[#1b1c1c]">
                {formatPrice(property.pricePerNight)}
              </span>
              <span className="text-xs text-[#7a7676]"> / night</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#1b1c1c]">
              <Star className="w-4 h-4 text-[#b8860b] fill-current" />
              <span>{property.rating}</span>
            </div>
          </div>

          {/* Date & Guests Selection */}
          <div className="space-y-3">
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={(newCheckIn, newCheckOut) => {
                setCheckIn(newCheckIn);
                setCheckOut(newCheckOut);
              }}
            />

            <div className="p-3 bg-[#fbf9f9] border border-[#e2dede] rounded-2xl">
              <label className="text-[10px] font-bold text-[#6a6666] uppercase block">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-transparent text-xs font-semibold text-[#1b1c1c] focus:outline-none cursor-pointer"
              >
                <option value={1}>1 Guest (Privé Solo)</option>
                <option value={2}>2 Guests (Couple Sanctuary)</option>
                <option value={4}>4 Guests (Family Suite)</option>
                <option value={6}>6 Guests (Villa Party)</option>
                <option value={8}>8+ Guests (Estate Exclusive)</option>
              </select>
            </div>
          </div>

          {/* Price Breakdown Calculation */}
          <div className="space-y-2 text-xs text-[#524e4e] pt-2 border-t border-[#f0ecec]">
            <div className="flex justify-between">
              <span>{formatPrice(property.pricePerNight)} x {nights} nights</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Privé Concierge & Tax (12%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#1b1c1c] text-sm pt-2 border-t border-[#f0ecec]">
              <span>Total Estimated</span>
              <span className="font-serif text-lg">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Reserve CTA Button */}
          <button
            onClick={() => navigate(`/booking/${property.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
            className="w-full py-4 bg-[#1b1c1c] text-[#ffdea5] font-bold text-sm rounded-2xl hover:bg-[#2e2d2d] transition-all cursor-pointer shadow-lg text-center"
          >
            Reserve Sanctuary
          </button>

          <p className="text-[10px] text-center text-[#7a7676]">
            You won't be charged yet. Instant confirmation & invoice available.
          </p>

        </aside>

      </div>

    </div>
  );
};
