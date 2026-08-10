import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { TripPlan } from '../types';
import { Sparkles, Calendar, Users, DollarSign, Compass, Check, ArrowRight, Download, Utensils, Sun, Moon, Coffee } from 'lucide-react';

export const TripPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const [destination, setDestination] = useState(searchParams.get('destination') || 'Amalfi Coast');
  const [daysCount, setDaysCount] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState('Ultra-Luxury');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Yachting', 'Michelin Dining', 'Secluded Beaches']);

  const [itinerary, setItinerary] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const interestOptions = [
    'Yachting', 'Michelin Dining', 'Secluded Beaches', 'Spa & Wellness',
    'Helicopter Tours', 'Art & Culture', 'Wine Tasting', 'Alpine Skiing'
  ];

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const plan = await apiService.aiGenerateItinerary({
        destination,
        daysCount,
        travelers,
        budget,
        interests: selectedInterests,
      });
      setItinerary(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f2ede4] text-[#8a7a58] text-xs font-bold border border-[#dcd3c1]">
          <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
          <span>Generative AI Intelligence</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1b1c1c]">
          AI Travel Itinerary Generator
        </h1>
        <p className="text-xs sm:text-sm text-[#6a6666]">
          Specify your destination, length of stay, and tailored desires to receive a bespoke, hour-by-hour itinerary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Form Panel */}
        <form onSubmit={handleGenerateItinerary} className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-6 shadow-sm">
          <h3 className="font-serif font-bold text-lg text-[#1b1c1c] border-b border-[#f0ecec] pb-3">
            Journey Parameters
          </h3>

          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a4646]">Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none"
            >
              <option value="Amalfi Coast">Amalfi Coast, Italy</option>
              <option value="St. Barts">St. Barts, F.W.I.</option>
              <option value="Zermatt">Zermatt, Switzerland</option>
              <option value="Maldives">Maldives Islands</option>
              <option value="Bali">Bali, Indonesia</option>
              <option value="Santorini">Santorini, Greece</option>
              <option value="Paris">Paris, France</option>
              <option value="Dubai">Dubai, U.A.E.</option>
            </select>
          </div>

          {/* Duration & Guests */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4a4646]">Days</label>
              <select
                value={daysCount}
                onChange={(e) => setDaysCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none"
              >
                <option value={2}>2 Days (Weekend)</option>
                <option value={3}>3 Days (Escape)</option>
                <option value={5}>5 Days (Full Week)</option>
                <option value={7}>7 Days (Grand Tour)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4a4646]">Travelers</label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold text-[#1b1c1c] focus:outline-none"
              >
                <option value={1}>1 Solo Guest</option>
                <option value={2}>2 Guests (Couple)</option>
                <option value={4}>4 Guests</option>
                <option value={6}>6+ Group</option>
              </select>
            </div>
          </div>

          {/* Budget tier */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a4646]">Tier Preference</label>
            <div className="grid grid-cols-2 gap-2">
              {['High Luxury', 'Ultra-Luxury'].map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    budget === b
                      ? 'bg-[#1b1c1c] text-[#ffdea5] border-[#1b1c1c]'
                      : 'bg-[#f8f6f4] text-[#4a4646] border-[#e2dede]'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#4a4646]">Interests & Desires</label>
            <div className="flex flex-wrap gap-1.5">
              {interestOptions.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleToggleInterest(opt)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                    selectedInterests.includes(opt)
                      ? 'bg-[#b8860b] text-white border-[#b8860b]'
                      : 'bg-[#f8f6f4] text-[#524e4e] border-[#e2dede]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#1b1c1c] text-[#ffdea5] font-bold text-xs rounded-2xl hover:bg-[#2e2d2d] transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Orchestrating Itinerary...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Itinerary</span>
              </>
            )}
          </button>
        </form>

        {/* Right Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          {!itinerary && !isLoading && (
            <div className="bg-white p-12 rounded-3xl border border-[#e8e4e4] text-center space-y-4">
              <Compass className="w-12 h-12 text-[#b8860b] mx-auto opacity-70" />
              <h3 className="font-serif font-bold text-2xl text-[#1b1c1c]">Ready to Curate</h3>
              <p className="text-xs text-[#7a7676] max-w-md mx-auto">
                Configure your destination and preferences on the left, then click "Generate AI Itinerary" to create your bespoke schedule.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white p-12 rounded-3xl border border-[#e8e4e4] text-center space-y-4 animate-pulse">
              <Sparkles className="w-10 h-10 text-[#b8860b] mx-auto animate-spin" />
              <p className="font-serif font-bold text-lg text-[#1b1c1c]">Consulting Gemini AI Luxury Model...</p>
              <p className="text-xs text-[#7a7676]">Selecting private yacht harbors, Michelin tables, and high-altitude transfers.</p>
            </div>
          )}

          {itinerary && !isLoading && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-[#141a32] text-white p-6 sm:p-8 rounded-3xl border border-[#2d3866] shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#ffdea5] uppercase tracking-widest block">
                    Bespoke Itinerary
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                    {itinerary.title || `${daysCount}-Day ${destination} Escape`}
                  </h2>
                  <p className="text-xs text-[#cbd1e6] mt-1">{itinerary.summary}</p>
                </div>

                <button
                  onClick={() => alert('PDF Itinerary saved to your Travel Wallet.')}
                  className="px-4 py-2 bg-[#ffdea5] text-[#141a32] font-bold text-xs rounded-xl hover:bg-[#ffe7be] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>

              {/* Days List */}
              <div className="space-y-6">
                {(itinerary.days || []).map((day, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-[#e8e4e4] shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#f0ecec]">
                      <span className="font-serif font-bold text-lg text-[#1b1c1c]">
                        Day {day.day}: {day.title}
                      </span>
                      <span className="text-xs font-bold text-[#b8860b] bg-[#f2ede4] px-3 py-1 rounded-full border border-[#dcd3c1]">
                        Est. Cost: {day.estimatedCost}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      
                      <div className="p-3 bg-[#fbf9f9] rounded-xl border border-[#ece8e8] space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-[#1b1c1c]">
                          <Coffee className="w-3.5 h-3.5 text-[#b8860b]" />
                          <span>Morning</span>
                        </div>
                        <p className="text-[#524e4e] leading-relaxed">{day.morning}</p>
                      </div>

                      <div className="p-3 bg-[#fbf9f9] rounded-xl border border-[#ece8e8] space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-[#1b1c1c]">
                          <Sun className="w-3.5 h-3.5 text-[#b8860b]" />
                          <span>Afternoon</span>
                        </div>
                        <p className="text-[#524e4e] leading-relaxed">{day.afternoon}</p>
                      </div>

                      <div className="p-3 bg-[#fbf9f9] rounded-xl border border-[#ece8e8] space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-[#1b1c1c]">
                          <Moon className="w-3.5 h-3.5 text-[#b8860b]" />
                          <span>Evening</span>
                        </div>
                        <p className="text-[#524e4e] leading-relaxed">{day.evening}</p>
                      </div>

                    </div>

                    {day.restaurantSuggestion && (
                      <div className="pt-2 flex items-center space-x-2 text-xs text-[#8a7a58]">
                        <Utensils className="w-3.5 h-3.5" />
                        <span className="font-semibold">Dinner Reservation Recommendation:</span>
                        <span className="text-[#1b1c1c] font-bold">{day.restaurantSuggestion}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
