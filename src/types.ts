export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  gender: 'men' | 'women' | 'kids' | 'unisex';
  sport: 'lifestyle' | 'running' | 'basketball' | 'training';
  isNew?: boolean;
  isSale?: boolean;
  isMemberExclusive?: boolean;
  rating?: number;
  reviewCount?: number;
  stockCount: number;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface UserSizeProfile {
  height?: number; // cm
  weight?: number; // kg
  footWidth?: 'narrow' | 'standard' | 'wide';
  preferredFit?: 'tight' | 'standard' | 'loose';
}
