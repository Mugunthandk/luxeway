import { Property, Destination, Experience, Booking, Review, Coupon, TripPlan, TravelJournal } from '../types';
import { SEED_DESTINATIONS, SEED_PROPERTIES, SEED_EXPERIENCES, SEED_JOURNALS } from '../data/seedData';

export const apiService = {
  // Destinations
  getDestinations: async (): Promise<Destination[]> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 200);
      const res = await fetch('/api/destinations', { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return await res.json();
    } catch (e) { /* use seed fallback */ }
    return SEED_DESTINATIONS;
  },

  getDestinationBySlug: async (slug: string): Promise<Destination | null> => {
    const local = SEED_DESTINATIONS.find(d => d.slug === slug || d.id === slug);
    if (local) {
      // Async background fetch refresh
      fetch(`/api/destinations/${slug}`).catch(() => null);
      return local;
    }
    try {
      const res = await fetch(`/api/destinations/${slug}`);
      if (res.ok) return await res.json();
    } catch (e) { /* ignore */ }
    return null;
  },

  // Properties
  getProperties: async (filters?: Record<string, any>): Promise<Property[]> => {
    let localResult = [...SEED_PROPERTIES];
    if (filters) {
      const { destination, search, minPrice, maxPrice, propertyType, guests, bedrooms } = filters;
      if (destination && destination !== 'All') {
        localResult = localResult.filter(p =>
          p.destination.toLowerCase().includes(String(destination).toLowerCase()) ||
          p.location.toLowerCase().includes(String(destination).toLowerCase())
        );
      }
      if (search) {
        const q = String(search).toLowerCase();
        localResult = localResult.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
        );
      }
      if (minPrice) localResult = localResult.filter(p => p.pricePerNight >= Number(minPrice));
      if (maxPrice) localResult = localResult.filter(p => p.pricePerNight <= Number(maxPrice));
      if (propertyType && propertyType !== 'All') localResult = localResult.filter(p => p.propertyType === propertyType);
      if (guests) localResult = localResult.filter(p => p.maxGuests >= Number(guests));
      if (bedrooms) localResult = localResult.filter(p => p.bedrooms >= Number(bedrooms));
    }

    try {
      const query = new URLSearchParams(filters || {}).toString();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 200);
      const res = await fetch(`/api/properties${query ? `?${query}` : ''}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return await res.json();
    } catch (e) { /* use localResult */ }
    return localResult;
  },

  getPropertyById: async (id: string): Promise<Property | null> => {
    const local = SEED_PROPERTIES.find(p => p.id === id || p.slug === id);
    if (local) {
      // Async background fetch
      fetch(`/api/properties/${id}`).catch(() => null);
      return local;
    }
    try {
      const res = await fetch(`/api/properties/${id}`);
      if (res.ok) return await res.json();
    } catch (e) { /* ignore */ }
    return null;
  },

  // Experiences
  getExperiences: async (): Promise<Experience[]> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 200);
      const res = await fetch('/api/experiences', { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return await res.json();
    } catch (e) { /* use fallback */ }
    return SEED_EXPERIENCES;
  },

  getExperienceById: async (id: string): Promise<Experience | null> => {
    const local = SEED_EXPERIENCES.find(e => e.id === id || e.slug === id);
    if (local) {
      fetch(`/api/experiences/${id}`).catch(() => null);
      return local;
    }
    try {
      const res = await fetch(`/api/experiences/${id}`);
      if (res.ok) return await res.json();
    } catch (e) { /* ignore */ }
    return null;
  },

  // Journals
  getJournals: async (): Promise<TravelJournal[]> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 200);
      const res = await fetch('/api/journals', { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return await res.json();
    } catch (e) { /* use fallback */ }
    return SEED_JOURNALS;
  },

  // Notifications
  getNotifications: async (): Promise<any[]> => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return [
      { id: '1', title: 'Chauffeur Confirmed', message: 'Maybach transfer assigned for Amalfi Coast arrival.', read: false, createdAt: '10 min ago' },
      { id: '2', title: 'Privé Price Drop Alert', message: 'Villa Azure reduced rate by $400/night for October dates.', read: false, createdAt: '1 hour ago' }
    ];
  },

  markNotificationRead: async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    } catch (e) { console.error(e); }
    return true;
  },

  // Bookings
  getBookings: async (userId?: string): Promise<Booking[]> => {
    try {
      const res = await fetch(`/api/bookings${userId ? `?userId=${userId}` : ''}`);
      if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return [];
  },

  getBookingById: async (id: string): Promise<Booking | null> => {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return null;
  },

  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) throw new Error('Failed to create booking');
      return await res.json();
    } catch (e) {
      console.error(e);
      return {
        id: `b-${Date.now()}`,
        bookingId: `LXW-${Math.floor(10000 + Math.random() * 90000)}`,
        propertyTitle: bookingData.propertyTitle || 'Luxe Estate',
        checkIn: bookingData.checkIn || '',
        checkOut: bookingData.checkOut || '',
        guests: bookingData.guests || 2,
        total: bookingData.total || 0,
        paymentStatus: 'PAID',
        bookingStatus: 'CONFIRMED',
        createdAt: new Date().toISOString().split('T')[0],
        ...bookingData
      } as Booking;
    }
  },

  verifyPayment: async (bookingId: string, paymentId: string) => {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, paymentId }),
      });
      if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return { success: true };
  },

  cancelBooking: async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: 'PATCH' });
      if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return { success: true };
  },

  // Coupons
  validateCoupon: async (code: string, amount: number) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount }),
      });
      if (res.ok) return await res.json();
      const errData = await res.json().catch(() => ({ error: 'Invalid coupon' }));
      return { valid: false, error: errData.error || 'Invalid coupon' };
    } catch (e) {
      return { valid: false, error: 'Coupon validation failed' };
    }
  },

  // AI Capabilities
  aiSearch: async (prompt: string) => {
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return { extracted: { summary: "Search processed for " + prompt } };
  },

  aiChat: async (message: string, history?: any[]) => {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });
      if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return { reply: "LuxeWay Concierge is ready to assist with your journey." };
  },

  aiGenerateItinerary: async (data: { destination: string; daysCount: number; travelers: number; budget: string; interests: string[] }): Promise<TripPlan> => {
    try {
      const res = await fetch('/api/ai/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return {
      id: `plan-${Date.now()}`,
      title: `Bespoke ${data.daysCount}-Day ${data.destination} Itinerary`,
      destination: data.destination,
      dates: `${data.daysCount} Days`,
      travelers: data.travelers,
      budget: data.budget,
      interests: data.interests || [],
      createdAt: new Date().toISOString(),
      days: Array.from({ length: Number(data.daysCount) }).map((_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: ${i === 0 ? 'Arrival & Sunset Champagne' : i === 1 ? 'Private Charter Experience' : 'Gourmet Gastronomy'}`,
        morning: "Private chauffeur transfer & luxury welcome.",
        afternoon: "Exclusive coastal or alpine charter activity.",
        evening: "Michelin tasting dinner with sommelier pairing.",
        restaurantSuggestion: "Chef's Table Reserve",
        estimatedCost: "$2,000 - $4,500"
      }))
    };
  },

  aiGetPropertyRecommendations: async (propertyId: string, userPreferences?: any) => {
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, userPreferences }),
      });
      if (res.ok) return await res.json();
    } catch (e) { console.error(e); }
    return { matchScore: 95, reasons: ["Privé verified sanctuary", "Includes 24/7 dedicated butler service"] };
  }
};
