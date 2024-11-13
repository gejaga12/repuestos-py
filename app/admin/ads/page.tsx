'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Advertisement } from '@/lib/types';
import { Loader2, Plus, Edit2, Trash2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

const MAX_ADS = 5;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ImageDimensions {
  width: number;
  height: number;
}

export default function AdvertisingManagement() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentAd, setCurrentAd] = useState<Partial<Advertisement> | null>(null);
  const [largeImageFile, setLargeImageFile] = useState<File | null>(null);
  const [smallImageFile, setSmallImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const adsRef = collection(db, 'advertisements');
      const q = query(adsRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const adsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Advertisement[];
      setAds(adsData);
    } catch (error) {
      console.error('Error fetching ads:', error);
      setError('Error al cargar las publicidades');
    } finally {
      setLoading(false);
    }
  };

  const validateImage = async (file: File, expectedDimensions: ImageDimensions): Promise<boolean> => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG y WebP.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('El archivo es demasiado grande. El tamaño máximo permitido es 2MB.');
      return false;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width !== expectedDimensions.width || img.height !== expectedDimensions.height) {
          setError(`La imagen debe tener ${expectedDimensions.width}x${expectedDimensions.height} píxeles`);
          resolve(false);
        }
        resolve(true);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'large' | 'small') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const dimensions = type === 'large' 
      ? { width: 300, height: 600 }
      : { width: 150, height: 300 };

    const isValid = await validateImage(file, dimensions);
    if (!isValid) return;

    if (type === 'large') {
      setLargeImageFile(file);
    } else {
      setSmallImageFile(file);
    }
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAd?.title || !currentAd?.url || (!isEditing && (!largeImageFile || !smallImageFile))) {
      setError('Por favor, complete todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let largeImageUrl = currentAd.largeImage;
      let smallImageUrl = currentAd.smallImage;

      if (largeImageFile) {
        largeImageUrl = await uploadImage(largeImageFile, 'ads/large');
      }
      if (smallImageFile) {
        smallImageUrl = await uploadImage(smallImageFile, 'ads/small');
      }

      const adData = {
        title: currentAd.title,
        url: currentAd.url,
        largeImage: largeImageUrl,
        smallImage: smallImageUrl,
        active: true,
        updatedAt: new Date(),
        order: currentAd.order || ads.length
      };

      if (isEditing && currentAd.id) {
        await updateDoc(doc(db, 'advertisements', currentAd.id), adData);
      } else {
        adData.createdAt = new Date();
        await addDoc(collection(db, 'advertisements'), adData);
      }

      await fetchAds();
      resetForm();
    } catch (error) {
      console.error('Error saving ad:', error);
      setError('Error al guardar la publicidad');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adId: string) => {
    if (!window.confirm('¿Está seguro de eliminar esta publicidad?')) return;

    try {
      setLoading(true);
      const adRef = doc(db, 'advertisements', adId);
      await deleteDoc(adRef);
      await fetchAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      setError('Error al eliminar la publicidad');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentAd(null);
    setIsEditing(false);
    setLargeImageFile(null);
    setSmallImageFile(null);
    setError('');
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Publicidad</h1>
          <p className="text-gray-500 mt-1">
            {ads.length} de {MAX_ADS} espacios utilizados
          </p>
        </div>
        {!isEditing && ads.length < MAX_ADS && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Publicidad
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {(isEditing || currentAd) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título de la Publicidad
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={currentAd?.title || ''}
              onChange={(e) => setCurrentAd(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL de Destino
            </label>
            <input
              type="url"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={currentAd?.url || ''}
              onChange={(e) => setCurrentAd(prev => ({ ...prev, url: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Imagen Grande (300x600 px)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageChange(e, 'large')}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {currentAd?.largeImage && (
                <img
                  src={currentAd.largeImage}
                  alt="Vista previa grande"
                  className="mt-2 h-40 object-cover rounded-md"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Imagen Pequeña (150x300 px)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageChange(e, 'small')}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {currentAd?.smallImage && (
                <img
                  src={currentAd.smallImage}
                  alt="Vista previa pequeña"
                  className="mt-2 h-40 object-cover rounded-md"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Publicidad'
              )}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publicidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Creación
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ads.map((ad) => (
              <tr key={ad.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        src={ad.smallImage}
                        alt={ad.title}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {ad.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {ad.url}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ad.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setCurrentAd(ad);
                        setIsEditing(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
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