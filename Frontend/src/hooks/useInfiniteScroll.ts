import { useState, useEffect, useCallback, RefObject } from 'react';

export const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean,
  scrollRef?: RefObject<HTMLElement>
) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    const target = scrollRef?.current || document.documentElement;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 200;

    if (isAtBottom && hasMore && !isFetching) {
      setIsFetching(true);
    }
  }, [hasMore, isFetching, scrollRef]);

  useEffect(() => {
    const target = scrollRef?.current || window;
    target.addEventListener('scroll', handleScroll);
    return () => target.removeEventListener('scroll', handleScroll);
  }, [handleScroll, scrollRef]);

  useEffect(() => {
    if (!isFetching) return;
    const fetchMoreData = async () => {
      await callback();
      setIsFetching(false);
    };
    fetchMoreData();
  }, [isFetching, callback]);

  return [isFetching, setIsFetching] as const;
};