import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from './types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('nike_shopping_bag');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('nike_shopping_bag', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, size: string, color: string) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }

      return [...prev, { ...product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart((prev) => prev.filter(
      (item) => !(item.id === id && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const updateQuantity = (id: string, size: string, color: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => 
      prev.map((item) => 
        (item.id === id && item.selectedSize === size && item.selectedColor === color)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal, 
      itemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
