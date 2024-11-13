'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  condition: 'new' | 'used';
  discount?: number;
}

export function ProductCard({ id, name, price, image, condition, discount = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  const finalPrice = price - (price * (discount / 100));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addItem({
      id,
      name,
      price: finalPrice,
      image,
      condition,
      quantity: 1
    } as any);
  };

  return (
    <Link href={`/products/${id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
        <div className="relative aspect-w-1 aspect-h-1">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              -{discount}%
            </div>
          )}
          {condition === 'new' && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              Nuevo
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{name}</h3>
          
          <div className="flex items-center justify-between">
            <div>
              {discount > 0 && (
                <span className="text-sm text-gray-500 line-through mr-2">
                  {formatCurrency(price)}
                </span>
              )}
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(finalPrice)}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}