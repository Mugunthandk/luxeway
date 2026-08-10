import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, MapPin, Calendar, Users, Home, ArrowRight, Check } from 'lucide-react';
import { apiService } from '../services/api';

export const SearchWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stays' | 'charters' | 'experiences' | 'longstays'>('stays');
  const [searchMode, setSearchMode] = useState<'standard' | 'ai'>('ai');
  
  // Standard Form State
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [propertyType, setPropertyType] = useState('All');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResultSummary, setAiResultSummary] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleStandardSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (guests) params.set('guests', String(guests));
    if (propertyType && propertyType !== 'All') params.set('propertyType', propertyType);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);

    navigate(`/stays?${params.toString()}`);
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    try {
      const res = await apiService.aiSearch(aiPrompt);
      const ext = res.extracted || {};
      
      setAiResultSummary(ext.summary || `Extracted destination: ${ext.destination || 'Global'}, type: ${ext.propertyType || 'Villa'}, guests: ${ext.guests || 2}`);
      
      const params = new URLSearchParams();
      if (ext.destination) params.set('destination', ext.destination);
      if (ext.propertyType) params.set('propertyType', ext.propertyType);
      if (ext.guests) params.set('guests', String(ext.guests));
      if (ext.maxBudget) params.set('maxPrice', String(ext.maxBudget));
      params.set('aiQuery', aiPrompt);

      setTimeout(() => {
        setIsAiLoading(false);
        navigate(`/stays?${params.toString()}`);
      }, 800);
    } catch (err) {
      setIsAiLoading(false);
      navigate(`/stays?search=${encodeURIComponent(aiPrompt)}`);
    }
  };

  const samplePrompts = [
    "Villa in St. Barts with private pool, butler, for 6 guests",
    "Ski chalet in Zermatt near Matterhorn with indoor spa",
    "Overwater bungalow in Maldives for honeymoon under $5000/night",
    "Cliffside estate in Positano with lemon groves & chef"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 shadow-xl border border-[#ebdcc8] text-[#1c1815] transition-all">
      
      {/* Search Header Tabs & Mode Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#f0e6d8] gap-4 mb-4">
        
        {/* Category Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-[#f6f0e6] p-1 rounded-xl">
          {[
            { id: 'stays', label: 'Villas & Stays' },
            { id: 'charters', label: 'Private Charters' },
            { id: 'experiences', label: 'Curated Experiences' },
            { id: 'longstays', label: 'Long Stays & Estates' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1c1815] text-[#ffdea5] shadow-md font-bold'
                  : 'text-[#5c534a] hover:text-[#1c1815]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* AI Search Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-[#5c534a]">Search Mode:</span>
          <button
            onClick={() => setSearchMode(searchMode === 'ai' ? 'standard' : 'ai')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              searchMode === 'ai'
                ? 'bg-[#9e7208] text-white shadow-md'
                : 'bg-[#f6f0e6] text-[#1c1815] hover:bg-[#eae0d0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>{searchMode === 'ai' ? 'Natural Language AI' : 'Standard Filters'}</span>
          </button>
        </div>
      </div>

      {/* AI Prompt Input Bar */}
      {searchMode === 'ai' ? (
        <form onSubmit={handleAiSearch} className="space-y-3">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[#9e7208]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your ideal journey in plain language (e.g., Clifftop villa in St. Barts for 6 guests with private chef and sunset terrace...)"
              className="w-full pl-12 pr-32 py-4 bg-[#fcfaf6] border border-[#ebdcc8] rounded-xl text-sm text-[#1c1815] placeholder-[#8a8075] focus:outline-none focus:ring-2 focus:ring-[#9e7208] focus:bg-white transition-all font-medium shadow-inner"
            />
            <button
              type="submit"
              disabled={isAiLoading || !aiPrompt.trim()}
              className="absolute right-2 px-5 py-2.5 bg-[#1c1815] text-[#ffdea5] font-bold text-xs rounded-lg hover:bg-[#2e2924] disabled:opacity-50 transition-all flex items-center space-x-1.5 cursor-pointer shadow"
            >
              {isAiLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#ffdea5]" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4 text-[#ffdea5]" />
                </>
              )}
            </button>
          </div>

          {/* Sample prompt chips */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pt-1">
            <span className="text-[11px] font-semibold text-[#7a6f63] shrink-0">Try asking:</span>
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAiPrompt(p)}
                className="px-2.5 py-1 bg-[#f6f0e6] hover:bg-[#ebdcc8] text-[#3b352e] text-[11px] rounded-md transition-colors cursor-pointer shrink-0 border border-[#e2d5c3]"
              >
                "{p}"
              </button>
            ))}
          </div>

          {aiResultSummary && (
            <div className="p-2.5 bg-[#f5e9d2] border border-[#dfc385] rounded-lg text-xs text-[#8a6314] flex items-center gap-2">
              <Check className="w-4 h-4 text-[#8a6314]" />
              <span>{aiResultSummary}</span>
            </div>
          )}
        </form>
      ) : (
        /* Standard Filter Controls Bar */
        <form onSubmit={handleStandardSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          
          {/* Destination */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5c534a] uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#9e7208]" /> Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#fcfaf6] border border-[#ebdcc8] rounded-xl text-xs font-medium text-[#1c1815] focus:outline-none focus:border-[#9e7208]"
            >
              <option value="" className="bg-white text-[#1c1815]">Any Destination</option>
              <option value="Amalfi Coast" className="bg-white text-[#1c1815]">Amalfi Coast, Italy</option>
              <option value="St. Barts" className="bg-white text-[#1c1815]">St. Barts, F.W.I.</option>
              <option value="Zermatt" className="bg-white text-[#1c1815]">Zermatt, Switzerland</option>
              <option value="Maldives" className="bg-white text-[#1c1815]">Maldives Islands</option>
              <option value="Bali" className="bg-white text-[#1c1815]">Bali, Indonesia</option>
              <option value="Santorini" className="bg-white text-[#1c1815]">Santorini, Greece</option>
              <option value="Paris" className="bg-white text-[#1c1815]">Paris, France</option>
              <option value="Dubai" className="bg-white text-[#1c1815]">Dubai, U.A.E.</option>
              <option value="Kyoto" className="bg-white text-[#1c1815]">Kyoto, Japan</option>
              <option value="Seychelles" className="bg-white text-[#1c1815]">Seychelles Islands</option>
              <option value="Lake Como" className="bg-white text-[#1c1815]">Lake Como, Italy</option>
              <option value="Bora Bora" className="bg-white text-[#1c1815]">Bora Bora, French Polynesia</option>
              <option value="Aspen" className="bg-white text-[#1c1815]">Aspen, Colorado, USA</option>
              <option value="French Riviera" className="bg-white text-[#1c1815]">French Riviera & Monaco</option>
              <option value="Cape Town" className="bg-white text-[#1c1815]">Cape Town, South Africa</option>
              <option value="Fiji Islands" className="bg-white text-[#1c1815]">Fiji Islands</option>
              <option value="Turks & Caicos" className="bg-white text-[#1c1815]">Turks & Caicos Islands</option>
              <option value="Whitsunday Islands" className="bg-white text-[#1c1815]">Whitsunday Islands, Australia</option>
              <option value="Kauai" className="bg-white text-[#1c1815]">Kauai, Hawaii, USA</option>
              <option value="Lofoten Islands" className="bg-white text-[#1c1815]">Lofoten Islands, Norway</option>
            </select>
          </div>

          {/* Dates */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5c534a] uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#9e7208]" /> Check-In / Out
            </label>
            <div className="grid grid-cols-2 gap-1">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-2 py-2 bg-[#fcfaf6] border border-[#ebdcc8] rounded-lg text-[11px] text-[#1c1815] focus:outline-none"
              />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-2 py-2 bg-[#fcfaf6] border border-[#ebdcc8] rounded-lg text-[11px] text-[#1c1815] focus:outline-none"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5c534a] uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-[#9e7208]" /> Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-[#fcfaf6] border border-[#ebdcc8] rounded-xl text-xs font-medium text-[#1c1815] focus:outline-none focus:border-[#9e7208]"
            >
              <option value={1} className="bg-white text-[#1c1815]">1 Guest</option>
              <option value={2} className="bg-white text-[#1c1815]">2 Guests (Couple)</option>
              <option value={4} className="bg-white text-[#1c1815]">4 Guests</option>
              <option value={6} className="bg-white text-[#1c1815]">6 Guests (Family)</option>
              <option value={8} className="bg-white text-[#1c1815]">8+ Guests (Group Estate)</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#5c534a] uppercase tracking-wider flex items-center gap-1">
              <Home className="w-3 h-3 text-[#9e7208]" /> Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#fcfaf6] border border-[#ebdcc8] rounded-xl text-xs font-medium text-[#1c1815] focus:outline-none focus:border-[#9e7208]"
            >
              <option value="All" className="bg-white text-[#1c1815]">All Types</option>
              <option value="Villa" className="bg-white text-[#1c1815]">Clifftop Villa</option>
              <option value="Private Estate" className="bg-white text-[#1c1815]">Private Estate</option>
              <option value="Resort" className="bg-white text-[#1c1815]">Overwater Resort</option>
              <option value="Chalet" className="bg-white text-[#1c1815]">Alpine Ski Chalet</option>
              <option value="Penthouse" className="bg-white text-[#1c1815]">City Penthouse</option>
            </select>
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#1c1815] text-[#ffdea5] font-bold text-xs rounded-xl hover:bg-[#2e2924] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <Search className="w-4 h-4 text-[#ffdea5]" />
              <span>Explore Stays</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
