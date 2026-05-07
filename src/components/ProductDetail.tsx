import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Star, 
  ChevronRight,
  ShieldCheck,
  Truck,
  Check
} from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/CartContext';
import { useWishlist } from '@/WishlistContext';
import { useAuth } from '@/AuthContext';
import SizeRecommender from './SizeRecommender';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, loginWithGoogle } = useAuth();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (!user) {
      loginWithGoogle();
      return;
    }
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  // Animation state
  const [flyingImage, setFlyingImage] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleColorChange = (color: string, index: number) => {
    setSelectedColor(color);
    if (index < product.images.length) {
      setSelectedImage(index);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    // Trigger flying animation
    const imageElement = imageRef.current;
    const cartIconElement = document.getElementById('shopping-bag-trigger');
    
    if (imageElement && cartIconElement) {
      const imgRect = imageElement.getBoundingClientRect();
      const cartRect = cartIconElement.getBoundingClientRect();
      
      setFlyingImage({
        x: imgRect.left,
        y: imgRect.top,
        width: imgRect.width,
        height: imgRect.height,
      });

      // Animate and then actual add to cart
      setIsAdding(true);
      
      setTimeout(() => {
        addToCart(product, selectedSize, selectedColor);
        setIsAdding(false);
        setIsAdded(true);
        setFlyingImage(null);
        setTimeout(() => setIsAdded(false), 2000);
      }, 800); // Increased slightly for animation visibility
    } else {
      // Fallback if elements not found
      addToCart(product, selectedSize, selectedColor);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Flying Image Animation Layer */}
      <AnimatePresence>
        {flyingImage && (
          <motion.div
            initial={{ 
              left: flyingImage.x, 
              top: flyingImage.y, 
              width: flyingImage.width, 
              height: flyingImage.height,
              opacity: 0.8,
              scale: 1,
              borderRadius: "12px",
              zIndex: 9999,
              position: 'fixed'
            }}
            animate={{ 
              left: document.getElementById('shopping-bag-trigger')?.getBoundingClientRect().left ?? 0, 
              top: document.getElementById('shopping-bag-trigger')?.getBoundingClientRect().top ?? 0,
              width: 20, 
              height: 20,
              opacity: 0,
              scale: 0.2,
              borderRadius: "100%"
            }}
            transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
            className="pointer-events-none overflow-hidden"
          >
            <img 
              src={product.images[selectedImage] || product.images[0]} 
              className="w-full h-full object-cover"
              alt="flying"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="tfl-container h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 hover:text-gray-500 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to All Shoes</span>
          </button>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleWishlistToggle}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon"><Share2 className="w-5 h-5" /></Button>
          </div>
        </div>
      </div>

      <div className="tfl-container pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden">
              <motion.img
                ref={imageRef}
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-brand-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {product.isNew && <Badge className="bg-brand-accent text-white border-none">New Release</Badge>}
                {product.isMemberExclusive && <Badge variant="outline" className="border-brand-primary">Member Exclusive</Badge>}
              </div>
              
              <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl leading-tight">{product.name}</h1>
                <p className="text-lg font-medium text-gray-700">{product.category}</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-2xl font-bold">R{product.price}</span>
                <div className="flex items-center gap-1 text-sm font-bold">
                  <Star className="w-4 h-4 fill-brand-primary" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-medium">({product.reviewCount} Reviews)</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Color Swatches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Select Color</h3>
                <span className="text-sm text-gray-500 font-medium">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color, idx)}
                    className={`group relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedColor === color ? 'border-brand-primary shadow-md' : 'border-gray-100 hover:border-gray-300'
                    }`}
                    title={color}
                  >
                    <img 
                      src={product.images[idx % product.images.length]} 
                      alt={color} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {selectedColor === color && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Size Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Select Size (US)</h3>
                <SizeRecommender productName={product.name} />
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 border rounded-md font-bold text-sm transition-all ${
                      selectedSize === size 
                        ? 'bg-brand-primary text-white border-brand-primary' 
                        : 'border-gray-200 hover:border-brand-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 font-medium italic">
                Free Delivery & Returns for Members.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button 
                className={`w-full h-16 rounded-full text-lg font-bold transition-all ${
                  isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-primary hover:bg-gray-800'
                } text-white`}
                disabled={!selectedSize || isAdding}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Added to Bag</span>
                ) : isAdding ? (
                  "Adding..."
                ) : selectedSize ? (
                  `Add to Bag - Size ${selectedSize}`
                ) : (
                  'Select a size'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleWishlistToggle}
                className={`w-full border-brand-primary h-16 rounded-full text-lg font-bold transition-all ${isFavorite ? 'bg-red-50 border-red-200 text-red-600' : 'text-brand-primary hover:bg-gray-50'}`}
              >
                {isFavorite ? 'Favorited' : 'Favorite'} <Heart className={`ml-2 w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} />
              </Button>
            </div>

            <Separator />

            {/* Description & Details */}
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-widest text-xs text-gray-500">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
              
              <div className="grid grid-cols-1 gap-4 pt-4">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Truck className="w-5 h-5" />
                  <span>Free standard shipping with Member rewards.</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <ShieldCheck className="w-5 h-5" />
                  <span>60-day returns period. No questions asked.</span>
                </div>
              </div>
            </div>

            {/* Collapsible Details (Manual since we didn't add Accordion) */}
            <div className="border-t border-b py-4 flex items-center justify-between cursor-pointer group">
              <span className="font-bold">Shipping & Returns</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="border-b py-4 flex items-center justify-between cursor-pointer group">
              <span className="font-bold">Reviews ({product.reviewCount})</span>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= Math.floor(product.rating || 0) ? 'fill-brand-primary' : 'text-gray-300'}`} />)}
                </div>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
