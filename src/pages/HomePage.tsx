import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SearchWidget } from '../components/SearchWidget';
import { PropertyCard } from '../components/PropertyCard';
import { Destination, Property, Experience, TravelJournal, SeasonalEscape } from '../types';
import { SEASONAL_ESCAPES } from '../data/seedData';
import { apiService } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, ArrowRight, ShieldCheck, Star, Compass, Award, 
  Camera, Maximize2, X, Image as ImageIcon, BookOpen, Heart, Eye,
  MapPin, Clock, Tag, Flame, CheckCircle2, Gift, Percent
} from 'lucide-react';

const HERO_SCENES = [
  {
    title: 'Maldives Overwater Sanctuary',
    subtitle: 'Crystal Blue Lagoon • Private Glass Bungalow',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Amalfi Clifftop Estate',
    subtitle: 'Positano Panoramic Vistas • Heated Infinity Pool',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Lake Como Neoclassical Palazzo',
    subtitle: 'Bellagio Waterfront • Private Riva Yacht Mooring',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Matterhorn Alpine Chalet',
    subtitle: 'Zermatt Ski-In • Private Butler & Thermal Spa',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Bora Bora Lagoon Bungalow',
    subtitle: 'Mount Otemanu Vistas • Private Pontoon',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
  },
];

const GALLERY_MOMENTS = [
  {
    id: 'g-1',
    title: 'Vintage Riva Aquarama Cruise',
    location: 'Bellagio, Lake Como',
    category: 'Yacht Charter',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    propertySlug: 'villa-balbianello-estate',
  },
  {
    id: 'g-2',
    title: 'Overwater Lagoon Dining',
    location: 'Motu To’opua, Bora Bora',
    category: 'Culinary Sanctuary',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    propertySlug: 'mount-otemanu-lagoon-villa',
  },
  {
    id: 'g-3',
    title: 'Helicopter Alpine Summit Arrival',
    location: 'Matterhorn, Zermatt',
    category: 'Private Aviation',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
    propertySlug: 'chalet-zermatt-peak',
  },
  {
    id: 'g-4',
    title: 'Positano Infinity Sunset Pool',
    location: 'Amalfi Coast, Italy',
    category: 'Clifftop Estate',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    propertySlug: 'villa-azure-amalfi',
  },
  {
    id: 'g-5',
    title: 'Bamboo Grove Zen Tea Pavilion',
    location: 'Arashiyama, Kyoto',
    category: 'Cultural Sanctuary',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    propertySlug: 'arashiyama-bamboo-sanctuary',
  },
  {
    id: 'g-6',
    title: 'Subterranean Sommelier Wine Cellar',
    location: 'Red Mountain, Aspen',
    category: 'Private Sommelier',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
    propertySlug: 'red-mountain-alpine-lodge',
  },
  {
    id: 'g-7',
    title: 'Monaco Sky Cliffside Terrace',
    location: 'Cap-d\'Ail, French Riviera',
    category: 'Coastal Estate',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
    propertySlug: 'villa-cap-dail-monaco-sky',
  },
  {
    id: 'g-8',
    title: 'Camps Bay Sunset Glass Lounge',
    location: 'Cape Town, South Africa',
    category: 'Oceanfront Glass Mansion',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    propertySlug: 'camps-bay-oceanfront-glass-mansion',
  },
];

const LIFESTYLE_COLLECTIONS = [
  {
    id: 'col-1',
    title: 'Clifftop Ocean Sanctuaries',
    tagline: 'Perched over dramatic turquoise waters',
    count: '18 Estates',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80',
    typeFilter: 'Villa',
  },
  {
    id: 'col-2',
    title: 'Overwater Glass Bungalows',
    tagline: 'Step directly into pristine coral lagoons',
    count: '12 Resorts',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    typeFilter: 'Resort',
  },
  {
    id: 'col-3',
    title: 'Ski-In Alpine Chalets',
    tagline: 'Heated pools with mountain vistas',
    count: '14 Lodges',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80',
    typeFilter: 'Chalet',
  },
  {
    id: 'col-4',
    title: 'Private Island Estates',
    tagline: 'Complete perimeter seclusion & helipads',
    count: '10 Islands',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    typeFilter: 'Private Estate',
  },
  {
    id: 'col-5',
    title: 'Superyacht & Jet Charters',
    tagline: 'Bespoke global aviation & marine fleets',
    count: '15 Fleets',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
    typeFilter: 'Yacht',
  },
];

