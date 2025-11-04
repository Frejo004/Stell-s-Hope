import { useState, useEffect } from 'react';

/**
 * Hook qui debounce une valeur.
 * @param value La valeur à débalancer.
 * @param delay Le délai en millisecondes.
 * @returns La valeur débalancée.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Met à jour la valeur débalancée après le délai spécifié
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoie le timeout si la valeur change (l'utilisateur continue de taper)
    // ou si le composant est démonté.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Se ré-exécute seulement si la valeur ou le délai change

  return debouncedValue;
}
