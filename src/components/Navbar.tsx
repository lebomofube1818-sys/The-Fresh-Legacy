import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, Trash2, Plus, Minus, ArrowRight, Loader2, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/CartContext';
import { useAuth } from '@/AuthContext';
import { useWishlist } from '@/WishlistContext';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { geminiService } from '@/services/geminiService';
import { MOCK_PRODUCTS } from '@/constants';
import { Product } from '@/types';

interface NavbarProps {
  onCategoryChange?: (category: string) => void;
  onCheckout?: () => void;
  onProductSelect?: (product: Product) => void;
  onProfileClick?: () => void;
  onWishlistClick?: () => void;
  onAuthOpen?: () => void;
  activeCategory?: string;
}

export default function Navbar({ 
  onCategoryChange, 
  onCheckout, 
  onProductSelect, 
  onProfileClick,
  onWishlistClick,
  onAuthOpen,
  activeCategory 
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart();
  const { user, loginWithGoogle, logout } = useAuth();
  const { wishlist } = useWishlist();

  const navItems = [
    { label: 'New & Featured', id: 'all' },
    { label: 'Men', id: 'men' },
    { label: 'Women', id: 'women' },
    { label: 'Style', id: 'style' },
    { label: 'Sale', id: 'sale' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real-time smart search logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await geminiService.smartSearch(searchQuery, MOCK_PRODUCTS);
        const matchedProducts = MOCK_PRODUCTS.filter(p => result.matchedIds.includes(p.id));
        setSuggestions(matchedProducts);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions and user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md py-2 shadow-sm border-gray-100' 
          : 'bg-white/80 backdrop-blur-lg py-4 border-transparent'
      }`}
    >
      <div className="tfl-container grid grid-cols-12 items-center">
        {/* Logo Zone */}
        <div 
          className="col-span-4 lg:col-span-3 flex items-center cursor-pointer"
          onClick={() => onCategoryChange?.('all')}
        >
          <span className="font-heading text-xl md:text-2xl font-black italic tracking-tighter uppercase text-brand-primary transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
            The Fresh Legacy
          </span>
        </div>

        {/* Desktop Menu Zone */}
        <div className="hidden lg:flex col-span-6 items-center justify-center space-x-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onCategoryChange?.(item.id)}
              className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all relative py-2 ${
                activeCategory === item.id 
                  ? 'text-brand-accent after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-brand-accent after:rounded-full' 
                  : 'text-gray-400 hover:text-brand-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Icons Zone */}
        <div className="col-span-8 lg:col-span-3 flex items-center justify-end gap-1 md:gap-3">
          <div className="hidden md:flex relative group mr-2" ref={searchRef}>
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
              className="bg-gray-100/50 border-none rounded-full pl-9 w-24 focus:w-40 transition-all duration-500 text-[10px] h-8 font-bold"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {isSearching ? (
                <Loader2 className="w-3 h-3 text-brand-accent animate-spin" />
              ) : (
                <Search className="w-3 h-3 text-gray-400" />
              )}
            </div>
            
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.98 }}
                  className="absolute top-full mt-4 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
                >
                  <div className="p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 px-2">
                      {suggestions.length > 0 ? 'Smart Matches' : 'No matches'}
                    </p>
                    <div className="space-y-1">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            onProductSelect?.(product);
                            setShowSuggestions(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all group text-left"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black italic uppercase tracking-tight truncate group-hover:text-brand-accent transition-colors">{product.name}</p>
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest">{product.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center bg-gray-100/30 p-1 rounded-full border border-gray-100/50">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-8 w-8 rounded-full hover:bg-white hover:shadow-sm transition-all"
              onClick={onWishlistClick}
            >
              <Heart className={`w-4 h-4 transition-all ${wishlist.length > 0 ? 'fill-brand-accent text-brand-accent' : 'text-gray-500'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-accent text-white text-[7px] rounded-full w-3 h-3 flex items-center justify-center font-bold shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Button>

            <div className="relative" ref={userMenuRef}>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm transition-all"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className={`w-4 h-4 transition-all ${user ? 'text-brand-accent' : 'text-gray-500'}`} />
              </Button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="absolute top-full mt-4 right-0 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[60] p-5"
                  >
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                          <div className="w-10 h-10 bg-brand-accent/10 rounded-full flex items-center justify-center text-brand-accent font-bold uppercase text-xs">
                            {user.displayName?.[0] || user.email?.[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black italic uppercase tracking-tight text-left truncate">{user.displayName || 'Sneakerhead'}</p>
                            <p className="text-[9px] text-gray-400 text-left truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {['My Profile', 'Orders', 'Wishlist'].map((label) => (
                            <button 
                              key={label}
                              onClick={() => { 
                                if (label === 'Wishlist') onWishlistClick?.();
                                else onProfileClick?.(); 
                                setShowUserMenu(false); 
                              }}
                              className="w-full text-left p-2.5 hover:bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-primary transition-all"
                            >
                              {label} {label === 'Wishlist' && wishlist.length > 0 && `(${wishlist.length})`}
                            </button>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="w-full rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border-2 h-9"
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4 text-center py-2">
                        <div className="space-y-1.5 px-2">
                          <p className="text-xs font-black uppercase italic tracking-tighter">Join the Legacy</p>
                          <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-relaxed">Sign in for early access and exclusive drops</p>
                        </div>
                        <Button 
                          onClick={() => { onAuthOpen?.(); setShowUserMenu(false); }}
                          className="w-full bg-brand-primary text-white hover:bg-gray-800 rounded-xl py-5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/10"
                        >
                          Sign In / Join
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Sheet>
              <SheetTrigger 
                render={
                  <Button id="shopping-bag-trigger" variant="ghost" size="icon" className="relative h-8 w-8 rounded-full hover:bg-white hover:shadow-sm transition-all">
                    <ShoppingBag className="w-4 h-4 text-gray-500" />
                    {itemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[7px] rounded-full w-3 h-3 flex items-center justify-center font-bold shadow-sm">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                }
              />
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="font-heading text-2xl uppercase tracking-wider">Your Bag</SheetTitle>
              </SheetHeader>
              
              <ScrollArea className="flex-1 px-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                    <ShoppingBag className="w-16 h-16 text-gray-200" />
                    <p className="text-gray-500 font-medium text-center px-8">
                      There are no items in your bag. Explore the latest drops and add your favorites.
                    </p>
                  </div>
                ) : (
                  <div className="py-6 space-y-6">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                              <p className="text-gray-500 text-xs mt-1">{item.category}</p>
                              <p className="text-gray-500 text-xs">Size: {item.selectedSize} | {item.selectedColor}</p>
                            </div>
                            <p className="font-bold text-sm">R{item.price}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded-full px-2 py-1">
                              <button 
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                className="p-1 hover:text-gray-500"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                className="p-1 hover:text-gray-500"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {cart.length > 0 && (
                <div className="p-6 border-t space-y-4 bg-gray-50/50">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">R{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Estimated Shipping & Handling</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>R{cartTotal}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={onCheckout}
                    className="w-full bg-brand-primary text-white hover:bg-gray-800 rounded-full py-6 font-bold text-base cursor-pointer"
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-left font-heading text-2xl uppercase italic tracking-tighter">THE FRESH LEGACY</SheetTitle>
                </SheetHeader>
                
                {/* Mobile Search */}
                <div className="p-6 border-b">
                   <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-100 border-none rounded-xl pl-10 py-6"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        {isSearching ? (
                          <Loader2 className="w-4 h-4 text-brand-accent animate-spin" />
                        ) : (
                          <Search className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                   </div>

                   <AnimatePresence>
                    {searchQuery.length >= 2 && suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-2 overflow-hidden"
                      >
                        {suggestions.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              onProductSelect?.(product);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all text-left border border-gray-50"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0">
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold truncate">{product.name}</p>
                              <p className="text-[9px] text-gray-500">R{product.price}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                   </AnimatePresence>
                </div>

                <div className="flex flex-col space-y-6 flex-1 p-6">
                  {navItems.map((item) => (
                    <div key={item.id} className="relative group">
                      <button
                        onClick={() => {
                          onCategoryChange?.(item.id);
                        }}
                        className={`text-3xl font-black italic tracking-tighter uppercase text-left w-full transition-all flex items-center justify-between ${
                          activeCategory === item.id ? 'text-brand-accent' : 'text-brand-primary hover:pl-4'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ArrowRight className={`w-6 h-6 opacity-0 -translate-x-4 transition-all ${activeCategory === item.id ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t p-6 space-y-6">
                  {user ? (
                    <>
                      <div 
                        onClick={() => { onProfileClick?.(); }}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-4 text-gray-500 font-bold uppercase tracking-widest text-xs group-hover:text-brand-primary">
                          <UserCircle className="w-5 h-5" />
                          <span>My Account</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                      <div 
                        onClick={() => { onWishlistClick?.(); }}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-4 text-gray-500 font-bold uppercase tracking-widest text-xs group-hover:text-brand-primary">
                          <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-brand-accent fill-brand-accent' : ''}`} />
                          <span>Favorites ({wishlist.length})</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </>
                  ) : (
                    <Button 
                      onClick={() => onAuthOpen?.()}
                      className="w-full bg-brand-primary text-white rounded-full py-6 font-bold uppercase text-sm"
                    >
                      Sign In / Join
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
