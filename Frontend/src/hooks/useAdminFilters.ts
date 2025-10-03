import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';

export const useAdminProductFilters = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [category, setCategory] = useQueryState('category', parseAsInteger);
  const [status, setStatus] = useQueryState('status', parseAsString);
  const [perPage, setPerPage] = useQueryState('per_page', parseAsInteger.withDefault(15));

  return {
    page, setPage,
    search, setSearch,
    category, setCategory,
    status, setStatus,
    perPage, setPerPage,
    getFilters: () => ({
      page,
      search: search || undefined,
      category: category || undefined,
      status: status || undefined,
      per_page: perPage
    })
  };
};

export const useAdminOrderFilters = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString);
  const [dateFrom, setDateFrom] = useQueryState('date_from', parseAsString);
  const [dateTo, setDateTo] = useQueryState('date_to', parseAsString);

  return {
    page, setPage,
    search, setSearch,
    status, setStatus,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    getFilters: () => ({
      page,
      search: search || undefined,
      status: status || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined
    })
  };
};

export const useAdminCustomerFilters = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString);

  return {
    page, setPage,
    search, setSearch,
    status, setStatus,
    getFilters: () => ({
      page,
      search: search || undefined,
      status: status || undefined
    })
  };
};