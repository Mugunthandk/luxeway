import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { SEED_DESTINATIONS, SEED_PROPERTIES, SEED_EXPERIENCES, SEED_COUPONS, SEED_JOURNALS, SEED_REVIEWS } from "./src/data/seedData.js";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// In-memory persistent database store (with initial seed data)
let destinations = [...SEED_DESTINATIONS];
let properties = [...SEED_PROPERTIES];
let experiences = [...SEED_EXPERIENCES];
let coupons = [...SEED_COUPONS];
let journals = [...SEED_JOURNALS];
let reviews = [...SEED_REVIEWS];
let bookings: any[] = [
  {
    id: 'b-101',
    bookingId: 'LXW-98214',
    userId: 'u-1',
    userName: 'Mugunthan DK',
    userEmail: 'mugunthandk@gmail.com',
    propertyId: 'prop-5',
    propertyTitle: 'Villa Azure',
    propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    location: 'Amalfi Coast, Italy',
    checkIn: '2026-10-12',
    checkOut: '2026-10-18',
    guests: 2,
    nights: 6,
    pricePerNight: 2500,
    subtotal: 15000,
    tax: 1850,
    serviceFee: 500,
    discount: 0,
    loyaltyDiscount: 0,
    total: 17350,
    currency: 'USD',
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
    paymentId: 'pay_lxw_98214',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LXW-98214-CONFIRMED',
    createdAt: '2026-08-01',
  }
];
let wishlists: Record<string, string[]> = {
  'u-1': ['prop-1', 'prop-5']
};
let notifications: any[] = [
  { id: '1', title: 'Chauffeur Confirmed', message: 'Maybach transfer assigned for Amalfi Coast arrival.', read: false, createdAt: '10 min ago' },
  { id: '2', title: 'Privé Price Drop Alert', message: 'Villa Azure reduced rate by $400/night for October dates.', read: false, createdAt: '1 hour ago' }
];

// Initialize Gemini AI Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// --- REST API ENDPOINTS ---

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Authentication Routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  // Demo login handler
  if (email === "admin@luxeway.com") {
    return res.json({
      user: {
        id: "admin-1",
        name: "LuxeWay Admin",
        email: "admin@luxeway.com",
        role: "ADMIN",
        loyaltyPoints: 12500,
        membership: "Black"
      },
      token: "demo-admin-jwt-token"
    });
  }
  if (email === "host@luxeway.com") {
    return res.json({
      user: {
        id: "host-1",
        name: "Jean-Luc Laurent",
        email: "host@luxeway.com",
        role: "HOST",
        loyaltyPoints: 4500,
        membership: "Privé"
      },
      token: "demo-host-jwt-token"
    });
  }
  res.json({
    user: {
      id: "u-1",
      name: email ? email.split("@")[0] : "Discerning Guest",
      email: email || "guest@luxeway.com",
      role: "USER",
      loyaltyPoints: 3200,
      membership: "Privé"
    },
    token: "demo-user-jwt-token"
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, phone } = req.body;
  res.json({
    user: {
      id: `u-${Date.now()}`,
      name: name || "Luxe Guest",
      email: email || "guest@luxeway.com",
      phone: phone || "",
      role: "USER",
      loyaltyPoints: 500,
      membership: "Explorer"
    },
    token: "demo-jwt-token"
  });
});

// Destinations
app.get("/api/destinations", (req, res) => {
  res.json(destinations);
});

app.get("/api/destinations/:slug", (req, res) => {
  const dest = destinations.find(d => d.slug === req.params.slug || d.id === req.params.slug);
  if (!dest) return res.status(404).json({ error: "Destination not found" });
  res.json(dest);
});

// Journals
app.get("/api/journals", (req, res) => {
  res.json(journals);
});

