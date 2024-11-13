'use client';

import { useEffect, useState } from 'react';
import { collection, query, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'published' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const productsSnap = await getDocs(productsRef);
      const productsData = productsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleStatusChange = async (productId: string, newStatus: Product['status'], rejectionReason?: string) => {
    try {
      const productRef = doc(db, 'products', productId);
      const updateData: Partial<Product> = { status: newStatus };
      
      if (newStatus === 'rejected' && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }

      await updateDoc(productRef, updateData);
      
      setProducts(products.map(p => 
        p.id === productId 
          ? { ...p, ...updateData }
          : p
      ));
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const filteredProducts = products.filter(product => 
    filter === 'all' ? true : product.status === filter
  );

  const StatusBadge = ({ status }: { status: Product['status'] }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const icons = {
      pending: <Clock className="w-4 h-4" />,
      published: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'pending', 'published', 'rejected'] as const).map((statusFilter) => (
          <button
            key={statusFilter}
            onClick={() => setFilter(statusFilter)}
            className={`px-4 py-2 rounded-md ${
              filter === statusFilter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {statusFilter === 'all' ? 'Todos' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.images[0]}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.brand} - {product.model}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(product.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {product.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(product.id, 'published')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            const reason = window.prompt('Motivo del rechazo:');
                            if (reason) {
                              handleStatusChange(product.id, 'rejected', reason);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}