import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp, CurrencyCode, CURRENCY_RATES } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import { Sparkles, Heart, Bell, User, LogOut, ChevronDown, Compass, Shield, MapPin, Briefcase, Award, Wallet as WalletIcon, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    logout,
    currency,
    setCurrency,
    language,
    setLanguage,
    t,
    wishlistIds,
    compareList,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    setIsConciergeOpen,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#fcfaf6]/92 backdrop-blur-xl border-b border-[#ebdcc8] text-[#1c1815] transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full bg-[#1c1815] text-[#ffdea5] flex items-center justify-center font-serif text-xl font-bold shadow-md transition-transform group-hover:scale-105">
                L
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-semibold tracking-tight text-[#1c1815]">
                  LuxeWay
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#9e7208] font-bold">
                  Quiet Luxury Journeys
                </span>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#4a443e]">
              <Link
                to="/destinations"
                className={`transition-colors hover:text-[#1c1815] ${isCurrent('/destinations') ? 'text-[#1c1815] font-bold border-b-2 border-[#b8860b] pb-1' : ''}`}
              >
                {t('destinations')}
              </Link>
              <Link
                to="/stays"
                className={`transition-colors hover:text-[#1c1815] ${isCurrent('/stays') ? 'text-[#1c1815] font-bold border-b-2 border-[#b8860b] pb-1' : ''}`}
              >
                {t('stays')}
              </Link>
              <Link
                to="/experiences"
                className={`transition-colors hover:text-[#1c1815] ${isCurrent('/experiences') ? 'text-[#1c1815] font-bold border-b-2 border-[#b8860b] pb-1' : ''}`}
              >
                {t('experiences')}
              </Link>
              <Link
                to="/map-explorer"
                className={`flex items-center space-x-1 transition-colors hover:text-[#1c1815] ${isCurrent('/map-explorer') || isCurrent('/explore') ? 'text-[#1c1815] font-bold border-b-2 border-[#b8860b] pb-1' : ''}`}
              >
                <Compass className="w-4 h-4 text-[#9e7208]" />
                <span>{t('mapExplorer')}</span>
              </Link>
              <Link
                to="/trip-planner"
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#f2e8d8] text-[#8a6314] border border-[#e2d0b5] hover:bg-[#eadecc] transition-colors ${isCurrent('/trip-planner') ? 'ring-2 ring-[#b8860b]' : ''}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9e7208]" />
                <span className="text-xs font-bold">{t('aiPlanner')}</span>
              </Link>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-4">
            
            {/* AI Concierge Trigger */}
            <button
              onClick={() => setIsConciergeOpen(true)}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 rounded-full bg-[#1c1815] text-[#ffdea5] hover:bg-[#2e2924] transition-all shadow-md text-xs font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffdea5]" />
              <span>✨ {t('concierge')}</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => { setIsCurrencyOpen(!isCurrencyOpen); setIsLangOpen(false); }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#f8f3eb] hover:bg-[#ebdcc8]/70 border border-[#ebdcc8] text-xs font-bold text-[#1c1815] transition-colors shadow-xs"
              >
                <span className="text-[#8a6314] font-bold">{CURRENCY_RATES[currency]?.symbol}</span>
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-[#7a6f63]" />
              </button>
              {isCurrencyOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-[#ebdcc8] py-1.5 z-50 text-xs text-[#211e1b] max-h-64 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#9e7208] border-b border-[#f2e8d8] mb-1">
                    Select Currency
                  </div>
                  {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCurrency(c); setIsCurrencyOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#f8f3eb] transition-colors ${currency === c ? 'font-bold text-[#8a6314] bg-[#f8f3eb]' : 'text-[#3b352e]'}`}
                    >
                      <span>{CURRENCY_RATES[c].name}</span>
                      <span className="font-bold text-[#8a6314]">{c} ({CURRENCY_RATES[c].symbol})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => { setIsLangOpen(!isLangOpen); setIsCurrencyOpen(false); }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#f8f3eb] hover:bg-[#ebdcc8]/70 border border-[#ebdcc8] text-xs font-bold text-[#1c1815] transition-colors shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#8a6314]" />
                <span>{language}</span>
                <ChevronDown className="w-3 h-3 text-[#7a6f63]" />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-[#ebdcc8] py-1.5 z-50 text-xs text-[#211e1b] max-h-72 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#9e7208] border-b border-[#f2e8d8] mb-1">
                    Select Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#f8f3eb] transition-colors ${language === lang.code ? 'font-bold text-[#8a6314] bg-[#f8f3eb]' : 'text-[#3b352e]'}`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#8a8075]">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-[#ebdcc8]/50 transition-colors text-[#3b352e]"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#e11d48] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Compare Badge */}
            {compareList.length > 0 && (
              <Link
                to="/compare"
                className="px-2.5 py-1 rounded-full bg-[#1c1815] text-[#ffdea5] text-xs font-bold hover:bg-[#2f2924] transition-colors shadow"
              >
                Compare ({compareList.length})
              </Link>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-full hover:bg-[#ebdcc8]/50 transition-colors text-[#3b352e]"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#9e7208]" />
                )}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[#ebdcc8] p-4 z-50 text-[#1c1815]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#ebdcc8] mb-3">
                    <h4 className="font-serif font-semibold text-sm text-[#1c1815]">Privé Alerts</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f2e8d8] text-[#8a6314] font-bold uppercase">
                      {unreadNotificationsCount} Unread
                    </span>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${n.read ? 'bg-[#fcfaf6] opacity-70' : 'bg-[#f8f3eb] border-l-2 border-[#b8860b]'}`}
                      >
                        <p className="font-semibold text-[#1c1815]">{n.title}</p>
                        <p className="text-[#5c534a] mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-[#8a8075] mt-1 block">{n.date}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="block text-center text-xs font-semibold text-[#8a6314] hover:underline mt-3 pt-2 border-t border-[#ebdcc8]"
                  >
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-[#f2eded] transition-colors border border-[#e2dede]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1b1c1c] text-[#ffdea5] flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-[#1b1c1c] hidden sm:inline">
                    {user.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ebdcb9] text-[#5e4b1c] font-bold uppercase hidden md:inline">
                    {user.membership}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e6e2e2] py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-[#f0ecec]">
                      <p className="font-bold text-[#1b1c1c]">{user.name}</p>
                      <p className="text-[#7a7676] truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between bg-[#fbf9f5] p-2 rounded-md border border-[#eee8dc]">
                        <span className="text-[11px] text-[#7a6f56]">LuxePoints</span>
                        <span className="font-bold text-[#b8860b] text-xs">{user.loyaltyPoints} pts</span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-[#fbf9f9] text-[#3b3838]"
                    >
                      <User className="w-3.5 h-3.5 text-[#7a7676]" />
                      <span>Member Dashboard</span>
                    </Link>

                    <Link
                      to="/trips"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-[#fbf9f9] text-[#3b3838]"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-[#7a7676]" />
                      <span>My Bookings & Trips</span>
                    </Link>

                    <Link
                      to="/wallet"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-[#fbf9f9] text-[#3b3838]"
                    >
                      <WalletIcon className="w-3.5 h-3.5 text-[#7a7676]" />
                      <span>Travel Wallet & Passes</span>
                    </Link>

                    {user.role === 'HOST' || user.role === 'ADMIN' ? (
                      <Link
                        to="/host"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-[#fbf9f9] text-[#8a7a58] font-semibold"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Host Management Studio</span>
                      </Link>
                    ) : null}

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-[#fbf9f9] text-[#a33838] font-semibold"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Admin Governance Portal</span>
                      </Link>
                    )}

                    <div className="border-t border-[#f0ecec] mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 hover:bg-[#fbf9f9] text-[#a33838]"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-[#1b1c1c] text-[#ffdea5] text-xs font-semibold hover:bg-[#2e2d2d] transition-all"
              >
                Member Access
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