// Properties
app.get("/api/properties", (req, res) => {
  let result = [...properties];
  const { destination, search, minPrice, maxPrice, propertyType, guests, bedrooms } = req.query;

  if (destination) {
    result = result.filter(p => p.destination.toLowerCase().includes(String(destination).toLowerCase()) || p.location.toLowerCase().includes(String(destination).toLowerCase()));
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
  }
  if (minPrice) {
    result = result.filter(p => p.pricePerNight >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter(p => p.pricePerNight <= Number(maxPrice));
  }
  if (propertyType && propertyType !== 'All') {
    result = result.filter(p => p.propertyType === propertyType);
  }
  if (guests) {
    result = result.filter(p => p.maxGuests >= Number(guests));
  }
  if (bedrooms) {
    result = result.filter(p => p.bedrooms >= Number(bedrooms));
  }

  res.json(result);
});

app.get("/api/properties/:id", (req, res) => {
  const prop = properties.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!prop) return res.status(404).json({ error: "Property not found" });
  res.json(prop);
});

app.post("/api/properties", (req, res) => {
  const newProp = {
    id: `prop-${Date.now()}`,
    ...req.body,
    rating: 5.0,
    reviewCount: 0,
    verified: true,
    priceHistory: [
      { month: 'Jan', price: req.body.pricePerNight || 3000 },
      { month: 'Feb', price: req.body.pricePerNight || 3000 }
    ]
  };
  properties.push(newProp);
  res.status(201).json(newProp);
});

app.put("/api/properties/:id", (req, res) => {
  const idx = properties.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Property not found" });
  properties[idx] = { ...properties[idx], ...req.body };
  res.json(properties[idx]);
});

