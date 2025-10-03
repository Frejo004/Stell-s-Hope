import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { useInfiniteScroll } from './useInfiniteScroll';

export const useInfiniteProducts = (filters: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMoreProducts = useCallback(async () => {
    try {
      const data = await productService.getProducts({
        ...filters,
        page: currentPage + 1
      });
      
      const newProducts = data.data || data;
      
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setCurrentPage(prev => prev + 1);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, [filters, currentPage]);

  const [isFetching] = useInfiniteScroll(fetchMoreProducts, hasMore);

  // Reset when filters change
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        setLoading(true);
        setProducts([]);
        setCurrentPage(1);
        setHasMore(true);
        setError(null);

        const data = await productService.getProducts({
          ...filters,
          page: 1
        });
        
        const initialProducts = data.data || data;
        setProducts(initialProducts);
        
        if (initialProducts.length === 0) {
          setHasMore(false);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, [JSON.stringify(filters)]);

  return { 
    products, 
    loading, 
    error, 
    hasMore, 
    isFetching,
    refetch: () => {
      setProducts([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  };
};