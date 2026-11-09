export interface Product {
  id: number
  name: string
  category: string
  description: string
  specification: string
  rating: number
  price: number
  quantity: number
  image: string
}

export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    description: 'High-quality wireless headphones with clear sound and comfortable ear cushions.',
    specification: 'Bluetooth 5.0, 20-hour battery life, noise isolation',
    rating: 4.8,
    price: 1499,
    quantity: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
  },
  {
    id: 2,
    name: 'Smart Watch',
    category: 'Accessories',
    description: 'A stylish smartwatch for tracking daily activities and notifications.',
    specification: 'Heart rate monitor, fitness tracking, water resistant',
    rating: 4.5,
    price: 2299,
    quantity: 8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
  },
  {
    id: 3,
    name: 'Running Shoes',
    category: 'Fashion',
    description: 'Lightweight running shoes designed for comfort and everyday exercise.',
    specification: 'Breathable mesh, rubber sole, lightweight design',
    rating: 4.7,
    price: 1899,
    quantity: 42,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  },
  {
    id: 4,
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    description: 'Portable speaker that delivers clear audio for indoor and outdoor use.',
    specification: 'Bluetooth connectivity, rechargeable battery, portable design',
    rating: 4.6,
    price: 999,
    quantity: 5,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
  },
  {
    id: 5,
    name: 'Backpack',
    category: 'Accessories',
    description: 'A durable backpack suitable for school, travel, and everyday use.',
    specification: 'Water-resistant material, multiple compartments',
    rating: 4.4,
    price: 1299,
    quantity: 15,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
  },
  {
    id: 6,
    name: 'Sunglasses',
    category: 'Fashion',
    description: 'Modern sunglasses designed to provide style and protection from sunlight.',
    specification: 'UV protection, lightweight frame, durable lenses',
    rating: 4.3,
    price: 799,
    quantity: 30,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600',
  },
]