app.delete("/api/properties/:id", (req, res) => {
  properties = properties.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

// Experiences
app.get("/api/experiences", (req, res) => {
  res.json(experiences);
});

app.get("/api/experiences/:id", (req, res) => {
  const exp = experiences.find(e => e.id === req.params.id || e.slug === req.params.id);
  if (!exp) return res.status(404).json({ error: "Experience not found" });
  res.json(exp);
});

// Bookings
app.get("/api/bookings", (req, res) => {
  const { userId } = req.query;
  if (userId) {
    return res.json(bookings.filter(b => b.userId === userId));
  }
  res.json(bookings);
});

app.get("/api/bookings/:id", (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id || b.bookingId === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
});

app.post("/api/bookings", (req, res) => {
  const data = req.body;
  const bookingId = `LXW-${Math.floor(10000 + Math.random() * 90000)}`;
  const newBooking = {
    id: `b-${Date.now()}`,
    bookingId,
    paymentStatus: data.paymentStatus || 'PENDING',
    bookingStatus: 'CONFIRMED',
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}-CONFIRMED`,
    createdAt: new Date().toISOString().split('T')[0],
    ...data
  };
  bookings.unshift(newBooking);
  res.status(201).json(newBooking);
});

app.patch("/api/bookings/:id/cancel", (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id || b.bookingId === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  booking.bookingStatus = 'CANCELLED';
  res.json(booking);
});

// Payment Verification Route (Simulated Razorpay / Stripe Backend Verification)
app.post("/api/payments/verify", (req, res) => {
  const { bookingId, paymentId } = req.body;
  const booking = bookings.find(b => b.id === bookingId || b.bookingId === bookingId);
  if (booking) {
    booking.paymentStatus = 'PAID';
    booking.bookingStatus = 'CONFIRMED';
    booking.paymentId = paymentId || `pay_lxw_${Date.now()}`;
    return res.json({ success: true, booking });
  }
  res.status(400).json({ error: "Booking not found for payment verification" });
});

// Wishlist
app.get("/api/wishlist", (req, res) => {
  const userId = (req.query.userId as string) || 'u-1';
  const propertyIds = wishlists[userId] || [];
  const wishlistedProps = properties.filter(p => propertyIds.includes(p.id));
  res.json(wishlistedProps);
});

app.post("/api/wishlist", (req, res) => {
  const { userId = 'u-1', propertyId } = req.body;
  if (!wishlists[userId]) wishlists[userId] = [];
  if (!wishlists[userId].includes(propertyId)) {
    wishlists[userId].push(propertyId);
  } else {
    wishlists[userId] = wishlists[userId].filter(id => id !== propertyId);
  }
  res.json({ wishlist: wishlists[userId] });
});

// Coupons
app.post("/api/coupons/validate", (req, res) => {
  const { code, amount } = req.body;
  const coupon = coupons.find(c => c.code.toUpperCase() === String(code).toUpperCase());
  if (!coupon) return res.status(400).json({ error: "Invalid promotional code" });
  if (amount && amount < coupon.minSpend) {
    return res.status(400).json({ error: `Minimum spend of $${coupon.minSpend} required for code ${coupon.code}` });
  }
  const calculatedDiscount = Math.min((amount * coupon.discountPercent) / 100, coupon.maxDiscount);
  res.json({ valid: true, coupon, discountAmount: calculatedDiscount });
});

// Reviews
app.get("/api/properties/:id/reviews", (req, res) => {
  const propRevs = reviews.filter(r => r.propertyId === req.params.id);
  res.json(propRevs);
});

app.post("/api/reviews", (req, res) => {
  const newRev = {
    id: `rev-${Date.now()}`,
    verifiedStay: true,
    createdAt: new Date().toISOString().split('T')[0],
    ...req.body
  };
  reviews.unshift(newRev);
  res.status(201).json(newRev);
});

// Notifications
app.get("/api/notifications", (req, res) => {
  res.json(notifications);
});

app.post("/api/notifications/:id/read", (req, res) => {
  const notif = notifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

// --- AI ENDPOINTS USING GEMINI SDK (@google/genai) ---

// AI Natural Language Search
app.post("/api/ai/search", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const ai = getGeminiClient();
  const fallbackExtracted = {
    destination: prompt.toLowerCase().includes("amalfi") ? "Amalfi Coast" : prompt.toLowerCase().includes("barts") ? "St. Barts" : "",
    propertyType: prompt.toLowerCase().includes("villa") ? "Villa" : "Resort",
    guests: 2,
    maxBudget: 10000,
    amenities: ["Private Pool", "Ocean View"],
    summary: `Extracted criteria for: ${prompt}`
  };

  if (!ai) {
    return res.json({ extracted: fallbackExtracted });
  }

  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-3.6-flash"];
  let parsed = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `Extract travel search filters from this user request: "${prompt}".
Available destinations: Amalfi Coast, St. Barts, Zermatt, Maldives, Bali, Santorini, Paris, Dubai, Kyoto, Seychelles.
Available propertyTypes: Villa, Resort, Hotel, Private Estate, Chalet, Beach House, Penthouse.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING, description: "Name of destination if matched or empty string" },
              propertyType: { type: Type.STRING, description: "Type of property if specified" },
              guests: { type: Type.NUMBER, description: "Number of guests" },
              maxBudget: { type: Type.NUMBER, description: "Max budget per night in USD" },
              amenities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Extracted amenities like Beach Access, Private Pool, Butler, Private Chef"
              },
              summary: { type: Type.STRING, description: "Short summary of extracted criteria" }
            }
          }
        }
      });

      if (response.text) {
        parsed = JSON.parse(response.text);
        break;
      }
    } catch (err) {
      console.warn(`Gemini Search Warning (${model}):`, err);
    }
  }

  res.json({ extracted: parsed || fallbackExtracted });
});

// AI Travel Concierge Chat
app.post("/api/ai/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const ai = getGeminiClient();
  const fallbackReply = "Welcome to LuxeWay Concierge. Our direct desk is active 24/7 to orchestrate your private jet charters, villa reservations, and bespoke dining in Amalfi, St. Barts, and beyond.";

  if (!ai) {
    return res.json({ reply: fallbackReply });
  }

  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-3.6-flash"];
  const systemInstruction = `You are LuxeWay AI Concierge, an elite luxury travel advisor for high-net-worth clients.
Tone: Sophisticated, discrete, warm, helpful, polished.
Knowledge base context:
- Destinations: Amalfi Coast, St. Barts, Zermatt, Maldives, Bali, Santorini, Paris, Dubai, Kyoto, Seychelles.
- LuxeWay Stays: Villa Neo, Eden Rock Estate, Villa Azure, Soneva Secret Overwater Villa, Chalet Zermatt Peak, Uluwatu Clifftop Sanctuary.
- Offerings: Private jet aviation charters, Michelin villa dining, helicopter glacier picnics, bespoke luxury itineraries, 24/7 butler service.
Keep recommendations elegant, clear, and tailored to quiet luxury.`;

  for (const model of modelsToTry) {
    try {
      const chat = ai.chats.create({
        model,
        config: { systemInstruction }
      });

      const response = await chat.sendMessage({ message });
      if (response.text) {
        return res.json({ reply: response.text });
      }
    } catch (err) {
      console.warn(`Gemini Concierge Chat Warning (${model}):`, err);
    }
  }

  res.json({ reply: fallbackReply });
});

