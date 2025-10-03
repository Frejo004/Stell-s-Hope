import { useQueryState, parseAsInteger, parseAsString, parseAsArrayOf } from 'nuqs';

export const useProductFilters = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [category, setCategory] = useQueryState('category', parseAsInteger);
  const [minPrice, setMinPrice] = useQueryState('min_price', parseAsInteger);
  const [maxPrice, setMaxPrice] = useQueryState('max_price', parseAsInteger);
  const [sortBy, setSortBy] = useQueryState('sort', parseAsString.withDefault('created_at'));
  const [colors, setColors] = useQueryState('colors', parseAsArrayOf(parseAsString).withDefault([]));
  const [sizes, setSizes] = useQueryState('sizes', parseAsArrayOf(parseAsString).withDefault([]));

  const resetFilters = () => {
    setPage(1);
    setSearch('');
    setCategory(null);
    setMinPrice(null);
    setMaxPrice(null);
    setSortBy('created_at');
    setColors([]);
    setSizes([]);
  };

  const getFilters = () => ({
    page,
    search: search || undefined,
    category: category || undefined,
    min_price: minPrice || undefined,
    max_price: maxPrice || undefined,
    sort: sortBy,
    colors: colors.length > 0 ? colors : undefined,
    sizes: sizes.length > 0 ? sizes : undefined,
  });

  return {
    page, setPage,
    search, setSearch,
    category, setCategory,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    sortBy, setSortBy,
    colors, setColors,
    sizes, setSizes,
    resetFilters,
    getFilters
  };
};