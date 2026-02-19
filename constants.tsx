
import { Post, Product, Job, Rental, User } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Alex Johnson',
  handle: '@alexj',
  avatar: 'https://picsum.photos/seed/alex/150/150'
};

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    user: { id: 'u1', name: 'Sarah Chen', handle: '@sarahc', avatar: 'https://picsum.photos/seed/sarah/150/150' },
    content: 'Just tried the new coffee shop in BGC! Their Spanish Latte is a must-try. ☕️✨ #BGCeats',
    image: 'https://picsum.photos/seed/coffee/600/400',
    likes: 124,
    comments: 18,
    timestamp: '2h ago'
  },
  {
    id: '2',
    user: { id: 'u2', name: 'Mike Ross', handle: '@miker', avatar: 'https://picsum.photos/seed/mike/150/150' },
    content: 'Looking for a freelance React developer for a startup project in Makati. DM me if interested! 🇵🇭',
    likes: 56,
    comments: 42,
    timestamp: '5h ago'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Wireless Noise Cancelling Headphones', 
    price: 12499, 
    image: 'https://picsum.photos/seed/tech/300/300', 
    rating: 4.8, 
    soldCount: 1200, 
    category: 'Electronics',
    location: 'Makati City',
    link: 'https://sony.com.ph'
  },
  { 
    id: 'p2', 
    name: 'Ergonomic Office Chair', 
    price: 8500, 
    image: 'https://picsum.photos/seed/furniture/300/300', 
    rating: 4.5, 
    soldCount: 450, 
    category: 'Home Office',
    location: 'Quezon City',
    link: 'https://furnitureworld.ph'
  },
  { 
    id: 'p3', 
    name: 'Smart Fitness Watch Pro', 
    price: 5990, 
    image: 'https://picsum.photos/seed/watch/300/300', 
    rating: 4.9, 
    soldCount: 890, 
    category: 'Electronics',
    location: 'BGC, Taguig',
    link: 'https://smartwatch.ph'
  },
  { 
    id: 'p4', 
    name: 'Custom Mechanical Keyboard', 
    price: 4200, 
    image: 'https://picsum.photos/seed/kb/300/300', 
    rating: 4.7, 
    soldCount: 620, 
    category: 'Gadgets',
    location: 'Mandaluyong',
    link: 'https://keychron.ph'
  }
];

export const MOCK_JOBS: Job[] = [
  { id: 'j1', title: 'Senior Frontend Engineer', company: 'TechFlow PH', location: 'Makati City / Hybrid', salary: '₱120,000 - ₱180,000', logo: 'https://picsum.photos/seed/tf/100/100', type: 'Full-time' },
  { id: 'j2', title: 'UX/UI Designer', company: 'CreativeLabs Manila', location: 'BGC, Taguig', salary: '₱65,000 - ₱90,000', logo: 'https://picsum.photos/seed/cl/100/100', type: 'Full-time' }
];

export const MOCK_RENTALS: Rental[] = [
  { id: 'r1', title: 'Modern Studio in Salcedo Village', price: 3500, rating: 4.9, image: 'https://picsum.photos/seed/apt1/400/300', location: 'Makati City', type: 'Entire Condo' },
  { id: 'r2', title: 'Staycation Suite near SM Blue', price: 2200, rating: 4.7, image: 'https://picsum.photos/seed/apt2/400/300', location: 'Quezon City', type: 'Entire Unit' }
];
