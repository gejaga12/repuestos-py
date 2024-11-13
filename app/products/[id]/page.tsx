'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import { Navbar } from '@/components/ui/navbar';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          // If no product is found, set a mock product for testing
          setProduct({
            id: '1',
            name: 'Motor Completo Toyota Corolla 2018',
            description: 'Motor completo en excelente estado, con 80,000 km. Incluye todos los componentes y accesorios originales. Garantía de 6 meses por defectos.',
            price: 2500000,
            category: 'engines',
            categoryType: 'auto',
            brand: 'Toyota',
            model: 'Corolla 2018',
            condition: 'used',
            images: [
              'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800',
              'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800',
              'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800'
            ],
            status: 'published',
            sellerId: '1',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600">Producto no encontrado</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - imagen ${index + 1}`}
                      className="w-full h-full object-center object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center justify-between">
              <p className="text-3xl text-gray-900 font-semibold">
                {formatCurrency(product.price)}
              </p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.condition === 'new' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {product.condition === 'new' ? 'Nuevo' : 'Usado'}
              </span>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Categoría</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Marca</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.brand}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Modelo</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.model}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900">Descripción</h3>
              <div className="mt-2 prose prose-sm text-gray-500">
                {product.description}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}