// AI Trip Planner (Custom Multi-Day Itinerary)
app.post("/api/ai/itinerary", async (req, res) => {
  const { destination, daysCount = 3, travelers = 2, budget = "Luxury", interests = [] } = req.body;

  const fallbackItinerary = {
    title: `Bespoke ${daysCount}-Day ${destination} Escape`,
    summary: `An exclusive ${daysCount}-day luxury journey through ${destination} tailored for ${travelers} travelers.`,
    days: Array.from({ length: Number(daysCount) }).map((_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${i === 0 ? 'Private Arrival & Sunset Champagne' : i === 1 ? 'Charter Exploration & Secluded Bays' : 'Gourmet Gastronomy & Sunset Lounge'}`,
      morning: "Private Maybach chauffeur transfer, villa check-in, and welcome vintage Krug champagne service.",
      afternoon: "Guided private yacht charter access to hidden sea coves and private beach lunch.",
      evening: "Oceanfront Michelin-starred tasting menu with sommelier reserve wine pairing.",
      restaurantSuggestion: "Ristorante Da Paolino or Le Ti St Barth",
      estimatedCost: "$1,800 - $3,500"
    }))
  };

  const ai = getGeminiClient();
  if (!ai) {
    return res.json(fallbackItinerary);
  }

  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-3.6-flash"];
  const prompt = `Create a bespoke luxury ${daysCount}-day itinerary for ${travelers} travelers visiting ${destination}.
Budget style: ${budget}. Interests: ${interests.join(", ")}.`;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    morning: { type: Type.STRING },
                    afternoon: { type: Type.STRING },
                    evening: { type: Type.STRING },
                    restaurantSuggestion: { type: Type.STRING },
                    estimatedCost: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      if (response.text) {
        const itinerary = JSON.parse(response.text);
        return res.json(itinerary);
      }
    } catch (err: any) {
      console.warn(`Gemini Itinerary Warning (${model}):`, err?.message || err);
    }
  }

  res.json(fallbackItinerary);
});

// AI Match Recommendation Score
app.post("/api/ai/recommendations", async (req, res) => {
  const { propertyId, userPreferences } = req.body;
  const prop = properties.find(p => p.id === propertyId);
  if (!prop) return res.status(404).json({ error: "Property not found" });

  const fallbackMatch = {
    matchScore: 96,
    reasons: [
      "Matches your preference for secluded beach access",
      "Includes 24/7 dedicated butler & private chef",
      "Rated 4.98+ by verified luxury travelers",
      "Priced within your estimated luxury tier"
    ]
  };

  const ai = getGeminiClient();
  if (!ai) {
    return res.json(fallbackMatch);
  }

  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-3.6-flash"];
  const prompt = `Analyze this property: ${JSON.stringify(prop)} against guest preferences: ${JSON.stringify(userPreferences || { preference: "Quiet luxury, beach access, private pool, high rating" })}.
Calculate a match percentage (0-100) and list 4 bullet reasons why this property is a fit.`;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: { type: Type.NUMBER },
              reasons: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        return res.json(result);
      }
    } catch (err) {
      console.warn(`Gemini Recommendations Warning (${model}):`, err);
    }
  }

  res.json(fallbackMatch);
});

// Fallback 404 JSON handler for unhandled API routes (prevents returning SPA HTML index)
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found` });
});

// Vite Middleware & Static Server Configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LuxeWay Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
