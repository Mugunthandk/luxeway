import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Award, Heart, Briefcase, Wallet, ShieldCheck, Sparkles, Settings } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Profile Box */}
      <div className="bg-[#141a32] text-white p-8 sm:p-12 rounded-3xl border border-[#2d3866] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full bg-[#ffdea5] text-[#141a32] flex items-center justify-center font-serif text-3xl font-bold border-4 border-white/20">
            {user?.name?.charAt(0) || 'M'}
          </div>
          <div className="space-y-1">
            <span className="px-3 py-0.5 rounded-full bg-[#ffdea5]/20 text-[#ffdea5] text-xs font-bold uppercase border border-[#ffdea5]/30">
              {user?.membership || 'Privé Member'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">{user?.name}</h1>
            <p className="text-xs text-[#cbd1e6]">{user?.email}</p>
          </div>
        </div>

        <div className="bg-[#1c2445] p-4 rounded-2xl border border-[#2d3866] text-right space-y-1 shrink-0">
          <span className="text-xs text-[#8e96b5] block uppercase">LuxePoints Balance</span>
          <span className="font-serif font-bold text-3xl text-[#ffdea5]">{user?.loyaltyPoints || 3450} pts</span>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link
          to="/trips"
          className="bg-white p-6 rounded-3xl border border-[#e8e4e4] shadow-sm hover:shadow-xl transition-all space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#f2ede4] text-[#8a7a58] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1b1c1c]">Active Stays & Invoices</h3>
          <p className="text-xs text-[#6a6666]">Review your confirmed stays, chauffeur transfers, and tax invoices.</p>
        </Link>

        <Link
          to="/wishlist"
          className="bg-white p-6 rounded-3xl border border-[#e8e4e4] shadow-sm hover:shadow-xl transition-all space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#f2ede4] text-[#a33838] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1b1c1c]">Saved Portfolio</h3>
          <p className="text-xs text-[#6a6666]">Access saved residences and price-drop alerts.</p>
        </Link>

        <Link
          to="/wallet"
          className="bg-white p-6 rounded-3xl border border-[#e8e4e4] shadow-sm hover:shadow-xl transition-all space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#f2ede4] text-[#b8860b] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1b1c1c]">Digital Wallet</h3>
          <p className="text-xs text-[#6a6666]">View keyless QR credentials and membership passes.</p>
        </Link>

      </div>

    </div>
  );
};
