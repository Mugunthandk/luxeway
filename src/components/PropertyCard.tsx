import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Star, MapPin, Users, Bed, ShieldCheck, Check, Plus, Tag, ChevronLeft, ChevronRight, Eye, Camera } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onInspectPhoto?: (data: { url: string; title: string; location: string; category: string; propertySlug?: string }) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onInspectPhoto }) => {
  const { formatPrice, isInWishlist, toggleWishlist, isInCompare, toggleCompare } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const isWishlisted = isInWishlist(property.id);
  const isCompared = isInCompare(property.id);

  const images = property.images && property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#ebdcc8] hover:border-[#b8860b] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full relative text-[#1c1815]">
      
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1c1815]">
        <img
          src={images[activeImageIndex]}
          alt={`${property.title} - Photo ${activeImageIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
          loading="lazy"
        />

        {/* Overlay subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 opacity-80 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10 pointer-events-none">
          {property.badge && (
            <span className="px-2.5 py-1 rounded-full bg-[#1c1815]/90 text-[#ffdea5] text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow border border-[#ffdea5]/30">
              {property.badge}
            </span>
          )}
          {property.verified && (
            <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#1c1815] text-[10px] font-bold flex items-center gap-1 backdrop-blur-md shadow">
              <ShieldCheck className="w-3 h-3 text-[#b8860b]" />
              <span>Privé Verified</span>
            </span>
          )}
          {property.priceDifferencePct && property.priceDifferencePct < 0 && (
            <span className="px-2 py-0.5 rounded bg-[#9f1239] text-white text-[10px] font-bold flex items-center gap-1 shadow">
              <Tag className="w-2.5 h-2.5" />
              <span>{Math.abs(property.priceDifferencePct)}% Below Avg</span>
            </span>
          )}
        </div>

        {/* Top Right Buttons: Wishlist & Quick Inspect Eye */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {onInspectPhoto && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onInspectPhoto({
                  url: images[activeImageIndex],
                  title: property.title,
                  location: property.location,
                  category: `${property.propertyType} • ${property.bedrooms} Bedrooms • ${formatPrice(property.pricePerNight)}/night`,
                  propertySlug: `stays/${property.id}`
                });
              }}
              className="p-2 rounded-full bg-black/60 text-[#ffdea5] hover:bg-white hover:text-[#1c1815] backdrop-blur-md transition-all cursor-pointer shadow border border-white/20"
              title="Inspect Photo Lightbox"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-[#e11d48] text-white shadow-md'
                : 'bg-white/80 text-[#1c1815] hover:bg-white border border-[#ebdcc8]'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Multi-image Navigation Arrows (Visible on hover or touch) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer backdrop-blur-sm border border-white/20"
              title="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer backdrop-blur-sm border border-white/20"
              title="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Bottom Bar: Image Index Counter & Property Type Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10 pointer-events-none">
          <span className="text-[11px] font-medium tracking-wide uppercase text-white drop-shadow font-mono bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
            {property.propertyType}
          </span>

          {/* Photo Counter Badge */}
          {images.length > 1 && (
            <span className="text-[10px] font-bold text-[#ffdea5] bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#ffdea5]/30 flex items-center gap-1 shadow">
              <Camera className="w-2.5 h-2.5" />
              <span>{activeImageIndex + 1}/{images.length}</span>
            </span>
          )}
        </div>

        {/* Bottom Center Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'w-4 bg-[#ffdea5]'
                    : 'w-1.5 bg-white/50 hover:bg-white'
                }`}
                title={`Jump to photo ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Compare Checkbox pill */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(property);
          }}
          className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md transition-all z-10 cursor-pointer ${
            isCompared
              ? 'bg-[#1c1815] text-[#ffdea5]'
              : 'bg-white/85 text-[#1c1815] hover:bg-white border border-[#ebdcc8]'
          }`}
        >
          {isCompared ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
        </button>
      </div>

      {/* Property Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-[#5c534a] mb-1">
            <span className="flex items-center gap-1 font-medium text-[#5c534a]">
              <MapPin className="w-3.5 h-3.5 text-[#b8860b]" />
              {property.location}
            </span>
            <div className="flex items-center gap-1 font-bold text-[#1c1815]">
              <Star className="w-3.5 h-3.5 text-[#b8860b] fill-current" />
              <span>{property.rating}</span>
              <span className="text-[#8a8075] font-normal">({property.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/stays/${property.id}`} className="block group-hover:text-[#b8860b] transition-colors">
            <h3 className="font-serif font-semibold text-lg text-[#1c1815] leading-snug line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-[#5c534a] line-clamp-2 mt-1.5 leading-relaxed font-light">
            {property.description}
          </p>

          {/* Image Thumbnail Quick Strip on Hover */}
          {images.length > 1 && (
            <div className="flex items-center gap-1.5 pt-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  className={`w-8 h-6 rounded overflow-hidden border transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#b8860b] ring-1 ring-[#b8860b] scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  title={`View photo ${idx + 1}`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Capacity & Price Footer */}
        <div className="pt-3 border-t border-[#f0e6d8] flex items-center justify-between">
          
          <div className="flex items-center space-x-3 text-xs text-[#5c534a]">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-[#8a8075]" />
              <span>{property.bedrooms} Bed</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#8a8075]" />
              <span>Max {property.maxGuests}</span>
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="text-[10px] text-[#8a8075] block">From</span>
            <span className="font-serif font-bold text-lg text-[#9e7208]">
              {formatPrice(property.pricePerNight)}
            </span>
            <span className="text-[10px] text-[#8a8075]"> / night</span>
          </div>

        </div>

      </div>

    </div>
  );
};

