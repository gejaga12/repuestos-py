import { Suspense } from 'react';
import { Navbar } from '@/components/ui/navbar';
import { ProductCard } from '@/components/ui/product-card';
import { CategoryCard } from '@/components/ui/category-card';
import { AdsSidebar } from '@/components/ui/ads-sidebar';
import { SearchBar } from '@/components/ui/search-bar';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <main className="bg-gray-50 min-h-screen">
        <Navbar />
        
        {/* Hero Banner with Search */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 flex-1">
                <h1 className="text-4xl font-bold">Repuestos Garantizados</h1>
                <p className="text-xl">Los mejores precios en repuestos usados</p>
                <div className="max-w-xl">
                  <SearchBar placeholder="Buscar productos, marcas o categorías..." />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=300&fit=crop" 
                alt="Auto Parts"
                className="rounded-lg shadow-lg hidden md:block w-1/3"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Quick Access Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <QuickAccessCard
                  icon="🚗"
                  title="Envío gratis"
                  description="En miles de productos"
                />
                <QuickAccessCard
                  icon="💳"
                  title="Pago seguro"
                  description="Múltiples medios de pago"
                />
                <QuickAccessCard
                  icon="🔧"
                  title="Garantía"
                  description="Productos verificados"
                />
                <QuickAccessCard
                  icon="📦"
                  title="Devolución gratis"
                  description="30 días de garantía"
                />
              </div>

              {/* Featured Categories */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Categorías Principales</h2>
                  <Link href="/categories" className="text-blue-600 hover:text-blue-700 font-medium">
                    Ver todas
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <CategoryCard
                    title="Motores"
                    image="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300"
                    href="/category/engines"
                  />
                  <CategoryCard
                    title="Transmisión"
                    image="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300"
                    href="/category/transmission"
                  />
                  <CategoryCard
                    title="Suspensión"
                    image="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300"
                    href="/category/suspension"
                  />
                  <CategoryCard
                    title="Frenos"
                    image="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300"
                    href="/category/brakes"
                  />
                </div>
              </div>

              {/* Featured Products */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Productos Destacados</h2>
                  <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
                    Ver todos
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ProductCard
                    id="1"
                    name="Motor Completo Toyota Corolla 2018"
                    price={2500000}
                    image="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300"
                    condition="used"
                    discount={10}
                  />
                  <ProductCard
                    id="2"
                    name="Caja de Cambios Honda Civic 2019"
                    price={1800000}
                    image="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300"
                    condition="used"
                    discount={15}
                  />
                  <ProductCard
                    id="3"
                    name="Kit de Embrague VW Golf 2020"
                    price={450000}
                    image="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300"
                    condition="new"
                    discount={5}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar with Ads */}
            <aside className="lg:w-80 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Filtrar por Categoría</h3>
                <div className="space-y-2">
                  <Link href="/category/engines" className="block text-gray-600 hover:text-blue-600">
                    Motores
                  </Link>
                  <Link href="/category/transmission" className="block text-gray-600 hover:text-blue-600">
                    Transmisión
                  </Link>
                  <Link href="/category/suspension" className="block text-gray-600 hover:text-blue-600">
                    Suspensión
                  </Link>
                  <Link href="/category/brakes" className="block text-gray-600 hover:text-blue-600">
                    Frenos
                  </Link>
                </div>
              </div>
              
              <AdsSidebar />
            </aside>
          </div>
        </div>
      </main>
    </Suspense>
  );
}

function QuickAccessCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}