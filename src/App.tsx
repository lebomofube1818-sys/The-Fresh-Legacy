/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryHero from '@/components/CategoryHero';
import ProductCard from '@/components/ProductCard';
import ProductDetail from '@/components/ProductDetail';
import FilterSheet from '@/components/FilterSheet';
import Checkout from '@/components/Checkout';
import OrderSuccess from '@/components/OrderSuccess';
import ProfileView from '@/components/ProfileView';
import AuthModal from '@/components/AuthModal';
import WishlistView from '@/components/WishlistView';
import { MOCK_PRODUCTS } from '@/constants';
import { ArrowRight, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'shop' | 'checkout' | 'success' | 'profile' | 'wishlist' | 'admin';

interface FilterState {
  priceRange: [number, number];
  genders: string[];
  styles: string[];
}

const INITIAL_FILTERS: FilterState = {
  priceRange: [0, 5000],
  genders: [],
  styles: [],
};

import AdminPortal from '@/components/AdminPortal';
import { db, auth, syncUserProfile } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState('all');
  const [view, setView] = useState<View>('shop');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        syncUserProfile(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    // Category (Global type) Filter
    const matchesCategory = (() => {
      if (category === 'all') return product.isNew;
      if (category === 'men') return product.gender === 'men' || product.gender === 'unisex';
      if (category === 'women') return product.gender === 'women' || product.gender === 'unisex';
      if (category === 'style') return true;
      if (category === 'sale') return product.isSale;
      return true;
    })();

    if (!matchesCategory) return false;

    // Additional Filters
    const matchesPrice = product.price <= (filters.priceRange?.[1] ?? 5000);
    const matchesGender = (filters.genders || []).length === 0 || (filters.genders || []).includes(product.gender);
    const matchesStyle = (filters.styles || []).length === 0 || (filters.styles || []).includes(product.sport);

    return matchesPrice && matchesGender && matchesStyle;
  });

  const getSectionTitle = () => {
    switch (category) {
      case 'men': return "Men's Collections";
      case 'women': return "Women's Collections";
      case 'style': return "Style & Aesthetics";
      case 'sale': return "Shop the Sale";
      default: return "Featured Drops";
    }
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setSelectedProduct(null);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'admin') {
    return <AdminPortal onBack={() => setView('profile')} />;
  }

  if (view === 'profile') {
    return (
      <>
        <Navbar 
          onCategoryChange={handleCategoryChange} 
          activeCategory={category} 
          onProductSelect={(product) => {
            setSelectedProduct(product);
            setView('shop');
            window.scrollTo(0, 0);
          }}
          onProfileClick={() => setView('profile')}
          onWishlistClick={() => setView('wishlist')}
          onCheckout={() => setView('checkout')}
          onAuthOpen={() => setShowAuthModal(true)}
        />
        <ProfileView onBack={() => setView('shop')} onAdminClick={() => setView('admin')} onAuthOpen={() => setShowAuthModal(true)} />
        <AnimatePresence>
          {showAuthModal && (
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
          )}
        </AnimatePresence>
      </>
    );
  }

  if (view === 'wishlist') {
    return (
      <>
        <Navbar 
          onCategoryChange={handleCategoryChange} 
          activeCategory={category} 
          onProductSelect={(product) => {
            setSelectedProduct(product);
            setView('shop');
            window.scrollTo(0, 0);
          }}
          onProfileClick={() => setView('profile')}
          onWishlistClick={() => setView('wishlist')}
          onCheckout={() => setView('checkout')}
        />
        <WishlistView 
          onBack={() => setView('shop')} 
          onProductClick={(p) => {
            setSelectedProduct(p);
            setView('shop');
            window.scrollTo(0, 0);
          }}
        />
      </>
    );
  }

  if (view === 'success') {
    return <OrderSuccess onContinue={() => {
      setView('shop');
      setCategory('all');
    }} />;
  }

  if (view === 'checkout') {
    return <Checkout onBack={() => setView('shop')} onSuccess={() => {
      setView('success');
    }} />;
  }

  if (selectedProduct) {
    return (
      <>
        <Navbar 
          onCategoryChange={handleCategoryChange} 
          activeCategory={category} 
          onProductSelect={(product) => {
            setSelectedProduct(product);
            setView('shop');
            window.scrollTo(0, 0);
          }}
          onProfileClick={() => setView('profile')}
          onWishlistClick={() => setView('wishlist')}
          onCheckout={() => setView('checkout')}
        />
        <ProductDetail 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onCategoryChange={handleCategoryChange} 
        activeCategory={category} 
        onProductSelect={(product) => {
          setSelectedProduct(product);
          window.scrollTo(0, 0);
        }}
        onProfileClick={() => setView('profile')}
        onWishlistClick={() => setView('wishlist')}
        onCheckout={() => {
          setView('checkout');
          window.scrollTo(0, 0);
        }}
        onAuthOpen={() => setShowAuthModal(true)}
      />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {category === 'all' ? <Hero /> : <CategoryHero category={category} />}
            
            {/* Products Section */}
            <section id="featured-drops" className="py-20 tfl-container">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                    {getSectionTitle()}
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                    <span className="w-12 h-px bg-brand-primary" />
                    <span>{filteredProducts.length} items found</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsFilterSheetOpen(true)}
                    className={`rounded-full border-2 font-bold px-8 flex items-center gap-2 hover:bg-black hover:text-white transition-all ${
                      (filters.genders.length > 0 || filters.styles.length > 0 || filters.priceRange[1] < 5000) 
                        ? 'border-brand-accent text-brand-accent' 
                        : ''
                    }`}
                  >
                    Filter <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                  <div className="hidden md:flex space-x-2">
                    <Button variant="outline" size="icon" className="rounded-full border-2 hover:bg-black hover:text-white transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full border-2 hover:bg-black hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={(p) => {
                      setSelectedProduct(p);
                      window.scrollTo(0, 0);
                    }}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="py-32 text-center">
                  <div className="inline-block p-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <p className="text-gray-400 text-2xl font-bold uppercase italic tracking-tighter">
                      Our inventory is constantly evolving.
                    </p>
                    <p className="text-gray-400 text-sm mt-2 font-medium">Check back soon for new arrivals.</p>
                  </div>
                </div>
              )}
            </section>

            {/* Category specific content additions could go here */}
            {category === 'all' && (
              <>
                {/* Brand Story / Banner Section */}
                <section className="py-32 bg-brand-primary text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-accent/20 to-transparent" />
                  <div className="tfl-container relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div className="space-y-8">
                        <motion.h2 
                          initial={{ opacity: 0, x: -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          className="text-7xl md:text-9xl leading-[0.8] font-black italic tracking-tighter uppercase"
                        >
                          THE FRESH <br /> <span className="text-brand-accent italic">LEGACY</span>
                        </motion.h2>
                        <p className="text-xl text-gray-400 max-w-xl font-medium leading-relaxed">
                          Engineered for the elite. Defined by the culture. 
                          We curate the blueprints for the next generation of icons and heavy hitters.
                        </p>
                        <Button 
                          onClick={() => {
                            setCategory('style');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-white text-black hover:bg-gray-200 rounded-full px-12 py-8 text-lg font-black uppercase tracking-tight transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                          Explore the Aura
                        </Button>
                      </div>
                      <div className="relative group">
                         <div className="absolute -inset-4 bg-nike-orange/10 rounded-3xl blur-3xl group-hover:bg-nike-orange/20 transition-colors" />
                         <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl">
                            <img 
                              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80" 
                              alt="Sustainability Legacy" 
                              className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-110 transition-all duration-1000 ease-in-out scale-105 hover:scale-100"
                            />
                         </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="py-32 tfl-container">
                  <div className="flex items-end justify-between mb-16">
                    <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">Shop by <span className="text-gray-300">Style</span></h2>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setCategory('style');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hidden md:flex items-center gap-2 font-black uppercase tracking-widest text-xs hover:text-brand-accent group"
                    >
                      View all aesthetics
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { name: 'Street Legacy', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80', desc: 'Urban. Authentic. Raw.' },
                      { name: 'Quiet Luxury', img: 'https://images.unsplash.com/photo-1449247704656-1a642a201be3?w=600&q=80', desc: 'Sleek. Minimal. Elite.' },
                      { name: 'Aura Tech', img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80', desc: 'Futuristic. Precise. Edge.' },
                      { name: 'Retro Modern', img: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=600&q=80', desc: 'Heritage. Reimagined. Soul.' },
                    ].map((style) => (
                      <div key={style.name} className="relative aspect-[4/5] group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
                        <img 
                          src={style.img} 
                          alt={style.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute bottom-10 left-10 right-10">
                          <p className="text-brand-accent text-[10px] font-black uppercase tracking-[0.3em] mb-2">{style.desc}</p>
                          <h3 className="text-white text-4xl font-black italic tracking-tighter uppercase leading-none mb-4">{style.name}</h3>
                          <div className="w-12 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <FilterSheet 
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />

      <footer className="bg-brand-primary text-white pt-32 pb-16">
        <div className="tfl-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <h4 className="font-black text-xl uppercase tracking-widest italic tracking-tighter">Resources</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <li className="hover:text-white transition-colors cursor-pointer">Gift Cards</li>
                <li className="hover:text-white transition-colors cursor-pointer">Find a Store</li>
                <li className="hover:text-white transition-colors cursor-pointer">Membership</li>
                <li className="hover:text-white transition-colors cursor-pointer">The Journal</li>
                <li className="hover:text-white transition-colors cursor-pointer">Site Feedback</li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="font-black text-xl uppercase tracking-widest italic tracking-tighter">Help</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <li className="hover:text-white transition-colors cursor-pointer">Get Help</li>
                <li className="hover:text-white transition-colors cursor-pointer">Order Status</li>
                <li className="hover:text-white transition-colors cursor-pointer">Shipping & Delivery</li>
                <li className="hover:text-white transition-colors cursor-pointer">Returns</li>
                <li className="hover:text-white transition-colors cursor-pointer">Payment Options</li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="font-black text-xl uppercase tracking-widest italic tracking-tighter">Company</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <li className="hover:text-white transition-colors cursor-pointer">About The Fresh Legacy</li>
                <li className="hover:text-white transition-colors cursor-pointer">News</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Investors</li>
                <li className="hover:text-white transition-colors cursor-pointer">Legacy Impact</li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="font-black text-xl uppercase tracking-widest italic tracking-tighter">Member Access</h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Step into the future with exclusive access to stories, inspiration, and limited-edition releases. 
                Our members are at the heart of everything we do.
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                variant="outline" 
                className="text-white border-white border-2 hover:bg-white hover:text-black rounded-full px-8 py-6 font-black uppercase italic tracking-tighter transition-all"
              >
                Join Today
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between pt-12 border-t border-gray-800 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
            <div className="flex items-center gap-10 flex-wrap justify-center mb-8 lg:mb-0">
               <p className="text-gray-400">© 2026 The Fresh Legacy, Inc. All Rights Reserved</p>
               <span className="hover:text-white cursor-pointer transition-colors">United Kingdom</span>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-4 justify-center">
               <span className="hover:text-white cursor-pointer transition-colors">Guides</span>
               <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
               <span className="hover:text-white cursor-pointer transition-colors">Terms of Sale</span>
               <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
