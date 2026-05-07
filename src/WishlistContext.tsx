import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { useAuth } from './AuthContext';
import { Product } from './types';

interface WishlistContextType {
  wishlist: string[]; // List of product IDs
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const wishlistPath = `wishlists/${user.uid}/items`;
    const q = query(collection(db, wishlistPath));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.id);
      setWishlist(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, wishlistPath);
    });

    return () => unsubscribe();
  }, [user]);

  const addToWishlist = async (product: Product) => {
    if (!user) return;
    const path = `wishlists/${user.uid}/items/${product.id}`;
    try {
      await setDoc(doc(db, path), {
        productId: product.id,
        userId: user.uid,
        name: product.name,
        price: product.price,
        image: product.images[0],
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    const path = `wishlists/${user.uid}/items/${productId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
