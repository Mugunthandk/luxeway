import React from 'react';
import { BookOpen, Compass, ArrowRight } from 'lucide-react';

export const JournalPage: React.FC = () => {
  const articles = [
    {
      id: '1',
      title: 'The Art of Secluded Coastal Living in St. Barts',
      excerpt: 'Exploring private super-yacht harbors, hidden cove villas, and Michelin-starred dining in Gustavia.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      category: 'Destinations',
      readTime: '6 min read',
    },
    {
      id: '2',
      title: 'Alpine Sanctuary Architecture: Zermatt Chalet Design',
      excerpt: 'How timber-framed glass chalets blend high-altitude wellness with floor-to-ceiling Matterhorn vistas.',
      image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
      category: 'Design & Living',
      readTime: '8 min read',
    },
    {
      id: '3',
      title: 'Overwater Marine Conservation in the Atolls',
      excerpt: 'Behind the scenes with resident marine biologists protecting private coral nurseries in the Maldives.',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      category: 'Sustainability',
      readTime: '5 min read',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#b8860b]">
          Privé Editorial
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1b1c1c]">
          LuxeWay Travel Journal
        </h1>
        <p className="text-xs sm:text-sm text-[#6a6666]">
          Curated stories on architecture, gastronomy, yachting, and quiet luxury escapes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((art) => (
          <div key={art.id} className="bg-white rounded-3xl border border-[#e8e4e4] overflow-hidden shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
            <div>
              <img src={art.image} alt={art.title} className="w-full h-52 object-cover" />
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8a7a58] font-bold">
                  <span>{art.category}</span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-[#1b1c1c] leading-snug">{art.title}</h3>
                <p className="text-xs text-[#6a6666] leading-relaxed">{art.excerpt}</p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => alert(`Reading article: ${art.title}`)}
                className="text-xs font-bold text-[#b8860b] flex items-center gap-1 hover:underline cursor-pointer"
              >
                Read Article <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
