import React from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, QrCode, ShieldCheck, Award, CreditCard, KeyRound, Sparkles } from 'lucide-react';

export const TravelWalletPage: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="border-b border-[#e6e2e2] pb-6 space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1b1c1c] flex items-center gap-3">
          <Wallet className="w-8 h-8 text-[#b8860b]" />
          <span>Digital Travel Wallet & Passes</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6a6666]">
          Your keyless room credentials, private flight boarding passes, and Privé Membership status card.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Digital Membership Card */}
        <div className="bg-[#141a32] text-white p-8 rounded-3xl border border-[#2d3866] shadow-2xl relative overflow-hidden space-y-6 flex flex-col justify-between h-72">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#ffdea5] text-[#141a32] font-bold flex items-center justify-center">
                L
              </div>
              <span className="font-serif font-bold text-lg text-white">LuxeWay Privé</span>
            </div>
            <span className="px-3 py-1 bg-[#ffdea5] text-[#141a32] text-xs font-bold uppercase rounded-full">
              {user?.membership || 'Privé Member'}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-[#8e96b5] uppercase tracking-widest">Cardholder</p>
            <p className="font-serif font-bold text-2xl text-white">{user?.name || 'Mugunthan DK'}</p>
            <p className="font-mono text-xs text-[#ffdea5]">LXW-98214-PRIVÉ</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#2d3866] text-xs">
            <span>Points: <strong className="text-[#ffdea5]">{user?.loyaltyPoints || 3450} pts</strong></span>
            <span className="flex items-center gap-1 text-[#b3b9d1]"><ShieldCheck className="w-4 h-4 text-[#ffdea5]" /> Active</span>
          </div>
        </div>

        {/* Keyless Room & Chauffeur Pass */}
        <div className="bg-white p-6 rounded-3xl border border-[#e8e4e4] shadow-md space-y-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-[#b8860b] font-bold text-sm">
            <KeyRound className="w-5 h-5" />
            <span>Keyless Room Access & Chauffeur QR</span>
          </div>

          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=LXW-ROOM-AMALFI-VILLA-AZURE"
            alt="Room Pass QR"
            className="w-40 h-40 mx-auto rounded-2xl border border-[#e2dede] p-2 bg-white"
          />

          <div className="text-xs text-[#524e4e]">
            <p className="font-bold text-[#1b1c1c]">Villa Azure • Positano</p>
            <p className="text-[#8c8888]">Oct 12 – Oct 18, 2026</p>
          </div>
        </div>

      </div>

    </div>
  );
};
