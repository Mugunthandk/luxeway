import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login response not ok');
      const data = await res.json();

      setUser(data.user);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setIsLoading(false);
      alert('Login failed');
    }
  };

  const handleQuickDemo = (role: 'user' | 'host' | 'admin') => {
    if (role === 'admin') setEmail('admin@luxeway.com');
    else if (role === 'host') setEmail('host@luxeway.com');
    else setEmail('guest@luxeway.com');
    setPassword('demo1234');
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 my-4">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl shadow-xl border border-[#ebdcc8]">
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Resort Background"
          className="w-full h-full object-cover scale-105 filter brightness-[0.88] contrast-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100e0c]/85 via-[#fcfaf6]/70 to-[#fcfaf6]/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1b1c1c] text-[#ffdea5] font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-md">
            L
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1b1c1c]">Privé Member Sign In</h1>
          <p className="text-xs text-[#4a443e] font-medium">Access your saved properties, itineraries, and digital travel passes.</p>
        </div>

        {/* Demo Selector Buttons */}
        <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#ebdcc8] space-y-2 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a6314] block text-center">Quick Demo Accounts</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo('user')}
              className="py-1.5 bg-[#f6f0e6] rounded-lg text-[11px] font-bold text-[#1b1c1c] hover:bg-[#1b1c1c] hover:text-[#ffdea5] transition-all"
            >
              Member
            </button>
            <button
              onClick={() => handleQuickDemo('host')}
              className="py-1.5 bg-[#f6f0e6] rounded-lg text-[11px] font-bold text-[#1b1c1c] hover:bg-[#1b1c1c] hover:text-[#ffdea5] transition-all"
            >
              Host Studio
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 bg-[#f6f0e6] rounded-lg text-[11px] font-bold text-[#a33838] hover:bg-[#1b1c1c] hover:text-[#ffdea5] transition-all"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-[#ebdcc8] shadow-2xl space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c1815]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8a857b] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@luxeway.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#9e7208]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c1815]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8a857b] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#fbf9f9] border border-[#e2dede] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#9e7208]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#1b1c1c] text-[#ffdea5] font-bold text-xs rounded-2xl hover:bg-[#2e2d2d] transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Privé Access'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-xs text-[#5c534a]">
            Not a member yet?{' '}
            <Link to="/register" className="font-bold text-[#1b1c1c] hover:underline">
              Register for Invitation
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
};
