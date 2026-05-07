import React from 'react';
import { motion } from 'framer-motion';

interface CategoryHeroProps {
  category: string;
}

const categoryData: Record<string, { title: string; subtitle: string; bgImage: string; description: string }> = {
  men: {
    title: "MEN'S COLLECTIONS",
    subtitle: "Built for Performance",
    description: "Gear up for greatness. Explore the latest performance footwear and apparel designed to push your limits.",
    bgImage: "https://images.unsplash.com/photo-1549476464-37392f71752a?w=1600&q=80"
  },
  women: {
    title: "WOMEN'S COLLECTIONS",
    subtitle: "Innovation Meets Style",
    description: "Support for every move. Style for every look. Discover apparel and footwear made to keep you going.",
    bgImage: "https://images.unsplash.com/photo-1571141380069-521a19e0576c?w=1600&q=80"
  },
  style: {
    title: "STYLE & AESTHETICS",
    subtitle: "Define Your Aura",
    description: "From Street Legacy to Quiet Luxury. Curated looks that bridge the gap between Gen Z energy and professional sophistication.",
    bgImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=80"
  },
  sale: {
    title: "SHOP THE SALE",
    subtitle: "Latest Styles, Lower Prices",
    description: "Don't miss out. Get your favorites for less. Performance gear and icons at restricted prices.",
    bgImage: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=80"
  },
  all: {
    title: "NEW & FEATURED",
    subtitle: "The Latest and Greatest",
    description: "Stay ahead of the curve. Explore our most recent innovations and curated selections of The Fresh Legacy icons.",
    bgImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1600&q=80"
  }
};

export default function CategoryHero({ category }: CategoryHeroProps) {
  const data = categoryData[category] || categoryData.all;

  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={data.bgImage} 
          alt={data.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 tfl-container text-center text-white space-y-6 max-w-4xl">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <span className="text-sm md:text-base font-bold tracking-[0.3em] uppercase opacity-80 mb-4 block">
            {data.subtitle}
          </span>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 drop-shadow-2xl">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
            {data.description}
          </p>
        </motion.div>
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-white/10 hidden lg:block" />
      <div className="absolute right-10 top-0 bottom-0 w-px bg-white/10 hidden lg:block" />
    </section>
  );
}
