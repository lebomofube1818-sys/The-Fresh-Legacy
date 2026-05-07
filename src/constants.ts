import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Air Jordan 1 Retro High OG',
    category: 'Men\'s Shoes',
    price: 3699,
    description: 'Familiar but always fresh, the iconic Air Jordan 1 is remastered for today\'s sneakerhead culture. This Retro High OG edition features premium leather, comfortable cushioning and classic design details.',
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80'
    ],
    colors: ['Black/University Red/White', 'White/Black/Royal'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    gender: 'men',
    sport: 'lifestyle',
    isNew: true,
    rating: 4.8,
    reviewCount: 1250
  },
  {
    id: '2',
    name: 'Fresh Legacy Pegasus 41',
    category: 'Running Shoes',
    price: 2799,
    description: 'Responsive cushioning in the Pegasus provides an energized ride for everyday road running. Experience lighter-weight energy return with dual Air Zoom units and a ReactX foam midsole.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'
    ],
    colors: ['Volt/Black/White', 'Racer Blue/White'],
    sizes: ['6', '7', '8', '9', '10', '11', '12', '13'],
    gender: 'unisex',
    sport: 'running',
    isNew: true,
    rating: 4.5,
    reviewCount: 840
  },
  {
    id: '3',
    name: 'Fresh Legacy Metcon 9',
    category: 'Training Shoes',
    price: 3199,
    description: 'Whatever your "why" is for working out, the Metcon 9 makes it all worth it. We improved on the 8 with a larger Hyperlift plate and added rubber rope wrap.',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'
    ],
    colors: ['Anthracite/Black', 'White/Gum Medium Brown'],
    sizes: ['8', '9', '10', '11', '12'],
    gender: 'men',
    sport: 'training',
    isSale: true,
    rating: 4.7,
    reviewCount: 520
  },
  {
    id: '4',
    name: 'Fresh Legacy Dunk Low',
    category: 'Women\'s Shoes',
    price: 2199,
    description: 'Created for the hardwood but taken to the streets, the Fresh Legacy Dunk Low returns with crisp overlays and original varsity colors. This basketball icon channels \'80s vibes.',
    images: [
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80'
    ],
    colors: ['White/Black', 'Panda'],
    sizes: ['5', '6', '7', '8', '9'],
    gender: 'women',
    sport: 'lifestyle',
    isMemberExclusive: true,
    rating: 4.9,
    reviewCount: 2400
  },
  {
    id: '5',
    name: 'LeBron XXI "Dragon Pearl"',
    category: 'Basketball Shoes',
    price: 3999,
    description: 'The LeBron XXI has a cabling system that works with Zoom Air cushioning and a light, low-to-the-ground design, giving you agile fluidity and explosiveness.',
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80'
    ],
    colors: ['Multi-color'],
    sizes: ['9', '10', '11', '12', '13', '14'],
    gender: 'men',
    sport: 'basketball',
    isNew: true,
    rating: 4.6,
    reviewCount: 180
  },
  {
    id: '6',
    name: 'Fresh Legacy Air Max DN',
    category: 'Lifestyle Shoes',
    price: 3399,
    description: 'Say hello to the next generation of Air technology. The Air Max Dn features our Dynamic Air unit system of dual-pressure tubes, creating a reactive sensation with every step.',
    images: [
      'https://images.unsplash.com/photo-1605405748313-a416a1b84491?w=800&q=80'
    ],
    colors: ['All Night', 'All Day'],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    gender: 'unisex',
    sport: 'lifestyle',
    isNew: true,
    rating: 4.4,
    reviewCount: 450
  },
  {
    id: '7',
    name: 'Fresh Legacy Air Force 1 LV8',
    category: 'Older Kids\' Shoes',
    price: 1899,
    description: 'The Fresh Legacy Air Force 1 LV8 is a hoops icon that still rules the playground. Durable leather and soft foam cushioning give you everything you need for all-day play.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'
    ],
    colors: ['White/University Red', 'Black/White'],
    sizes: ['3Y', '4Y', '5Y', '6Y', '7Y'],
    gender: 'kids',
    sport: 'lifestyle',
    isNew: true,
    rating: 4.7,
    reviewCount: 320
  },
  {
    id: '8',
    name: 'Fresh Legacy Zoom Vomero 5',
    category: 'Men\'s Shoes',
    price: 2999,
    description: 'Carve a new lane for yourself in the Zoom Vomero 5—your go-to for complexity, depth and now, easy styling. The richly layered design includes textiles, synthetic suede and plastic accents.',
    images: [
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80'
    ],
    colors: ['Photon Dust/Royal Pulse'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    gender: 'men',
    sport: 'lifestyle',
    isSale: true,
    rating: 4.8,
    reviewCount: 1100
  },
  {
    id: '9',
    name: 'Fresh Legacy Air Max 270',
    category: 'Women\'s Shoes',
    price: 3299,
    description: 'Fresh Legacy\'s first lifestyle Air Max brings you style, comfort and big attitude in the Fresh Legacy Air Max 270. The design draws inspiration from Air Max icons, showcasing Fresh Legacy\'s greatest innovation with its large window and fresh array of colors.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
    ],
    colors: ['White/Black/Dusty Cactus'],
    sizes: ['5', '6', '7', '8', '9'],
    gender: 'women',
    sport: 'lifestyle',
    isNew: false,
    rating: 4.8,
    reviewCount: 2400
  },
  {
    id: '10',
    name: 'Fresh Legacy Metcon 9',
    category: 'Men\'s Workout Shoes',
    price: 3199,
    description: 'Whatever your "why" is for working out, the Metcon 9 makes it all worth it. We improved on the 8 with a larger Hyperlift plate and added rubber rope wrap. Some of the greatest athletes in the world swear by it.',
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80'
    ],
    colors: ['Black/Anthracite'],
    sizes: ['8', '9', '10', '11', '12'],
    gender: 'men',
    sport: 'training',
    isNew: true,
    rating: 4.6,
    reviewCount: 150
  },
  {
    id: '11',
    name: 'Fresh Legacy Alate All Day',
    category: 'Women\'s Sports Bra',
    price: 899,
    description: 'Move through your day with confidence in this Alate All Day bra. With lightweight, breathable fabric and a design that feels like part of you, it provides the support you need for your yoga flow or a light workout.',
    images: [
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80'
    ],
    colors: ['Black', 'Soft Pink'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    gender: 'women',
    sport: 'training',
    isNew: true,
    rating: 4.5,
    reviewCount: 85
  },
  {
    id: '12',
    name: 'Fresh Legacy Dunk Low Retro',
    category: 'Men\'s Shoes',
    price: 2299,
    description: 'Created for the hardwood but taken to the streets, the \'80s b-ball icon returns with perfectly sheened overlays and original university colors.',
    images: [
      'https://images.unsplash.com/photo-1620138546344-7b2c08517ed5?w=800&q=80'
    ],
    colors: ['Black/White', 'Varsity Red/White'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    gender: 'men',
    sport: 'lifestyle',
    isSale: true,
    rating: 4.9,
    reviewCount: 5200
  }
];
