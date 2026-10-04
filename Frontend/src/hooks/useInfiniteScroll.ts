import { useState, useEffect, useCallback, useRef } from 'react';

const BOTTOM_THRESHOLD = 300;

const isAtBottom = () => {
  const doc = document.documentElement;
  const scrolled = window.scrollY || doc.scrollTop || 0;
  return doc.scrollHeight - scrolled - window.innerHeight <= BOTTOM_THRESHOLD;
};

export const useInfiniteScroll = (callback: () => void | Promise<void>, hasMore: boolean) => {
  const [isFetching, setIsFetching] = useState(false);

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  const fetchingRef = useRef(false);
  const armedRef = useRef(true);

  const trigger = useCallback(() => {
    if (fetchingRef.current || !hasMoreRef.current) return;
    fetchingRef.current = true;
    setIsFetching(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!isAtBottom()) {
        // Réarme seulement après avoir quitté le bas de page, sinon l'inertie
        // de la molette empile des pages les unes derrière les autres.
        armedRef.current = true;
        return;
      }

      if (!armedRef.current) return;
      armedRef.current = false;
      trigger();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trigger]);

  useEffect(() => {
    if (!isFetching) return;

    let active = true;

    const run = async () => {
      try {
        await callbackRef.current();
      } finally {
        if (active) {
          fetchingRef.current = false;
          setIsFetching(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [isFetching]);

  return [isFetching, setIsFetching] as const;
};