'use client';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'auto' | 'moto';
  description?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryType: 'auto' | 'moto';
  brand: string;
  model: string;
  condition: 'new' | 'used';
  images: string[];
  status: 'pending' | 'published' | 'rejected';
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Advertisement {
  id: string;
  title: string;
  url: string;
  largeImage: string;
  smallImage: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}