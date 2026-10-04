import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { productService, ProductFilters } from '../services/productService';
import { useInfiniteScroll } from './useInfiniteScroll';
import { Product } from '../types';

const PER_PAGE = 20;

const isCanceled = (err: unknown): boolean =>
  axios.isCancel(err) || (err as { code?: string })?.code === 'ERR_CANCELED';

export const useInfiniteProducts = (filters: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const filtersKey = JSON.stringify(filters ?? {});
  const filtersRef = useRef<ProductFilters>(filters);
  filtersRef.current = filters;

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const listAbortRef = useRef<AbortController | null>(null);
  const pageAbortRef = useRef<AbortController | null>(null);

  const fetchMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);

    const nextPage = pageRef.current + 1;
    const controller = new AbortController();
    pageAbortRef.current?.abort();
    pageAbortRef.current = controller;

    try {
      const data = await productService.getProducts(
        { ...filtersRef.current, page: nextPage, per_page: PER_PAGE },
        controller.signal
      );
      const newProducts = data.data || [];

      if (controller.signal.aborted) return;

      if (newProducts.length < PER_PAGE) {
        hasMoreRef.current = false;
        setHasMore(false);
      } else {
        pageRef.current = nextPage;
        setProducts(prev => [...prev, ...newProducts]);
      }
    } catch (err) {
      if (!isCanceled(err)) {
        setError((err as Error).message);
      }
    } finally {
      if (!controller.signal.aborted) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, []);

  const [isFetching] = useInfiniteScroll(fetchMore, hasMore);

  useEffect(() => {
    listAbortRef.current?.abort();
    pageAbortRef.current?.abort();

    const controller = new AbortController();
    listAbortRef.current = controller;

    pageRef.current = 1;
    hasMoreRef.current = true;
    loadingMoreRef.current = false;

    setProducts([]);
    setTotal(0);
    setError(null);
    setHasMore(true);
    setLoadingMore(false);
    setLoading(true);

    const fetchFirstPage = async () => {
      try {
        const data = await productService.getProducts(
          { ...filtersRef.current, page: 1, per_page: PER_PAGE },
          controller.signal
        );
        const initialProducts = data.data || [];

        if (controller.signal.aborted) return;

        setProducts(initialProducts);
        setTotal(data.total ?? initialProducts.length);

        if (initialProducts.length < PER_PAGE) {
          hasMoreRef.current = false;
          setHasMore(false);
        }
      } catch (err) {
        if (!isCanceled(err)) {
          setError((err as Error).message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchFirstPage();

    return () => {
      controller.abort();
    };
  }, [filtersKey]);

  return {
    products,
    total,
    loading,
    error,
    hasMore,
    isFetching: isFetching || loadingMore,
    fetchMore
  };
};