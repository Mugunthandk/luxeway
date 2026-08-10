import React, { useEffect, useState } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types';
import { apiService } from '../services/api';
import { SEED_PROPERTIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { Heart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistIds } = useApp();
  const [properties, setProperties] = useState<Property[]>(() =>
    SEED_PROPERTIES.filter(p => wishlistIds.includes(p.id))
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiService.getProperties().then((all) => {
      setProperties(all.filter(p => wishlistIds.includes(p.id)));
      setLoading(false);
    });
  }, [wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-[#e6e2e2] pb-6 space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1b1c1c] flex items-center gap-3">
          <Heart className="w-8 h-8 text-[#a33838] fill-current" />
          <span>Saved Privé Portfolio</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6a6666]">
          {wishlistIds.length} Residences saved to your luxury wishlist.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#e8e4e4] text-center space-y-4">
          <Heart className="w-12 h-12 text-[#a33838] mx-auto opacity-40" />
          <h3 className="font-serif font-bold text-2xl text-[#1b1c1c]">Your Wishlist is Empty</h3>
          <p className="text-xs text-[#7a7676]">Click the heart icon on any residence to save it for future evaluation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

    </div>
  );
};
