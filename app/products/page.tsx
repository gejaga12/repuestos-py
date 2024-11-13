'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Category } from '@/lib/types';
import { Navbar } from '@/components/ui/navbar';
import { ProductCard } from '@/components/ui/product-card';
import { SearchBar } from '@/components/ui/search-bar';
import { Sliders, ChevronDown } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    condition: '',
    priceRange: '',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('status', '==', 'published'));
      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);

      // Extract unique brands
      const uniqueBrands = Array.from(new Set(productsData.map(p => p.brand))).sort();
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterProducts = (products: Product[]) => {
    return products.filter(product => {
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesBrand = !filters.brand || product.brand === filters.brand;
      const matchesCondition = !filters.condition || product.condition === filters.condition;
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());
      
      let matchesPrice = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        matchesPrice = product.price >= min && (!max || product.price <= max);
      }

      return matchesCategory && matchesBrand && matchesCondition && matchesSearch && matchesPrice;
    });
  };

  const filteredProducts = filterProducts(products);

  const priceRanges = [
    { label: 'Todos los precios', value: '' },
    { label: 'Hasta 500.000 Gs.', value: '0-500000' },
    { label: '500.000 - 2.000.000 Gs.', value: '500000-2000000' },
    { label: '2.000.000 - 5.000.000 Gs.', value: '2000000-5000000' },
    { label: 'Más de 5.000.000 Gs.', value: '5000000-' }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Productos</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar 
                placeholder="Buscar productos..."
                value={filters.search}
                onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
              />
            </div>
            <button
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
            >
              <Sliders className="w-5 h-5" />
              Filtros
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="hidden md:block w-64 space-y-6">
            {/* Categories Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Categorías</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Todas las categorías</span>
                </label>
                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={filters.category === category.id}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Marcas</h3>
              <select
                value={filters.brand}
                onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todas las marcas</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Condición</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value=""
                    checked={filters.condition === ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Todos</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value="new"
                    checked={filters.condition === 'new'}
                    onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Nuevo</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value="used"
                    checked={filters.condition === 'used'}
                    onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Usado</span>
                </label>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Rango de Precio</h3>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={filters.priceRange === range.value}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0]}
                  condition={product.condition}
                  discount={0}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con los filtros seleccionados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}