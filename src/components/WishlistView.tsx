import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '@/WishlistContext';
import { useCart } from '@/CartContext';
import { MOCK_PRODUCTS } from '@/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WishlistViewProps {
  onBack: () => void;
  onProductClick: (product: any) => void;
}

export default function WishlistView({ onBack, onProductClick }: WishlistViewProps) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Resolve product IDs to full product objects
  const wishlistProducts = MOCK_PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="tfl-container">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="mb-12">
          <div className="flex items-end gap-4 mb-2">
            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Wishlist</h1>
            <span className="text-2xl font-bold text-gray-300 uppercase italic tracking-tighter mb-1">({wishlistProducts.length})</span>
          </div>
          <p className="text-gray-500 font-medium">Items you've saved for later. Your legacy, curated.</p>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {wishlistProducts.map((product) => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group relative"
              >
                <div 
                  className="relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden mb-6 cursor-pointer"
                  onClick={() => onProductClick(product)}
                >
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  
                  {product.isNew && (
                    <Badge className="absolute top-4 left-4 bg-brand-primary text-white hover:bg-brand-primary px-3 py-1 rounded-full border-none text-[10px] uppercase font-black italic tracking-wider">
                      New Drop
                    </Badge>
                  )}

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full text-red-500 hover:text-red-600 hover:bg-white transition-all shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, product.sizes[0] || 'M', product.colors[0] || 'Default');
                      }}
                      className="w-full bg-white text-black hover:bg-black hover:text-white rounded-full py-6 font-bold uppercase text-xs shadow-2xl"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" /> Quick Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg uppercase italic tracking-tighter leading-tight group-hover:text-brand-accent transition-colors">{product.name}</h3>
                    <p className="font-bold text-lg">R{product.price}</p>
                  </div>
                  <p className="text-gray-500 text-xs font-medium">{product.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <Heart className="w-16 h-16 mx-auto text-gray-200 mb-6" />
            <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 font-medium mb-8">Save items you love to keep track of them.</p>
            <Button onClick={onBack} className="bg-brand-primary text-white rounded-full px-10 py-6 font-bold uppercase">Explore Drops</Button>
          </div>
        )}
      </div>
    </div>
  );
}
