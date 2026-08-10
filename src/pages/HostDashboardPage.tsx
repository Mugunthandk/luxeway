import React, { useState, useEffect } from 'react';
import { Property, Booking } from '../types';
import { apiService } from '../services/api';
import { useApp } from '../context/AppContext';
import { Building, Plus, DollarSign, Calendar, ShieldCheck, CheckCircle, TrendingUp } from 'lucide-react';

export const HostDashboardPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Property Form
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('St. Barts');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(5000);
  const [bedrooms, setBedrooms] = useState(4);
  const [propertyType, setPropertyType] = useState<any>('Villa');

  const { formatPrice } = useApp();

  useEffect(() => {
    apiService.getProperties().then(setProperties);
    apiService.getBookings().then(setBookings);
  }, []);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProp = {
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      description: 'Exclusive private residence curated with full resident staff, ocean views, and infinity pool.',
      location: location || `${destination}, F.W.I.`,
      destination,
      images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'],
      pricePerNight: price,
      propertyType,
      amenities: ['Private Pool', 'Beach Access', 'Butler', 'Private Chef'],
      bedrooms,
      bathrooms: bedrooms + 1,
      maxGuests: bedrooms * 2,
      rating: 5.0,
      reviewCount: 0,
      host: {
        name: 'Jean-Luc Laurent',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        superhost: true,
        responseRate: '100% within 30 min'
      },
      availability: true,
      coordinates: { lat: 17.9012, lng: -62.8351 },
      verified: true
    };

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProp)
      });
      if (res.ok) {
        const data = await res.json();
        setProperties(prev => [data, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
    setIsAddOpen(false);
    setTitle('');
  };

  const totalRevenue = bookings.reduce((acc, b) => acc + b.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e6e2e2] pb-6">
        <div>
          <span className="text-xs font-bold text-[#b8860b] uppercase tracking-widest block">
            Privé Partner Studio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1b1c1c]">
            Host Management Studio
          </h1>
        </div>

        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="px-5 py-2.5 bg-[#1b1c1c] text-[#ffdea5] font-bold text-xs rounded-xl hover:bg-[#2e2d2d] flex items-center gap-2 cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Residence</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-1 shadow-sm">
          <span className="text-xs font-bold text-[#7a7676] uppercase">Total Portfolio Revenue</span>
          <p className="font-serif font-bold text-3xl text-[#1b1c1c]">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-1 shadow-sm">
          <span className="text-xs font-bold text-[#7a7676] uppercase">Active Residences</span>
          <p className="font-serif font-bold text-3xl text-[#1b1c1c]">{properties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-1 shadow-sm">
          <span className="text-xs font-bold text-[#7a7676] uppercase">Total Bookings</span>
          <p className="font-serif font-bold text-3xl text-[#1b1c1c]">{bookings.length}</p>
        </div>
      </div>

      {/* Add Residence Form */}
      {isAddOpen && (
        <form onSubmit={handleCreateProperty} className="bg-[#f5f2ed] p-6 rounded-3xl border border-[#e2dccf] space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1b1c1c]">Register New Residence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#4a4646]">Residence Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Villa Sapphire"
                className="w-full p-2.5 bg-white border border-[#e2dede] rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4a4646]">Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#e2dede] rounded-xl text-xs"
              >
                <option value="St. Barts">St. Barts</option>
                <option value="Amalfi Coast">Amalfi Coast</option>
                <option value="Zermatt">Zermatt</option>
                <option value="Maldives">Maldives</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#4a4646]">Price Per Night (Base USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-[#e2dede] rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4a4646]">Bedrooms</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-[#e2dede] rounded-xl text-xs"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1b1c1c] text-[#ffdea5] font-bold text-xs rounded-xl hover:bg-[#2e2d2d]"
          >
            Submit for Privé Audit
          </button>
        </form>
      )}

      {/* Property Portfolio Table */}
      <div className="bg-white rounded-3xl border border-[#e8e4e4] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#f0ecec]">
          <h3 className="font-serif font-bold text-xl text-[#1b1c1c]">Managed Portfolio</h3>
        </div>
        <div className="divide-y divide-[#f0ecec]">
          {properties.map((p) => (
            <div key={p.id} className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img src={p.images[0]} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1b1c1c]">{p.title}</h4>
                  <p className="text-xs text-[#6a6666]">{p.location} • {p.bedrooms} Beds</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif font-bold text-base text-[#1b1c1c]">{formatPrice(p.pricePerNight)} / night</p>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#f2ede4] text-[#8a7a58] font-bold">
                  Privé Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
