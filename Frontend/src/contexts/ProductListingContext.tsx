import { createContext, useContext, type ReactNode } from 'react';
import { useProductFilters } from '../hooks/useProductFilters';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';

type ProductListing = ReturnType<typeof useInfiniteProducts>;

const ProductListingContext = createContext<ProductListing | null>(null);

export const ProductListingProvider = ({ children }: { children: ReactNode }) => {
  const { getFilters } = useProductFilters();
  const listing = useInfiniteProducts(getFilters());

  return (
    <ProductListingContext.Provider value={listing}>
      {children}
    </ProductListingContext.Provider>
  );
};

export const useProductListing = (): ProductListing => {
  const listing = useContext(ProductListingContext);
  if (!listing) {
    throw new Error('useProductListing doit être utilisé dans un ProductListingProvider');
  }
  return listing;
};