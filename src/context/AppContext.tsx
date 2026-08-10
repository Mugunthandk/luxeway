import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Property, NotificationItem } from '../types';
import { getTranslation, LanguageCode } from '../utils/translations';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'JPY' | 'CAD' | 'AUD' | 'SGD' | 'CHF';

export const CURRENCY_RATES: Record<CurrencyCode, { rate: number; symbol: string; prefix: boolean; name: string }> = {
  INR: { rate: 83.5, symbol: '₹', prefix: true, name: 'Indian Rupee' },
  USD: { rate: 1.0, symbol: '$', prefix: true, name: 'US Dollar' },
  EUR: { rate: 0.92, symbol: '€', prefix: true, name: 'Euro' },
  GBP: { rate: 0.79, symbol: '£', prefix: true, name: 'British Pound' },
  AED: { rate: 3.67, symbol: 'AED ', prefix: true, name: 'UAE Dirham' },
  JPY: { rate: 155.0, symbol: '¥', prefix: true, name: 'Japanese Yen' },
  CAD: { rate: 1.36, symbol: 'C$', prefix: true, name: 'Canadian Dollar' },
  AUD: { rate: 1.52, symbol: 'A$', prefix: true, name: 'Australian Dollar' },
  SGD: { rate: 1.35, symbol: 'S$', prefix: true, name: 'Singapore Dollar' },
  CHF: { rate: 0.90, symbol: 'CHF ', prefix: true, name: 'Swiss Franc' },
};

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  wishlistIds: string[];
  toggleWishlist: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;
  compareList: Property[];
  toggleCompare: (property: Property) => void;
  isInCompare: (propertyId: string) => boolean;
  clearCompare: () => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  unreadNotificationsCount: number;
  isConciergeOpen: boolean;
  setIsConciergeOpen: (open: boolean) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('luxeway_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      id: 'u-1',
      name: 'Mugunthan DK',
      email: 'mugunthandk@gmail.com',
      role: 'USER',
      loyaltyPoints: 3450,
      membership: 'Privé',
    };
  });

  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('luxeway_currency');
    return (saved as CurrencyCode) || 'INR';
  });

  const [language, setLanguage] = useState<string>(() => {
    const saved = localStorage.getItem('luxeway_language');
    return saved || 'EN';
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('luxeway_wishlist');
    return saved ? JSON.parse(saved) : ['prop-1', 'prop-5'];
  });

  const [compareList, setCompareList] = useState<Property[]>([]);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Booking Confirmed!',
      message: 'Your stay at Villa Azure, Amalfi Coast is confirmed for Oct 12 - Oct 18.',
      date: '2 hours ago',
      read: false,
      type: 'BOOKING',
    },
    {
      id: 'n-2',
      title: 'Privé Price Drop Alert',
      message: 'Villa Neo in St. Barts is now 10% below typical seasonal rates.',
      date: '1 day ago',
      read: false,
      type: 'PRICE_DROP',
    },
    {
      id: 'n-3',
      title: 'Complimentary Jet Upgrade',
      message: 'You have earned 500 bonus LuxePoints from your last journey.',
      date: '3 days ago',
      read: true,
      type: 'PROMO',
    }
  ]);

  useEffect(() => {
    localStorage.setItem('luxeway_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('luxeway_language', language);
  }, [language]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('luxeway_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('luxeway_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('luxeway_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const logout = () => {
    setUser(null);
  };

  const formatPrice = (amountInUSD: number): string => {
    const info = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
    const converted = amountInUSD * info.rate;
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    const formattedNum = Math.round(converted).toLocaleString(locale);
    return `${info.symbol}${formattedNum}`;
  };

  const t = (key: string) => getTranslation(language, key);

  const toggleWishlist = (propertyId: string) => {
    setWishlistIds(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const isInWishlist = (propertyId: string) => wishlistIds.includes(propertyId);

  const toggleCompare = (property: Property) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.id === property.id);
      if (exists) return prev.filter(p => p.id !== property.id);
      if (prev.length >= 4) return prev; // max 4 items
      return [...prev, property];
    });
  };

  const isInCompare = (propertyId: string) => compareList.some(p => p.id === propertyId);

  const clearCompare = () => setCompareList([]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currency,
        setCurrency,
        formatPrice,
        language,
        setLanguage,
        t,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        compareList,
        toggleCompare,
        isInCompare,
        clearCompare,
        notifications,
        markNotificationRead,
        unreadNotificationsCount,
        isConciergeOpen,
        setIsConciergeOpen,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

