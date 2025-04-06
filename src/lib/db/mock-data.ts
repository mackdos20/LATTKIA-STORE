import { Category, Product, Order, User, Subcategory } from './models';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Landscapes',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
    slug: 'landscapes'
  },
  {
    id: '2',
    name: 'Portraits',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
    slug: 'portraits'
  },
  {
    id: '3',
    name: 'Street',
    image: 'https://images.unsplash.com/photo-1519575706483-221027bfbb31?q=80&w=2071&auto=format&fit=crop',
    slug: 'street'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Mountain Sunrise',
    description: 'Beautiful mountain landscape at sunrise with vibrant colors',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    categoryId: '1',
    featured: true,
    stock: 10,
    discounts: [
      { quantity: 3, discount: 10 },
      { quantity: 5, discount: 15 }
    ]
  },
  {
    id: '2',
    name: 'Ocean Waves',
    description: 'Dramatic ocean waves crashing against the shore',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop',
    categoryId: '1',
    featured: true,
    stock: 15,
    discounts: [
      { quantity: 3, discount: 10 }
    ]
  },
  {
    id: '3',
    name: 'Portrait Study',
    description: 'Professional portrait with dramatic lighting',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop',
    categoryId: '2',
    featured: true,
    stock: 5,
    discounts: []
  },
  {
    id: '4',
    name: 'City Life',
    description: 'Urban street photography capturing the essence of city life',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?q=80&w=1990&auto=format&fit=crop',
    categoryId: '3',
    featured: true,
    stock: 8,
    discounts: [
      { quantity: 2, discount: 5 },
      { quantity: 4, discount: 12 }
    ]
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    items: [
      {
        productId: '1',
        name: 'Mountain Sunrise',
        price: 199.99,
        quantity: 1
      }
    ],
    total: 199.99,
    status: 'delivered',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-18T14:20:00Z',
    expectedDeliveryTime: '2023-05-18T12:00:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    phone: '123-456-7890'
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user'
  }
];