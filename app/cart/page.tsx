'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/ui/navbar';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping for now
  const total = subtotal + shipping;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return; // Maximum quantity limit
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      removeItem(itemId);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = '/auth/login?redirect=/cart';
      return;
    }

    setLoading(true);
    // Here you would implement your checkout logic
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Carrito vacío</h2>
            <p className="mt-1 text-sm text-gray-500">
              No hay productos en tu carrito de compras.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="p-6">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Condición: {item.condition === 'new' ? 'Nuevo' : 'Usado'}
                            </p>
                          </div>
                          <p className="text-lg font-medium text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-5 h-5 text-gray-500" />
                            </button>
                            <span className="text-gray-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={item.quantity >= 10}
                            >
                              <Plus className="w-5 h-5 text-gray-500" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Resumen del Pedido
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-medium text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Proceder al pago
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </div>
                  )}
                </button>

                <Link
                  href="/products"
                  className="block w-full text-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Continuar comprando
                </Link>

                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
                      clearCart();
                    }
                  }}
                  className="block w-full text-center px-6 py-3 text-sm text-red-600 hover:text-red-700"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}