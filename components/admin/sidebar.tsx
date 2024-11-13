'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Tags,
  LogOut,
  Image
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const menuItems = [
  {
    href: '/admin',
    title: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    href: '/admin/products',
    title: 'Productos',
    icon: Package
  },
  {
    href: '/admin/users',
    title: 'Usuarios',
    icon: Users
  },
  {
    href: '/admin/categories',
    title: 'Categorías',
    icon: Tags
  },
  {
    href: '/admin/ads',
    title: 'Publicidad',
    icon: Image
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <div className="px-4 py-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Panel de Administración
            </h2>
          </div>
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-6 w-6" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 w-full rounded-md"
          >
            <LogOut className="mr-3 h-6 w-6" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}