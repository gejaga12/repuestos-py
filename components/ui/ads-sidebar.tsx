'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Advertisement } from '@/lib/types';

export function AdsSidebar() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsRef = collection(db, 'advertisements');
        const q = query(adsRef, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const adsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Advertisement[];
        setAds(adsData);
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading || ads.length === 0) return null;

  return (
    <div className="space-y-4">
      {ads.map((ad, index) => (
        <a
          key={ad.id}
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={index % 2 === 0 ? ad.largeImage : ad.smallImage}
            alt={ad.title}
            className="w-full rounded-lg shadow-sm hover:shadow-md transition-shadow"
          />
        </a>
      ))}
    </div>
  );
}