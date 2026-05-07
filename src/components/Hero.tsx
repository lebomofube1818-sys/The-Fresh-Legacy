import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&q=80"
          alt="The Fresh Legacy"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full tfl-container flex flex-col items-center justify-end pb-24 text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <h2 className="text-white font-geometric font-bold text-xl tracking-widest uppercase">
            Legacy Arrival
          </h2>
          <h1 className="text-8xl md:text-[10rem] text-white text-brand-display leading-none uppercase">
            Built for <br /> <span className="text-brand-accent">THE BOLD</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Elevate your journey with The Fresh Legacy's latest collection. 
            Crafted for performance, tailored for the streets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <Button 
              onClick={() => document.getElementById('featured-drops')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/20 backdrop-blur-2xl border border-white/30 text-white hover:bg-white/30 rounded-full px-12 py-8 text-lg font-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              SHOP NOW
            </Button>
            <Button 
              onClick={() => document.getElementById('featured-drops')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-full px-12 py-8 text-lg font-black transition-all hover:scale-105 active:scale-95"
            >
              EXPLORE AIR
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
