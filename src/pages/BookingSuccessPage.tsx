import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Booking } from '../types';
import { apiService } from '../services/api';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Download, Calendar, MapPin, QrCode, ArrowRight, ShieldCheck, PhoneCall, Star, Sparkles } from 'lucide-react';

export const BookingSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const { formatPrice } = useApp();

  useEffect(() => {
    if (id) {
      apiService.getBookingById(id).then((b) => {
        setBooking(b);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !booking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#1b1c1c] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-serif font-bold text-[#1b1c1c]">Verifying Transaction Pass...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fadeIn">
      
      {/* Top Banner with Star Celebration Theme */}
      <div className="relative bg-gradient-to-br from-[#12182b] via-[#1a233f] to-[#0f1424] text-white p-8 sm:p-12 rounded-3xl text-center space-y-5 border border-[#ffdea5]/30 shadow-2xl overflow-hidden">
        
        {/* Floating Twinkling Stars */}
        <div className="absolute top-4 left-6 text-[#ffdea5]/80 animate-star-pulse">
          <Star className="w-6 h-6 fill-[#ffdea5]" />
        </div>
        <div className="absolute top-6 right-8 text-[#ffdea5]/90 animate-star-pulse" style={{ animationDelay: '0.6s' }}>
          <Sparkles className="w-8 h-8 text-[#ffdea5]" />
        </div>
        <div className="absolute bottom-4 left-10 text-[#ffdea5]/70 animate-star-pulse" style={{ animationDelay: '1.2s' }}>
          <Sparkles className="w-7 h-7 text-[#ffdea5]" />
        </div>
        <div className="absolute bottom-6 right-12 text-[#ffdea5]/80 animate-star-pulse" style={{ animationDelay: '1.8s' }}>
          <Star className="w-5 h-5 fill-[#ffdea5]" />
        </div>

        {/* Central Star Badge */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#ffdea5] animate-ring-expand opacity-75" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9e7208] via-[#e2c077] to-[#ffdea5] text-[#141a32] flex items-center justify-center font-bold shadow-xl">
            <Star className="w-9 h-9 fill-[#141a32] text-[#141a32]" />
          </div>
        </div>

        {/* 5 Stars Rating Bar */}
        <div className="flex justify-center items-center space-x-1 text-[#ffdea5]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#ffdea5] text-[#ffdea5]" />
          ))}
        </div>

        <div>
          <span className="text-xs font-bold text-[#ffdea5] uppercase tracking-widest block mb-1">
            ★ ★ ★ ★ ★ PAYMENT SUCCESSFUL & RESERVATION CONFIRMED
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Sanctuary Confirmed, {booking.userName}
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-[#cbd1e6] max-w-lg mx-auto">
          Your reservation pass <span className="font-mono font-bold text-[#ffdea5]">{booking.bookingId}</span> has been issued and linked to your digital wallet.
        </p>

        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => alert(`Official PDF Invoice for ${booking.bookingId} downloaded.`)}
            className="px-5 py-2.5 bg-[#ffdea5] text-[#141a32] font-bold text-xs rounded-xl hover:bg-[#ffe7be] transition-colors flex items-center gap-2 cursor-pointer shadow"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice PDF</span>
          </button>
          <Link
            to="/wallet"
            className="px-5 py-2.5 bg-[#1c2445] text-white font-semibold text-xs border border-[#3b477a] rounded-xl hover:bg-[#283461] transition-colors flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>View Digital Boarding Pass</span>
          </Link>
        </div>
      </div>


      {/* Booking Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8e4e4] shadow-md grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#8a7a58] uppercase tracking-wider">{booking.location}</span>
            <h3 className="font-serif font-bold text-2xl text-[#1b1c1c]">{booking.propertyTitle}</h3>
          </div>

          <div className="space-y-2 text-xs text-[#524e4e]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#b8860b]" />
              <span>Check-In: <strong>{booking.checkIn}</strong> • Check-Out: <strong>{booking.checkOut}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#b8860b]" />
              <span>Total Stay: <strong>{booking.nights} Nights</strong> for <strong>{booking.guests} Guests</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#b8860b]" />
              <span>24/7 Dedicated Resident Butler Assigned</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#f0ecec]">
            <span className="text-xs text-[#7a7676]">Paid Total</span>
            <p className="font-serif font-bold text-2xl text-[#1b1c1c]">{formatPrice(booking.total)}</p>
          </div>
        </div>

        {/* QR Pass Box */}
        <div className="bg-[#fbf9f5] p-6 rounded-2xl border border-[#eee8dc] text-center space-y-3">
          <p className="font-serif font-bold text-sm text-[#1b1c1c]">Privé Keyless Check-In QR</p>
          <img
            src={booking.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${booking.bookingId}`}
            alt="Checkin QR"
            className="w-36 h-36 mx-auto rounded-xl border border-[#dcd3c1] p-2 bg-white"
          />
          <p className="text-[10px] text-[#7a6f56]">Present to your chauffeur or resident butler upon arrival.</p>
        </div>

      </div>

    </div>
  );
};
