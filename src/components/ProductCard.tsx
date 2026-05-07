import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/WishlistContext';
import { useAuth } from '@/AuthContext';
import { useCart } from '@/CartContext';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, loginWithGoogle } = useAuth();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const isFavorite = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default size and color
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || 'Default';
    
    addToCart(product, defaultSize, defaultColor);
    setIsAdded(true);
    
    // Reset feedback after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => onClick?.(product)}
    >
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-4 rounded-md">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-brand-accent text-white border-none font-bold px-3">
              New
            </Badge>
          )}
          {product.isSale && (
            <Badge className="bg-red-600 text-white border-none font-bold px-3">
              Sale
            </Badge>
          )}
          {product.isMemberExclusive && (
            <Badge className="bg-brand-primary text-white border-none font-bold px-3">
              Member Exclusive
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={handleQuickAdd}
            disabled={isAdded}
            className={`p-3 rounded-full shadow-lg transition-all transform active:scale-95 ${isAdded ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-100'}`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Plus className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        <button 
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors z-10"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="font-geometric font-bold text-base leading-tight group-hover:underline">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm">{product.category}</p>
        <p className="text-gray-500 text-sm">{product.colors.length} Colors</p>
        <div className="pt-2 flex items-center gap-2">
          <span className={`font-bold text-base ${product.isSale ? 'text-red-600' : 'text-brand-primary'}`}>
            R{product.price}
          </span>
          {product.isSale && (
            <span className="text-gray-400 line-through text-sm font-medium">
              R{Math.round(product.price * 1.25)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
