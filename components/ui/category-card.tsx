'use client';

import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
}

export function CategoryCard({ title, image, href }: CategoryCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-0 left-0 right-0 p-4 text-white font-medium text-lg">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}