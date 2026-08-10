export type Role = 'USER' | 'HOST' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  loyaltyPoints: number;
  membership: 'Explorer' | 'Privé' | 'Black';
  preferences?: {
    currency: string;
    language: string;
    notifications: boolean;
  };
}

export type PropertyType = 'Villa' | 'Resort' | 'Hotel' | 'Private Estate' | 'Chalet' | 'Beach House' | 'Penthouse';

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  destination: string;
  images: string[];
  pricePerNight: number;
  propertyType: PropertyType;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  rating: number;
  reviewCount: number;
  host: {
    name: string;
    avatar: string;
    superhost: boolean;
    responseRate: string;
  };
  availability: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  locationDetails?: {
    address?: string;
    nearestAirport?: string;
    transferMethod?: string;
    neighborhood?: string;
    nearbyAttractions?: string[];
    privacyScore?: string;
    coordinatesDms?: string;
  };
  verified: boolean;
  priceHistory?: { month: string; price: number }[];
  priceDifferencePct?: number; // e.g. -12 for 12% below typical
  bookedCountThisWeek?: number;
  badge?: string; // e.g., "Exceptional", "Curator's Pick"
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string; // e.g. Coastal, Alpine, Island
  description: string;
  image: string;
  weather: {
    tempC: number;
    condition: string;
    humidity: number;
  };
  bestTime: string;
  currency: string;
  localInfo: string;
  propertiesCount: number;
  transferTag?: string;
  privacyScore?: string;
  highlights?: string[];
  galleryImages?: string[];
}

export interface SeasonalEscape {
  id: string;
  title: string;
  tagline: string;
  location: string;
  country: string;
  region: string;
  season: 'Autumn Harvest' | 'Winter Alpine' | 'Tropical Sun' | 'Spring Blossom';
  originalPrice: number;
  offerPrice: number;
  currency: string;
  unit: string;
  savingsTag: string;
  validUntil: string;
  remainingUnits: number;
  image: string;
  inclusions: string[];
  propertySlug?: string;
  destinationSlug?: string;
}

export interface Experience {
  id: string;
  title: string;
  slug: string;
  location: string;
  destination: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  category: 'Adventure' | 'Wellness' | 'Food' | 'Culture' | 'Nature' | 'Romance' | 'Luxury';
  rating: number;
  reviewCount: number;
  includes: string[];
  maxGroupSize: number;
}

export interface Booking {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  tax: number;
  serviceFee: number;
  discount: number;
  loyaltyDiscount: number;
  total: number;
  currency: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  bookingStatus: 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentId?: string;
  qrCodeUrl?: string;
  createdAt: string;
  transferDetails?: {
    type: string;
    price: number;
  };
}

export interface Review {
  id: string;
  propertyId: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  cleanliness: number;
  location: number;
  service: number;
  value: number;
  comment: string;
  photos?: string[];
  verifiedStay: boolean;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minSpend: number;
  description: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  restaurantSuggestion: string;
  estimatedCost: string;
}

export interface TripPlan {
  id?: string;
  title?: string;
  destination: string;
  dates: string;
  travelers: number;
  budget: string;
  interests: string[];
  days: ItineraryDay[];
  createdAt?: string;
}

export interface TravelJournal {
  id: string;
  title: string;
  destination: string;
  author: string;
  date: string;
  coverImage: string;
  photos: string[];
  story: string;
  likes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'BOOKING' | 'PRICE_DROP' | 'REMINDER' | 'PROMO';
}
