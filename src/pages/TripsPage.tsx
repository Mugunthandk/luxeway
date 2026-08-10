import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../types';
import { apiService } from '../services/api';
import { useApp } from '../context/AppContext';
import { Briefcase, Calendar, QrCode, Download, ShieldCheck, XCircle } from 'lucide-react';

export const TripsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const { user, formatPrice } = useApp();

  useEffect(() => {
    apiService.getBookings(user?.id).then(setBookings);
  }, [user]);

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Are you sure you wish to request cancellation for this reservation?')) return;
    const res = await apiService.cancelBooking(id);
    setBookings(prev => prev.map(b => b.id === id ? res : b));
  };

  const filtered = bookings.filter(b => {
    if (activeTab === 'UPCOMING') return b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'ACTIVE';
    if (activeTab === 'COMPLETED') return b.bookingStatus === 'COMPLETED';
    return b.bookingStatus === 'CANCELLED';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-[#e6e2e2] pb-6 space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1b1c1c] flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-[#b8860b]" />
          <span>My Journeys & Reservations</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6a6666]">
          Manage active stays, download tax invoices, view chauffeur status, and access digital check-in passes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-[#f5f2ed] p-1.5 rounded-2xl w-fit">
        {[
          { id: 'UPCOMING', label: 'Active & Upcoming' },
          { id: 'COMPLETED', label: 'Past Journeys' },
          { id: 'CANCELLED', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-[#1b1c1c] shadow-sm'
                : 'text-[#6a6666] hover:text-[#1b1c1c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#e8e4e4] text-center space-y-4">
          <Briefcase className="w-10 h-10 text-[#8a7a58] mx-auto opacity-50" />
          <h3 className="font-serif font-bold text-2xl text-[#1b1c1c]">No {activeTab.toLowerCase()} journeys found</h3>
          <Link
            to="/stays"
            className="inline-block px-5 py-2.5 bg-[#1b1c1c] text-[#ffdea5] text-xs font-bold rounded-xl"
          >
            Explore Residences
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((b) => (
            <div key={b.id} className="bg-white p-6 rounded-3xl border border-[#e8e4e4] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex gap-4 items-center">
                <img src={b.propertyImage} alt={b.propertyTitle} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#b8860b]">{b.location}</span>
                  <h3 className="font-serif font-bold text-xl text-[#1b1c1c]">{b.propertyTitle}</h3>
                  <p className="text-xs text-[#6a6666]">
                    {b.checkIn} to {b.checkOut} ({b.nights} Nights • {b.guests} Guests)
                  </p>
                  <p className="text-xs font-mono font-bold text-[#1b1c1c]">ID: {b.bookingId}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full md:w-auto">
                <div className="text-right">
                  <span className="text-xs text-[#7a7676] block">Total Paid</span>
                  <span className="font-serif font-bold text-lg text-[#1b1c1c]">{formatPrice(b.total)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/wallet"
                    className="p-2.5 bg-[#f2ede4] text-[#8a7a58] rounded-xl hover:bg-[#eae3d2] text-xs font-bold flex items-center gap-1"
                    title="QR Pass"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Pass</span>
                  </Link>

                  <button
                    onClick={() => alert(`Tax invoice for ${b.bookingId} exported.`)}
                    className="p-2.5 bg-[#f5f2ed] text-[#1b1c1c] rounded-xl hover:bg-[#e8e4e4] text-xs font-bold"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {b.bookingStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="p-2.5 bg-[#fdf2f2] text-[#a33838] rounded-xl hover:bg-[#f8e4e4] text-xs font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
