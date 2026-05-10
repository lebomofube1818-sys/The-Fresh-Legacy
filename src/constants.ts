export const AFRICAN_COUNTRIES = [
  { name: 'Lesotho', code: '+266', flag: '🇱🇸' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'Botswana', code: '+267', flag: '🇧🇼' },
  { name: 'Namibia', code: '+264', flag: '🇳🇦' },
  { name: 'Zimbabwe', code: '+263', flag: '🇿🇼' },
  { name: 'Mozambique', code: '+258', flag: '🇲🇿' },
  { name: 'Eswatini', code: '+268', flag: '🇸🇿' },
  { name: 'Angola', code: '+244', flag: '🇦🇴' },
  { name: 'Zambia', code: '+260', flag: '🇿🇲' },
  { name: 'Malawi', code: '+265', flag: '🇲🇼' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭' },
  { name: 'Ethiopia', code: '+251', flag: '🇪🇹' },
  { name: 'Egypt', code: '+20', flag: '🇪🇬' },
  { name: 'Morocco', code: '+212', flag: '🇲🇦' },
  { name: 'Algeria', code: '+213', flag: '🇩🇿' },
  { name: 'Tunisia', code: '+216', flag: '🇹🇳' },
  { name: 'Senegal', code: '+221', flag: '🇸🇳' },
  { name: 'Ivory Coast', code: '+225', flag: '🇨🇮' },
  { name: 'Cameroon', code: '+237', flag: '🇨🇲' },
  { name: 'Uganda', code: '+256', flag: '🇺🇬' },
  { name: 'Tanzania', code: '+255', flag: '🇹🇿' },
  { name: 'Rwanda', code: '+250', flag: '🇷🇼' },
];

import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Legacy Elite Runner X1',
    category: 'Running Shoes',
    price: 1899,
    description: 'Engineered for the elite athlete. Featuring Aura-Tech cushioning for maximum energy return and a lightweight breathable mesh upper.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'
    ],
    colors: ['Onyx Black', 'Volt Green', 'Classic White'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    gender: 'unisex',
    sport: 'running',
    isNew: true,
    rating: 4.8,
    reviewCount: 124,
    stockCount: 50
  },
  {
    id: 'prod-2',
    name: 'Aura Street Low-Top',
    category: 'Lifestyle Shoes',
    price: 1450,
    description: 'Iconic street silhouette redesigned for today. Premium leather construction with a vintage soul.',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      'https://images.unsplash.com/photo-1512374382149-4332c6c02151?w=800&q=80'
    ],
    colors: ['Midnight Navy', 'Cloud Grey'],
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    gender: 'unisex',
    sport: 'lifestyle',
    isNew: true,
    rating: 4.9,
    reviewCount: 350,
    stockCount: 35
  },
  {
    id: 'prod-3',
    name: 'Vanguard Basketball High',
    category: 'Basketball Shoes',
    price: 2100,
    description: 'Dominance redefined. The Vanguard offers superior ankle support and traction for the most explosive playmakers.',
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80'
    ],
    colors: ['Legacy Red', 'Phantom Black'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12', 'US 13'],
    gender: 'men',
    sport: 'basketball',
    isNew: false,
    rating: 4.7,
    reviewCount: 89,
    stockCount: 12
  },
  {
    id: 'prod-4',
    name: 'Heritage Windrunner',
    category: 'Outerwear',
    price: 950,
    description: 'A classic aesthetic meets modern weather protection. Lightweight, water-resistant, and iconic.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
    ],
    colors: ['Obsidian', 'White/Red'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    gender: 'unisex',
    sport: 'lifestyle',
    isSale: true,
    rating: 4.6,
    reviewCount: 56,
    stockCount: 100
  },
  {
    id: 'prod-5',
    name: 'Aura Training Tight',
    category: 'Training Apparel',
    price: 650,
    description: 'Compression fit with sweat-wicking technology. Designed to move with you during your most intense sessions.',
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80'
    ],
    colors: ['Black Metallic', 'Electric Purple'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    gender: 'women',
    sport: 'training',
    isNew: true,
    rating: 4.9,
    reviewCount: 210,
    stockCount: 80
  }
];
