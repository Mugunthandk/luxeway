import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Mail, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { user } = useApp();
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoined, setIsJoined] = useState(() => {
    return localStorage.getItem('luxeway_newsletter_joined') === 'true';
  });

  const handleJoinNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsJoined(true);
      localStorage.setItem('luxeway_newsletter_joined', 'true');
      localStorage.setItem('luxeway_newsletter_email', email);
    }, 600);
  };
  return (
    <footer className="bg-[#f2e9dc] text-[#1c1815] border-t border-[#ebd0b0] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-[#e2cca8]">
          
          {/* Column 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#1c1815] text-[#ffdea5] flex items-center justify-center font-serif text-xl font-bold shadow-md">
                L
              </div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-[#1c1815]">
                LuxeWay
              </span>
            </div>
            <p className="text-xs text-[#5c534a] leading-relaxed">
              Quiet luxury travel platform curated for private estates, jet charters, bespoke experiences, and 24/7 global concierge service.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-[#9e7208]">
              <ShieldCheck className="w-4 h-4 text-[#9e7208]" />
              <span className="font-bold">Verified Privé Portfolio & Guarantee</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#8a6314] tracking-wider uppercase mb-4">
              Explore Portfolio
            </h4>
            <ul className="space-y-2.5 text-xs text-[#4a443e]">
              <li><Link to="/stays" className="hover:text-[#1c1815] transition-colors">Private Villas & Estates</Link></li>
              <li><Link to="/destinations" className="hover:text-[#1c1815] transition-colors">Global Destinations</Link></li>
              <li><Link to="/experiences" className="hover:text-[#1c1815] transition-colors">Yacht & Jet Charters</Link></li>
              <li><Link to="/trip-planner" className="hover:text-[#1c1815] transition-colors">AI Itinerary Generator</Link></li>
              <li><Link to="/map-explorer" className="hover:text-[#1c1815] transition-colors">Interactive Map Explorer</Link></li>
            </ul>
          </div>

          {/* Column 3: Member Services */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#8a6314] tracking-wider uppercase mb-4">
              Privé Member Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#4a443e]">
              <li><Link to="/login" className="hover:text-[#1c1815] transition-colors">Member Sign In</Link></li>
              <li><Link to="/trips" className="hover:text-[#1c1815] transition-colors">My Journeys & Invoices</Link></li>
              <li><Link to="/wallet" className="hover:text-[#1c1815] transition-colors">Travel Wallet & QR Passes</Link></li>
              <li><Link to="/host" className="hover:text-[#1c1815] transition-colors">Host / Partner Portal</Link></li>
              <li><Link to="/journal" className="hover:text-[#1c1815] transition-colors">LuxeWay Travel Journal</Link></li>
            </ul>
          </div>

          {/* Column 4: Concierge Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#8a6314] tracking-wider uppercase">
              24/7 Global Concierge
            </h4>
            <div className="bg-white p-4 rounded-xl border border-[#ebd0b0] shadow-sm space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-[#4a443e]">
                <PhoneCall className="w-4 h-4 text-[#9e7208]" />
                <span className="font-semibold">+1 (800) 888-LUXE (Direct Desk)</span>
              </div>
              <div className="flex items-center space-x-2 text-[#4a443e]">
                <Mail className="w-4 h-4 text-[#9e7208]" />
                <span>concierge@luxeway.com</span>
              </div>
              <div className="flex items-center space-x-2 text-[#4a443e]">
                <MapPin className="w-4 h-4 text-[#9e7208]" />
                <span>Paris • St. Barts • Dubai • New York</span>
              </div>
            </div>

            <p className="text-[11px] text-[#6b6257]">
              Receive private off-market property alerts and seasonal invitations.
            </p>
            {isJoined ? (
              <div className="bg-[#1c1815] text-[#ffdea5] p-3 rounded-xl border border-[#b8860b]/40 flex items-center justify-between text-xs shadow-md">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <CheckCircle2 className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-white text-[11px]">Privé Membership Active</p>
                    <p className="text-[10px] text-[#ebd3a2] truncate">{email || 'Joined!'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsJoined(false)}
                  className="text-[10px] text-[#d4af37] underline hover:text-white ml-2 flex-shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <form onSubmit={handleJoinNewsletter} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address..."
                  required
                  className="px-3.5 py-2.5 bg-white text-xs text-[#1c1815] placeholder-[#8a8075] rounded-l-xl border border-[#ebd0b0] focus:outline-none focus:ring-1 focus:ring-[#8a6314] focus:border-[#8a6314] w-full shadow-xs"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#1c1815] text-[#ffdea5] font-bold text-xs rounded-r-xl hover:bg-[#2e2924] active:bg-[#0f0d0b] transition-all cursor-pointer flex items-center justify-center min-w-[70px] shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffdea5]" />
                  ) : (
                    'Join'
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright & disclosures */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#6b6257] space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} LuxeWay Inc. All Rights Reserved. Quiet Luxury Travel Systems.</p>
          <div className="flex space-x-6 text-[11px]">
            <a href="#" className="hover:text-[#1c1815] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1c1815] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1c1815] transition-colors">Cookie Preferences</a>
            <a href="#" className="hover:text-[#1c1815] transition-colors">Security Audit</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
