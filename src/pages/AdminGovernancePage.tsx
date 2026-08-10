import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Property, Booking } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Award, Users, DollarSign, Database, Tag } from 'lucide-react';

export const AdminGovernancePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { formatPrice } = useApp();

  useEffect(() => {
    apiService.getProperties().then(setProperties);
    apiService.getBookings().then(setBookings);
  }, []);

  const totalGMV = bookings.reduce((acc, b) => acc + b.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="border-b border-[#e6e2e2] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#fdf2f2] text-[#a33838] text-xs font-bold border border-[#f8e4e4]">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Executive Level Security</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1b1c1c]">
          Admin Governance & Audit Portal
        </h1>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-1 shadow-sm">
          <span className="text-xs font-bold text-[#7a7676] uppercase">Gross Platform GMV</span>
          <p className="font-serif font-bold text-3xl text-[#1b1c1c]">{formatPrice(totalGMV)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-1 shadow-sm">
          <span className="text-xs font-bold text-[#7a7676] uppercase">Registered Stays</span>
          <p className="font-serif font-bold text-3xl text-[#1b1c1c]">{properties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-1 shadow-sm">
          <span className="text-xs font-bold text-[#7a7676] uppercase">Active Bookings</span>
          <p className="font-serif font-bold text-3xl text-[#1b1c1c]">{bookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-1 shadow-sm">
          <span className="text-xs font-bold text-[#7a7676] uppercase">Privé Vouchers Issued</span>
          <p className="font-serif font-bold text-3xl text-[#b8860b]">3 Active</p>
        </div>
      </div>

      {/* Bookings Management Log */}
      <div className="bg-white rounded-3xl border border-[#e8e4e4] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#f0ecec] flex items-center justify-between">
          <h3 className="font-serif font-bold text-xl text-[#1b1c1c]">Platform Bookings & Verification Log</h3>
          <span className="text-xs font-bold text-[#8a7a58]">Live Server Store</span>
        </div>

        <div className="divide-y divide-[#f0ecec]">
          {bookings.map((b) => (
            <div key={b.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-mono font-bold text-[#b8860b]">{b.bookingId}</span>
                <p className="font-serif font-bold text-base text-[#1b1c1c]">{b.propertyTitle}</p>
                <p className="text-[#6a6666]">Guest: {b.userName} ({b.userEmail})</p>
              </div>

              <div className="text-right">
                <p className="font-serif font-bold text-base text-[#1b1c1c]">{formatPrice(b.total)}</p>
                <span className="px-2.5 py-0.5 rounded bg-[#f2ede4] text-[#8a7a58] font-bold uppercase text-[10px]">
                  {b.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
