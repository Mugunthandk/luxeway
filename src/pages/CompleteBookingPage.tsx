import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Property, Booking } from '../types';
import { apiService } from '../services/api';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Tag, CreditCard, Lock, CheckCircle2, AlertCircle, ArrowLeft, Building2, QrCode, Star, Sparkles, Zap, Check } from 'lucide-react';

export const CompleteBookingPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user, formatPrice } = useApp();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Form Inputs
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [specialRequests, setSpecialRequests] = useState('');

  // Dates & Guests
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '2026-10-12');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '2026-10-18');
  const [guestsCount, setGuestsCount] = useState(Number(searchParams.get('guests')) || 2);

  // Transfer add-on
  const [includeTransfer, setIncludeTransfer] = useState(true);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr' | 'wire' | 'crypto'>('qr');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Star Celebration Modal State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStarCelebration, setShowStarCelebration] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);


  useEffect(() => {
    if (propertyId) {
      apiService.getPropertyById(propertyId).then((p) => {
        setProperty(p);
        setLoading(false);
      });
    }
  }, [propertyId]);

  if (loading || !property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#1b1c1c] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-serif font-bold text-[#1b1c1c]">Initializing Privé Checkout Protocol...</p>
      </div>
    );
  }

  // Calculate Pricing
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  
  const subtotal = property.pricePerNight * nights;
  const transferFee = includeTransfer ? 450 : 0;
  const tax = Math.round((subtotal + transferFee) * 0.12);
  const grossTotal = subtotal + transferFee + tax;
  const finalTotal = Math.max(0, grossTotal - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponError(null);
    const res = await apiService.validateCoupon(couponCode, subtotal);
    if (res.valid) {
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discountAmount);
    } else {
      setCouponError(res.error || 'Invalid code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const bookingData = {
        userId: user?.id || 'u-1',
        userName: guestName,
        userEmail: guestEmail,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyImage: property.images[0],
        location: property.location,
        checkIn,
        checkOut,
        guests: guestsCount,
        nights,
        pricePerNight: property.pricePerNight,
        subtotal,
        tax,
        serviceFee: transferFee,
        discount: discountAmount,
        loyaltyDiscount: 0,
        total: finalTotal,
        currency: 'USD',
        paymentStatus: 'PAID' as const,
        transferDetails: includeTransfer ? { type: 'Mercedes Maybach / Helicopter Transfer', price: 450 } : undefined,
      };

      const newBooking = await apiService.createBooking(bookingData);
      setConfirmedBookingId(newBooking.bookingId);
      setIsSubmitting(false);
      setShowStarCelebration(true);
      
      setTimeout(() => {
        navigate(`/booking/success/${newBooking.bookingId}`);
      }, 3200);
    } catch (err) {
      setIsSubmitting(false);
      alert('Checkout process failed. Please retry.');
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#4a4646] hover:text-[#1b1c1c] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Property</span>
      </button>

      <div className="border-b border-[#e6e2e2] pb-4">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1b1c1c]">
          Complete Your Reservation
        </h1>
        <p className="text-xs text-[#6a6666] mt-1">
          Review guest information, add-on airport transfers, apply promotional vouchers, and verify payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Form Column */}
        <form onSubmit={handleCompletePayment} className="lg:col-span-2 space-y-8">
          
          {/* Guest Information */}
          <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1b1c1c] border-b border-[#f0ecec] pb-3">
              Primary Guest Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4646]">Full Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold text-[#1b1c1c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4646]">Email Address</label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold text-[#1b1c1c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4646]">Direct Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold text-[#1b1c1c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4a4646]">Total Guests</label>
                <input
                  type="number"
                  min={1}
                  max={property.maxGuests}
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold text-[#1b1c1c]"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-[#4a4646]">Special Resident Requests & Dietary Desires</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="E.g., Private champagne on arrival, gluten-free chef preparations, helicopter landing arrangements..."
                rows={2}
                className="w-full p-3 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Add-on Airport Transfer */}
          <div className="bg-[#f5f2ed] p-6 rounded-3xl border border-[#e2dccf] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1b1c1c] text-[#ffdea5] flex items-center justify-center font-bold">
                  🚗
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1b1c1c]">Privé Chauffeur Airport Transfer</h4>
                  <p className="text-xs text-[#6a6666]">Mercedes Maybach or Private Helicopter greeting ({formatPrice(450)})</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={includeTransfer}
                onChange={(e) => setIncludeTransfer(e.target.checked)}
                className="w-5 h-5 rounded accent-[#1b1c1c] cursor-pointer"
              />
            </div>
          </div>

          {/* Promotional Coupon Validation */}
          <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1b1c1c]">Promotional Voucher Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Try code LUXE10 or WELCOME20"
                className="flex-1 px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs uppercase font-mono font-bold"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-5 py-2.5 bg-[#1b1c1c] text-[#ffdea5] font-bold text-xs rounded-xl hover:bg-[#2e2d2d] cursor-pointer"
              >
                Apply Voucher
              </button>
            </div>

            {appliedCoupon && (
              <div className="p-3 bg-[#f2ede4] border border-[#dcd3c1] rounded-xl text-xs text-[#524b3f] flex items-center justify-between">
                <span>Code {appliedCoupon.code} applied successfully ({appliedCoupon.discountPercent}% OFF)</span>
                <span className="font-bold text-[#b8860b]">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            {couponError && (
              <p className="text-xs text-[#a33838] font-semibold">{couponError}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#f0ecec] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#1b1c1c]">Payment Authorization</h3>
              <span className="text-[10px] font-bold text-[#8a6314] uppercase tracking-wider bg-[#f6f0e6] px-2.5 py-1 rounded-full border border-[#ebdcc8]">
                256-bit SSL Encrypted
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'qr', label: 'Instant QR Pay', icon: QrCode, highlight: true },
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'wire', label: 'Wire Transfer', icon: Building2 },
                { id: 'crypto', label: 'Privé Wallet', icon: Lock },
              ].map((pm) => (
                <button
                  type="button"
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer relative ${
                    paymentMethod === pm.id
                      ? 'bg-[#1b1c1c] text-[#ffdea5] border-[#1b1c1c] shadow-md scale-[1.02]'
                      : 'bg-[#fcfaf6] text-[#4a4646] border-[#ebdcc8] hover:bg-[#f5ebd9]'
                  }`}
                >
                  {pm.highlight && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-[#9e7208] text-white text-[8px] font-extrabold uppercase rounded-full shadow-xs">
                      Popular
                    </span>
                  )}
                  <pm.icon className="w-5 h-5" />
                  <span className="text-center">{pm.label}</span>
                </button>
              ))}
            </div>

            {/* QR CODE PAYMENT OPTION */}
            {paymentMethod === 'qr' && (
              <div className="p-5 bg-gradient-to-br from-[#fcfaf6] to-[#f4ebe0] border border-[#ebdcc8] rounded-2xl space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative group shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#b8860b] via-[#e2c077] to-[#1b1c1c] rounded-2xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative bg-white p-3 rounded-xl border border-[#ebdcc8] text-center shadow-lg">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=pay.luxeway.com/checkout?id=${property.id}&amt=${finalTotal}`}
                        alt="Privé Payment QR Code"
                        className="w-36 h-36 mx-auto rounded-lg"
                      />
                      <span className="text-[9px] font-bold text-[#8a6314] tracking-widest uppercase block mt-1.5">
                        SCAN TO AUTHORIZE
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-left flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1b1c1c] text-[#ffdea5] text-[10px] font-bold rounded-full">
                      <Zap className="w-3 h-3 text-[#ffdea5]" />
                      <span>Instant Zero-Fee QR Authorization</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7a6f63] block">Amount Due</span>
                      <p className="font-serif font-bold text-2xl text-[#1b1c1c]">{formatPrice(finalTotal)}</p>
                    </div>

                    <div className="text-[11px] text-[#5c534a] space-y-1">
                      <p className="font-semibold">Merchant: <span className="font-bold text-[#1b1c1c]">LuxeWay Privé Escrow</span></p>
                      <p className="text-[10px] text-[#7a6f63]">Scan with camera, Apple Pay, Google Pay, Revolut, UPI, or Banking app.</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Apple Pay', 'Google Pay', 'Revolut', 'BHIM / UPI', 'Banking App'].map((badge) => (
                        <span key={badge} className="px-2 py-0.5 bg-white border border-[#ebdcc8] text-[9px] font-bold text-[#4a443e] rounded-md">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#ebdcc8]">
                  <button
                    type="button"
                    onClick={handleCompletePayment}
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#9e7208] text-white font-bold text-xs rounded-xl hover:bg-[#825c00] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#ffdea5] animate-spin" />
                    <span>{isSubmitting ? 'Verifying QR Payment...' : 'Simulate Instant QR Scan & Complete Payment'}</span>
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-[#6a6666]">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#6a6666]">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6a6666]">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wire' && (
              <div className="p-4 bg-[#fbf9f5] border border-[#eee8dc] rounded-2xl text-xs space-y-2 text-[#5c534a]">
                <p className="font-bold text-[#1b1c1c]">Privé Escrow Wire Details:</p>
                <p className="font-mono text-[11px]">Bank: J.P. Morgan Private Bank • IBAN: US92 LUXE 0048 2910 3982</p>
                <p className="text-[10px] text-[#7a6f63]">Your reservation is locked immediately upon initiating wire transfer.</p>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="p-4 bg-[#fbf9f5] border border-[#eee8dc] rounded-2xl text-xs space-y-2 text-[#5c534a]">
                <p className="font-bold text-[#1b1c1c]">Privé Wallet / USDC / BTC:</p>
                <p className="font-mono text-[11px]">0x71C...49A2 (Ethereum / Solana / Bitcoin network supported)</p>
              </div>
            )}

            {paymentMethod !== 'qr' && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#1b1c1c] text-[#ffdea5] font-bold text-sm rounded-2xl hover:bg-[#2e2d2d] transition-all cursor-pointer shadow-xl text-center"
              >
                {isSubmitting ? 'Confirming & Authorizing...' : `Pay & Authorize ${formatPrice(finalTotal)}`}
              </button>
            )}

          </div>

        </form>

        {/* Right Summary Column */}
        <aside className="sticky top-24 bg-white p-6 rounded-3xl border border-[#e2dede] shadow-xl space-y-6">
          <div className="flex gap-4 pb-4 border-b border-[#f0ecec]">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-20 h-20 rounded-2xl object-cover shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase text-[#b8860b]">{property.location}</span>
              <h3 className="font-serif font-bold text-base text-[#1b1c1c] line-clamp-1">{property.title}</h3>
              <p className="text-xs text-[#7a7676]">{nights} Nights ({checkIn} – {checkOut})</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#524e4e]">
            <div className="flex justify-between">
              <span>{formatPrice(property.pricePerNight)} x {nights} nights</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {includeTransfer && (
              <div className="flex justify-between">
                <span>Chauffeur Transfer</span>
                <span>{formatPrice(transferFee)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax & Privé Concierge (12%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#b8860b] font-bold">
                <span>Voucher Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-[#1b1c1c] text-base pt-3 border-t border-[#f0ecec]">
              <span>Final Total</span>
              <span className="font-serif text-2xl">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <div className="p-3 bg-[#fbf9f5] rounded-xl border border-[#eee8dc] text-[11px] text-[#7a6f56] space-y-1">
            <p className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#b8860b]" /> 100% Guaranteed Cancellation Policy
            </p>
            <p>Free cancellation up to 7 days prior to check-in.</p>
          </div>
        </aside>

      </div>

      {/* STAR PAYMENT SUCCESS CELEBRATION MODAL */}
      {showStarCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          {/* Animated floating background stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/6 text-[#ffdea5] opacity-80 animate-star-pulse">
              <Star className="w-12 h-12 fill-[#ffdea5]" />
            </div>
            <div className="absolute top-1/3 right-1/5 text-[#e2c077] opacity-90 animate-star-pulse" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="w-16 h-16 text-[#ffdea5]" />
            </div>
            <div className="absolute bottom-1/4 left-1/4 text-[#ffdea5] opacity-70 animate-star-pulse" style={{ animationDelay: '1s' }}>
              <Star className="w-10 h-10 fill-[#ffdea5]" />
            </div>
            <div className="absolute bottom-1/3 right-1/4 text-[#e2c077] opacity-85 animate-star-pulse" style={{ animationDelay: '1.5s' }}>
              <Sparkles className="w-14 h-14 text-[#ffdea5]" />
            </div>
          </div>

          <div className="relative bg-gradient-to-b from-[#1b1a18] via-[#12100e] to-[#1c1815] border border-[#ffdea5]/40 p-8 sm:p-12 rounded-3xl max-w-lg w-full text-center space-y-6 shadow-2xl overflow-hidden text-white animate-star-burst">
            
            {/* Expanding Pulsing Ring */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#ffdea5] animate-ring-expand" />
              <div className="absolute -inset-3 rounded-full bg-[#ffdea5]/10 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#9e7208] via-[#e2c077] to-[#ffdea5] text-[#1b1c1c] flex items-center justify-center shadow-2xl">
                <Star className="w-12 h-12 fill-[#1b1c1c] text-[#1b1c1c] animate-bounce" />
              </div>
            </div>

            {/* 5 Stars Rating Indicator */}
            <div className="flex justify-center items-center space-x-1.5 text-[#ffdea5]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#ffdea5] text-[#ffdea5] animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffdea5] block">
                ★ ★ ★ ★ ★ PRIVÉ 5-STAR TRANSACTION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Payment Successful!
              </h2>
              <p className="text-xs text-[#dcd3c1] max-w-sm mx-auto">
                Your payment of <strong className="text-[#ffdea5]">{formatPrice(finalTotal)}</strong> was authorized and verified instantly.
              </p>
            </div>

            {/* Receipt Summary Chip */}
            <div className="bg-white/5 border border-[#ffdea5]/20 p-4 rounded-2xl text-xs space-y-1 text-left text-[#e0d6c3]">
              <div className="flex justify-between font-mono text-[11px] border-b border-white/10 pb-2 mb-2">
                <span>Pass Ref:</span>
                <span className="font-bold text-[#ffdea5]">{confirmedBookingId || 'LXW-PASS-99'}</span>
              </div>
              <div className="flex justify-between">
                <span>Sanctuary:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{property.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Guest:</span>
                <span className="font-semibold text-white">{guestName}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Confirmed
                </span>
              </div>
            </div>

            {/* Loading Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#9e7208] via-[#ffdea5] to-white h-full animate-[pulse_1s_infinite] w-full origin-left" />
              </div>
              <p className="text-[10px] font-mono text-[#a39785]">Minting digital boarding pass & sending concierge email...</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
