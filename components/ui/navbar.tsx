'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { 
  Menu, 
  ShoppingCart, 
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

export function Navbar() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Repuestos</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Inicio
              </Link>
              <Link 
                href="/products"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Productos
              </Link>
              <Link 
                href="/categories"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Categorías
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center">
            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
                >
                  <User className="h-6 w-6 text-gray-600" />
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {isMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {user ? (
                      <>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Panel de Admin
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mi Perfil
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mis Pedidos
                        </Link>
                        <button
                          onClick={() => {
                            // Handle logout
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Iniciar Sesión
                        </Link>
                        <Link
                          href="/auth/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Registrarse
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}