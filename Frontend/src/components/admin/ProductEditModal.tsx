import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface ProductEditModalProps {
  isOpen: boolean;
  productId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductEditModal({ isOpen, productId, onClose, onSuccess }: ProductEditModalProps) {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    is_active: true,
    is_featured: false,
    images: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await adminService.uploadFile(formData);
        return response.url;
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      setProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct();
    }
  }, [isOpen, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProduct(productId!);
      setProduct({
        name: data.name || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        stock_quantity: data.stock_quantity?.toString() || '',
        category_id: data.category_id?.toString() || '',
        is_active: data.is_active || false,
        is_featured: data.is_featured || false,
        images: Array.isArray(data.images) ? data.images : []
      });
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminService.updateProduct(productId!, {
        ...product,
        price: parseFloat(product.price),
        stock_quantity: parseInt(product.stock_quantity),
        category_id: parseInt(product.category_id),
        images: product.images
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Modifier le produit</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({...product, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({...product, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                value={product.price}
                onChange={(e) => setProduct({...product, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={product.stock_quantity}
                onChange={(e) => setProduct({...product, stock_quantity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={product.category_id}
              onChange={(e) => setProduct({...product, category_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="1">Homme</option>
              <option value="2">Femme</option>
              <option value="3">Unisexe</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <div className="space-y-2">
              {(product.images || []).map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <img src={image} alt="Aperçu" className="w-16 h-16 object-cover rounded border" />
                  <span className="flex-1 text-sm text-gray-600 truncate">{image}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = product.images.filter((_, i) => i !== index);
                      setProduct({...product, images: newImages});
                    }}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {uploading ? 'Upload en cours...' : 'Sélectionnez une ou plusieurs images'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={product.is_active}
                onChange={(e) => setProduct({...product, is_active: e.target.checked})}
                className="mr-2"
              />
              Produit actif
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={product.is_featured}
                onChange={(e) => setProduct({...product, is_featured: e.target.checked})}
                className="mr-2"
              />
              Produit vedette
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}