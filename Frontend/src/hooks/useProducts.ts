import { useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';

export const useProducts = (filters?: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProducts(filters);
        setProducts(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error, refetch: () => loadProducts() };
};

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProduct(id);
        setProduct(data);
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  return { product, loading, error };
};