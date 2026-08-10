import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        navigate('/dashboard');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 my-4">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl shadow-xl border border-[#ebdcc8]">
        <img
          src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1920&q=80"
          alt="Overwater Luxury Bungalows"
          className="w-full h-full object-cover scale-105 filter brightness-[0.88] contrast-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100e0c]/85 via-[#fcfaf6]/70 to-[#fcfaf6]/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1b1c1c] text-[#ffdea5] font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-md">
            L
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1b1c1c]">Request Invitation</h1>
          <p className="text-xs text-[#4a443e] font-medium">Join the world's most discreet luxury travel circle.</p>
        </div>

        <form onSubmit={handleRegister} className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-[#ebdcc8] shadow-2xl space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c1815]">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lord / Lady Carrington"
              className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#9e7208]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c1815]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="carrington@estate.com"
              className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#9e7208]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c1815]">Security Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#9e7208]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#1b1c1c] text-[#ffdea5] font-bold text-xs rounded-2xl hover:bg-[#2e2d2d] transition-all cursor-pointer shadow-lg"
          >
            Activate Privé Membership
          </button>

          <div className="pt-2 text-center text-xs text-[#5c534a]">
            Already have an active account?{' '}
            <Link to="/login" className="font-bold text-[#1b1c1c] hover:underline">
              Sign In
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
};