export const HomePage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [featuredStays, setFeaturedStays] = useState<Property[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [journals, setJournals] = useState<TravelJournal[]>([]);

  // Interactive Hero Scene Index
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);

  // Sanctuaries of Seclusion Active Category Filter
  const [activeSanctuaryRegion, setActiveSanctuaryRegion] = useState<string>('All');
  const [sanctuaryLimit, setSanctuaryLimit] = useState<number>(6);

  // Exclusive Seasonal Escapes Active Season Filter
  const [activeSeasonalFilter, setActiveSeasonalFilter] = useState<string>('All Escapes');

  // Full-screen Image Lightbox Modal State
  const [lightboxData, setLightboxData] = useState<{
    url: string;
    title: string;
    location: string;
    category?: string;
    propertySlug?: string;
  } | null>(null);

  const { formatPrice, setIsConciergeOpen } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getDestinations().then(setDestinations);
    apiService.getProperties().then((props) => setFeaturedStays(props.slice(0, 6)));
    apiService.getExperiences().then((exps) => setExperiences(exps.slice(0, 4)));
    apiService.getJournals().then(setJournals);
  }, []);

  const currentHero = HERO_SCENES[activeHeroIndex];

  return (
    <div className="space-y-20 pb-16 text-[#1c1815]">
      
      {/* HERO SECTION WITH DYNAMIC SCENE SWITCHER */}
      <section className="relative min-h-[90vh] flex flex-col justify-between px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        
        {/* Background Image Layer with transition */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-b-[2.5rem]">
          <img
            key={currentHero.image}
            src={currentHero.image}
            alt={currentHero.title}
            className="w-full h-full object-cover scale-105 transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf6] via-black/40 to-black/20" />
        </div>

        {/* Top Spacer */}
        <div className="relative z-10 pt-4" />

        {/* Hero Central Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#ebdcc8] text-xs font-bold text-[#8a6314] shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#9e7208]" />
            <span>Curate Your Extraordinary • Privé Portfolio</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-md leading-[1.1]">
            Quiet Luxury Stays, <br />
            <span className="italic font-normal text-[#ffdea5]">Private Charters</span> & Experiences
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/95 drop-shadow font-normal leading-relaxed">
            Discover vetted cliffside estates, overwater sanctuaries, and private jet aviation tailored to discerning global travelers.
          </p>

          {/* Natural Language / Filter Search Widget */}
          <div className="pt-4">
            <SearchWidget />
          </div>

        </div>

        {/* HERO SCENE PREVIEW BAR (Visual Scene Selector) */}
        <div className="relative z-10 max-w-5xl mx-auto w-full pt-8">
          <div className="flex items-center justify-between text-xs mb-2 text-[#3b352e] px-1 bg-white/70 backdrop-blur-md rounded-lg p-2 border border-[#ebdcc8]/80">
            <span className="font-bold text-[#8a6314] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#9e7208]" /> Live Hero Visual Scenes
            </span>
            <span className="text-[11px] font-semibold text-[#1c1815] hidden sm:inline">
              Scene {activeHeroIndex + 1} of {HERO_SCENES.length}: {currentHero.title}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {HERO_SCENES.map((scene, idx) => {
              const isActive = idx === activeHeroIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`group relative rounded-xl overflow-hidden h-16 sm:h-20 border text-left transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'border-[#9e7208] ring-2 ring-[#9e7208]/60 scale-[1.02] shadow-xl'
                      : 'border-[#ebdcc8] opacity-80 hover:opacity-100 hover:border-[#b8860b]'
                  }`}
                >
                  <img
                    src={scene.image}
                    alt={scene.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-white line-clamp-1 leading-tight">
                      {scene.title}
                    </span>
                    <span className="text-[9px] text-[#ffdea5] line-clamp-1 opacity-90 hidden sm:block">
                      {scene.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {/* SECTION 2: BENTO GRID TRENDING DESTINATIONS - SANCTUARIES OF SECLUSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8a6314] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#8a6314]" /> Hand-Vetted Global Micro-Destinations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1815] mt-1">
              Sanctuaries of Seclusion
            </h2>
            <p className="text-xs text-[#6a6666] mt-1 font-light max-w-xl">
              Immerse in ultra-private private island reserves, clifftop estates, and alpine hideaways with verified seclusion indices and direct concierge access.
            </p>
          </div>

          <Link
            to="/destinations"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#8a6314] hover:text-[#1c1815] transition-colors shrink-0 bg-[#f2ede4] px-4 py-2 rounded-full border border-[#dcd3c1]"
          >
            <span>Explore All {destinations.length} Sanctuaries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Region Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['All', 'Island', 'Coastal', 'Alpine', 'Tropical'].map((region) => (
            <button
              key={region}
              onClick={() => {
                setActiveSanctuaryRegion(region);
                setSanctuaryLimit(6);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
                activeSanctuaryRegion === region
                  ? 'bg-[#1c1815] text-[#ffdea5] border-[#1c1815] shadow-md'
                  : 'bg-white text-[#4a4646] border-[#e2dede] hover:bg-[#f5f2ed] hover:text-[#1c1815]'
              }`}
            >
              {region === 'All' ? 'All Sanctuaries' : `${region} Sanctuaries`}
            </button>
          ))}
        </div>

        {/* Bento / Dynamic Grid Showcase */}
        {(() => {
          const filteredSanctuaries = destinations.filter(d =>
            activeSanctuaryRegion === 'All' ? true : d.region.toLowerCase().includes(activeSanctuaryRegion.toLowerCase())
          );

          const displayed = filteredSanctuaries.slice(0, sanctuaryLimit);

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayed.map((dest, idx) => {
                  return (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, y: 35, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.55,
                        ease: [0.16, 1, 0.3, 1],
                        delay: (idx % 3) * 0.08,
                      }}
                      onClick={() => navigate(`/destinations/${dest.slug}`)}
                      className="group bg-white rounded-3xl border border-[#e8e4e4] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-full"
                    >
                      {/* Top Photo Section */}
                      <div className="relative h-64 overflow-hidden bg-[#1c1815]">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        {/* Top Left Privacy Score & Quick View */}
                        <div className="absolute top-4 left-4 flex items-center space-x-2">
                          <span className="px-3 py-1 bg-black/65 backdrop-blur-md text-[#ffdea5] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#ffdea5]/30 shadow">
                            {dest.privacyScore || '10/10 Seclusion Index'}
                          </span>
                        </div>

                        {/* Top Right Quick Inspection Eye & Weather */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxData({
                                url: dest.image,
                                title: `${dest.name} Sanctuary`,
                                location: `${dest.country} (${dest.region})`,
                                category: `Weather: ${dest.weather.tempC}°C • ${dest.weather.condition} | Best: ${dest.bestTime}`,
                                propertySlug: `destinations/${dest.slug}`
                              });
                            }}
                            className="p-2 rounded-full bg-white/90 text-[#1c1815] hover:bg-white hover:scale-110 transition-all cursor-pointer shadow"
                            title="Inspect Sanctuary High-Res Photo"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[#1c1815] text-[11px] font-bold border border-[#ebdcc8] shadow">
                            {dest.weather.tempC}°C • {dest.weather.condition}
                          </div>
                        </div>

                        {/* Bottom Transfer Method Overlay */}
                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-white/90 font-medium">
                          <span className="bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10 text-white font-mono text-[10px]">
                            {dest.transferTag || 'VIP Helicopter & Yacht'}
                          </span>
                          <span className="text-[#ffdea5] font-semibold text-[10px]">
                            Best: {dest.bestTime}
                          </span>
                        </div>
                      </div>

                      {/* Bottom White Details Content */}
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

                          {/* Highlights Chips */}
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

                        {/* Bottom Footer Line */}
                        <div className="pt-4 border-t border-[#f0eae1] flex items-center justify-between text-xs font-semibold text-[#1c1815]">
                          <span className="text-[#4a4646]">
                            {dest.propertiesCount} Privé Residences
                          </span>
                          <span className="flex items-center gap-1.5 text-[#8a6314] font-bold group-hover:translate-x-1 transition-transform">
                            Explore Stays <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Show More Sanctuaries Trigger */}
              {displayed.length < filteredSanctuaries.length && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setSanctuaryLimit(prev => prev + 6)}
                    className="px-6 py-3 bg-[#1c1815] text-[#ffdea5] text-xs font-bold rounded-2xl hover:bg-[#2d2926] transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#ffdea5]" />
                    <span>View More Sanctuaries of Seclusion ({filteredSanctuaries.length - displayed.length} remaining)</span>
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </section>

      {/* SECTION 3: EXCLUSIVE SEASONAL ESCAPES (DYNAMIC PRICING & LOCATION TAGGING) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-gradient-to-r from-[#1c1815] via-[#2a241f] to-[#1c1815] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-[#ffdea5]/20">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#ffdea5]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ffdea5]/15 text-[#ffdea5] text-xs font-bold border border-[#ffdea5]/30">
                <Flame className="w-3.5 h-3.5 text-[#ffdea5] animate-pulse" />
                <span>LIMITED-TIME PRIVÉ PRIVILEGES</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Exclusive Seasonal Escapes
              </h2>
              <p className="text-xs sm:text-sm text-[#e8dfd5] font-light leading-relaxed">
                Curated seasonal privileges, time-sensitive dynamic rate reductions, and complimentary ultra-luxury inclusions across our premier global sanctuaries.
              </p>
            </div>

            {/* Season Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {['All Escapes', 'Autumn Harvest', 'Winter Alpine', 'Tropical Sun', 'Spring Blossom'].map((season) => (
                <button
                  key={season}
                  onClick={() => setActiveSeasonalFilter(season)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
                    activeSeasonalFilter === season
                      ? 'bg-[#ffdea5] text-[#1c1815] border-[#ffdea5] shadow-md'
                      : 'bg-white/10 text-[#f5ebd9] border-white/20 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seasonal Offers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SEASONAL_ESCAPES.filter(escape => activeSeasonalFilter === 'All Escapes' || escape.season === activeSeasonalFilter).map((escape) => {
            const discountPercentage = Math.round(((escape.originalPrice - escape.offerPrice) / escape.originalPrice) * 100);
            const savingsAmount = escape.originalPrice - escape.offerPrice;

            return (
              <div
                key={escape.id}
                className="group bg-white rounded-3xl border border-[#ebdcc8] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Top Image & Overlay Badges */}
                <div className="relative h-64 overflow-hidden bg-[#1c1815]">
                  <img
                    src={escape.image}
                    alt={escape.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                  {/* Top Left: Season Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-[#ffdea5] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#ffdea5]/30 shadow">
                      {escape.season}
                    </span>
                  </div>

                  {/* Top Right: Dynamic Discount Tag & Lightbox */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxData({
                          url: escape.image,
                          title: escape.title,
                          location: `${escape.location}, ${escape.country}`,
                          category: escape.savingsTag,
                          propertySlug: escape.propertySlug ? `stays/${escape.propertySlug}` : undefined
                        });
                      }}
                      className="p-2 rounded-full bg-white/90 text-[#1c1815] hover:bg-white hover:scale-110 transition-all cursor-pointer shadow"
                      title="Inspect High-Res Offer Photography"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <div className="bg-[#b8860b] text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-lg border border-[#ffdea5]/40 flex items-center gap-1">
                      <Percent className="w-3 h-3 text-[#ffdea5]" />
                      <span>-{discountPercentage}% OFFER</span>
                    </div>
                  </div>

                  {/* Bottom Overlay: Location Tagging */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs">
                    <div className="flex items-center gap-1.5 font-medium bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                      <MapPin className="w-3.5 h-3.5 text-[#ffdea5]" />
                      <span className="text-[11px] font-semibold tracking-wide">{escape.location}</span>
                    </div>

                    <span className="text-[10px] bg-red-950/80 text-red-200 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      ⚡ Only {escape.remainingUnits} Left
                    </span>
                  </div>
                </div>

                {/* Offer Details Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
                  <div className="space-y-3">
                    {/* Validity & Country Tag */}
                    <div className="flex items-center justify-between text-[11px] text-[#7a6f64] font-medium border-b border-[#f2ece2] pb-3">
                      <span className="flex items-center gap-1.5 text-[#8a6314] font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#8a6314]" />
                        Valid through {escape.validUntil}
                      </span>

                      <span className="text-[10px] font-bold bg-[#fcf8f2] text-[#8a6314] px-2.5 py-1 rounded-full border border-[#e8dac5]">
                        {escape.country}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#1c1815] group-hover:text-[#8a6314] transition-colors leading-snug">
                      {escape.title}
                    </h3>

                    <p className="text-xs text-[#5c554e] line-clamp-2 font-light leading-relaxed">
                      {escape.tagline}
                    </p>

                    {/* Dynamic Pricing Box */}
                    <div className="p-3.5 bg-[#faf6f0] rounded-2xl border border-[#ebdcc8] space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-[#7a6f64] uppercase tracking-wider font-bold">
                          Privé Seasonal Rate
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#9a8f83] line-through font-mono">
                            {formatPrice(escape.originalPrice)}
                          </span>
                          <span className="text-xl font-extrabold text-[#1c1815] font-mono">
                            {formatPrice(escape.offerPrice)}
                          </span>
                          <span className="text-[10px] text-[#6b6257] font-normal">
                            / night
                          </span>
                        </div>
                      </div>

                      {/* Savings Pill */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#e2d5c3] text-[11px]">
                        <span className="text-[#8a6314] font-bold flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5 text-[#8a6314]" />
                          {escape.savingsTag}
                        </span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                          Save {formatPrice(savingsAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Inclusions List */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a6314] block">
                        Complimentary Offer Inclusions
                      </span>
                      <div className="grid grid-cols-1 gap-1">
                        {escape.inclusions.map((inc, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#4a433b]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#8a6314] shrink-0" />
                            <span className="line-clamp-1">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-[#f2ece2] flex items-center gap-2">
                    {escape.propertySlug && (
                      <button
                        onClick={() => navigate(`/stays/${escape.propertySlug}`)}
                        className="flex-1 py-2.5 px-4 bg-[#1c1815] text-[#ffdea5] text-xs font-bold rounded-xl hover:bg-[#2e2823] transition-all cursor-pointer shadow flex items-center justify-center gap-1.5 group/btn"
                      >
                        <span>Claim Offer</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    )}

                    <button
                      onClick={() => setIsConciergeOpen(true)}
                      className="py-2.5 px-3 bg-[#f5ede2] text-[#8a6314] text-xs font-bold rounded-xl hover:bg-[#ebdcc8] transition-all cursor-pointer border border-[#ebdcc8] flex items-center justify-center gap-1 shrink-0"
                      title="Inquire with Privé Concierge regarding this offer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Inquire</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: VISUAL LIFESTYLE PORTFOLIO COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8a6314]">
              Lifestyle Portfolios
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1815] mt-1">
              Curated Living Aesthetics
            </h2>
          </div>
          <Link
            to="/stays"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#8a6314] hover:text-[#1c1815] transition-colors"
          >
            <span>Browse All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {LIFESTYLE_COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => navigate(`/stays?propertyType=${col.typeFilter}`)}
              className="group relative rounded-2xl overflow-hidden h-72 border border-[#ebdcc8] cursor-pointer shadow-md transition-all duration-500 hover:border-[#b8860b] hover:-translate-y-1 bg-white"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[#8a6314] text-[10px] font-bold border border-[#ebdcc8]">
                {col.count}
              </div>

              <div className="absolute bottom-5 left-5 right-5 space-y-1.5 text-white">
                <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-[#ffdea5] transition-colors">
                  {col.title}
                </h3>
                <p className="text-[11px] text-slate-200 font-light line-clamp-2 leading-relaxed">
                  {col.tagline}
                </p>
                <div className="pt-2 text-[10px] font-bold text-[#ffdea5] uppercase tracking-wider flex items-center gap-1">
                  <span>Explore Portfolio</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: FEATURED PRIVÉ STAYS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8a6314]">
              Featured Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1815] mt-1">
              Architectural Masterpieces
            </h2>
          </div>
          <Link
            to="/stays"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#8a6314] hover:text-[#1c1815] transition-colors"
          >
            <span>View All Stays</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredStays.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onInspectPhoto={(data) => setLightboxData(data)}
            />
          ))}
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE 8-PHOTO EDITORIAL MOSAIC GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8a6314] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#9e7208]" /> High-Resolution Photography
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1815] mt-1">
              Moments of Pure Seclusion
            </h2>
          </div>
          <p className="text-xs text-[#5c534a] max-w-md font-light">
            Click any photograph to view high-resolution details or explore the corresponding estate.
          </p>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GALLERY_MOMENTS.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxData({
                url: item.image,
                title: item.title,
                location: item.location,
                category: item.category,
                propertySlug: item.propertySlug,
              })}
              className="group relative rounded-2xl overflow-hidden h-64 border border-[#ebdcc8] cursor-pointer shadow-md hover:border-[#b8860b] transition-all duration-500 bg-white"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[#8a6314] text-[10px] font-bold border border-[#ebdcc8]">
                {item.category}
              </div>

              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
                <p className="text-[10px] text-[#ffdea5] uppercase tracking-widest font-semibold">
                  {item.location}
                </p>
                <h3 className="font-serif text-sm font-bold group-hover:text-[#ffdea5] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: AI CONCIERGE PROMISE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-[#1c1815] relative overflow-hidden border border-[#ebdcc8] shadow-xl">
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#f2e8d8] text-[#8a6314] text-xs font-bold border border-[#e2d0b5]">
                <Sparkles className="w-3.5 h-3.5 text-[#9e7208]" />
                <span>Seamless Travel Intelligence</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-[#1c1815]">
                Your Personal Travel Concierge, Available 24/7
              </h2>
              <p className="text-xs sm:text-sm text-[#5c534a] leading-relaxed font-light">
                Whether you need a private yacht charter through the Amalfi coastline, a Michelin-starred chef in your St. Barts villa, or a helicopter summit transfer in Zermatt, LuxeAI orchestrates every detail instantly.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setIsConciergeOpen(true)}
                  className="px-6 py-3 rounded-full bg-[#1c1815] text-[#ffdea5] font-bold text-xs hover:bg-[#2e2924] transition-colors flex items-center space-x-2 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-[#ffdea5]" />
                  <span>Launch AI Concierge</span>
                </button>
                <Link
                  to="/trip-planner"
                  className="px-6 py-3 rounded-full bg-[#f6f0e6] text-[#1c1815] font-bold text-xs border border-[#ebdcc8] hover:bg-[#eae0d0] transition-colors flex items-center space-x-2"
                >
                  <span>Build Custom Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Card Mockup */}
            <div className="bg-[#fcfaf6] p-6 rounded-2xl border border-[#ebdcc8] space-y-4 shadow-sm text-[#1c1815]">
              <div className="flex items-center space-x-3 pb-3 border-b border-[#ebdcc8]">
                <div className="w-10 h-10 rounded-full bg-[#1c1815] text-[#ffdea5] flex items-center justify-center font-bold">
                  L
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1c1815]">Privé Travel Concierge</h4>
                  <p className="text-[10px] text-[#7a6f63]">Instant Booking & Flight Transfers</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-[#ebdcc8] text-[#1c1815] shadow-xs">
                  <p className="font-bold text-[#8a6314]">✨ AI Smart Match</p>
                  <p className="mt-1 font-light text-[#5c534a]">"Villa Azure matches 98% of your preferences for clifftop ocean infinity pool and private chef."</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#ebdcc8] text-[#1c1815] shadow-xs">
                  <p className="font-bold text-[#1c1815]">🚁 Helicopter Charter Status</p>
                  <p className="mt-1 font-light text-[#5c534a]">"Glacier Express & Zermatt Helipad transfer confirmed."</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 7: CHARTERS & EXPERIENCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8a6314]">
              Bespoke Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1815] mt-1">
              Charters & Private Aviation
            </h2>
          </div>
          <Link
            to="/experiences"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#8a6314] hover:text-[#1c1815] transition-colors"
          >
            <span>View All Experiences</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              onClick={() => navigate(`/experiences/${exp.id}`)}
              className="group bg-white rounded-2xl border border-[#ebdcc8] overflow-hidden cursor-pointer hover:border-[#b8860b] shadow-md hover:shadow-xl transition-all text-[#1c1815]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#8a6314] text-[10px] font-bold uppercase border border-[#ebdcc8]">
                  {exp.category}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#5c534a]">
                  <span>{exp.location}</span>
                  <span className="font-bold text-[#1c1815] flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#b8860b] fill-current" />
                    {exp.rating}
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-sm text-[#1c1815] line-clamp-1 group-hover:text-[#b8860b]">
                  {exp.title}
                </h3>
                <div className="pt-2 flex items-center justify-between text-xs border-t border-[#f0e6d8]">
                  <span className="text-[#8a8075]">{exp.duration}</span>
                  <span className="font-bold text-[#9e7208]">{formatPrice(exp.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: TRAVEL JOURNALS & GUEST STORIES WITH PHOTOS */}
      {journals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8a6314] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#9e7208]" /> Guest Chronicles
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1815] mt-1">
                Traveler Visual Journals
              </h2>
            </div>
            <Link
              to="/destinations"
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#8a6314] hover:text-[#1c1815] transition-colors"
            >
              <span>Explore All Stories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {journals.map((journal) => (
              <div
                key={journal.id}
                className="bg-white rounded-2xl border border-[#ebdcc8] overflow-hidden shadow-md flex flex-col md:flex-row group hover:border-[#b8860b] transition-all"
              >
                <div className="md:w-1/2 relative h-56 md:h-auto overflow-hidden">
                  <img
                    src={journal.coverImage}
                    alt={journal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[#8a6314] text-[10px] font-bold border border-[#ebdcc8]">
                    {journal.destination}
                  </div>
                </div>

                <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#7a6f63]">
                      <span>{journal.author}</span>
                      <span>{journal.date}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#1c1815] group-hover:text-[#b8860b] transition-colors">
                      {journal.title}
                    </h3>
                    <p className="text-xs text-[#5c534a] font-light line-clamp-3 leading-relaxed">
                      "{journal.story}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#f0e6d8] flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[#8a6314] font-semibold text-[11px]">
                      <Heart className="w-3.5 h-3.5 fill-current text-[#e11d48]" /> {journal.likes} Likes
                    </span>
                    <button
                      onClick={() => setLightboxData({
                        url: journal.coverImage,
                        title: journal.title,
                        location: journal.destination,
                        category: `Chronicle by ${journal.author}`
                      })}
                      className="text-xs font-bold text-[#1c1815] hover:text-[#b8860b] flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Gallery</span>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 9: LUXEWAY PROMISE & TRUST */}
      <section className="bg-[#f6f0e6] py-16 border-y border-[#ebdcc8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8a6314]">
              The LuxeWay Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1815] mt-1">
              Uncompromising Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-2xl border border-[#ebdcc8] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#f2e8d8] text-[#8a6314] flex items-center justify-center font-bold border border-[#e2d0b5]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1c1815]">Privé Vetted Portfolio</h3>
              <p className="text-xs text-[#5c534a] leading-relaxed font-light">
                Every property undergoes a 120-point quality audit covering architectural integrity, linen count, privacy perimeter, and local staff verification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#ebdcc8] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#f2e8d8] text-[#8a6314] flex items-center justify-center font-bold border border-[#e2d0b5]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1c1815]">Transparent Rates</h3>
              <p className="text-xs text-[#5c534a] leading-relaxed font-light">
                No hidden cleaning fees or surprise service markups. What you see is guaranteed with price drop matching.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#ebdcc8] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#f2e8d8] text-[#8a6314] flex items-center justify-center font-bold border border-[#e2d0b5]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1c1815]">Dedicated Resident Butler</h3>
              <p className="text-xs text-[#5c534a] leading-relaxed font-light">
                Enjoy 24/7 resident hospitality including daily champagne breakfast service, unpacking concierge, and private transfers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX PREVIEW MODAL */}
      {lightboxData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative max-w-5xl w-full bg-white border border-[#ebdcc8] rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[#1c1815]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 flex items-center justify-between border-b border-[#ebdcc8] bg-[#fcfaf6]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8a6314] tracking-widest">
                  {lightboxData.category || 'High-Resolution Photography'}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1c1815]">
                  {lightboxData.title}
                </h3>
                <p className="text-xs text-[#7a6f63]">{lightboxData.location}</p>
              </div>

              <button
                onClick={() => setLightboxData(null)}
                className="p-2 rounded-full bg-[#f6f0e6] hover:bg-[#ebdcc8] text-[#1c1815] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative max-h-[65vh] bg-[#1a1715] flex items-center justify-center overflow-hidden">
              <img
                src={lightboxData.url}
                alt={lightboxData.title}
                className="w-full h-full object-contain max-h-[65vh]"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-[#fcfaf6] border-t border-[#ebdcc8] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#5c534a] font-light text-center sm:text-left">
                Privé Photography Collection • Captured on location
              </div>

              <div className="flex items-center space-x-3">
                {lightboxData.propertySlug && (
                  <button
                    onClick={() => {
                      const slug = lightboxData.propertySlug;
                      setLightboxData(null);
                      navigate(`/stays/${slug}`);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#1c1815] text-[#ffdea5] font-bold text-xs hover:bg-[#2e2924] transition-colors flex items-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <span>View Property Details</span>
                    <ArrowRight className="w-4 h-4 text-[#ffdea5]" />
                  </button>
                )}
                <button
                  onClick={() => setLightboxData(null)}
                  className="px-5 py-2.5 rounded-full bg-[#f6f0e6] text-[#1c1815] font-bold text-xs border border-[#ebdcc8] hover:bg-[#eae0d0] transition-colors cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

