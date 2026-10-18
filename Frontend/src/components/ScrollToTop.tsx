import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Réinitialise instantanément le défilement (scroll) vers le haut de page (0, 0)
 * dès qu'une navigation (changement d'URL / route) intervient dans l'application.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  // useLayoutEffect s'exécute de façon synchrone AVANT que le navigateur ne peigne l'écran
  useLayoutEffect(() => {
    // 1. Désactiver la restauration automatique de l'historique du navigateur
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (hash) {
      // Si une ancre (#) est spécifiée, attendre le rendu et défiler vers elle
      const targetId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }

    // 2. Réinitialisation synchrone et absolue de la fenêtre
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    // 3. Réinitialiser également les éventuels conteneurs internes défilables
    const innerContainers = document.querySelectorAll<HTMLElement>('.overflow-y-auto, [data-scroll-container]');
    innerContainers.forEach(container => {
      container.scrollTop = 0;
    });
  }, [pathname, search, hash]);

  // Deuxième passage après le montage complet des composants enfants (ex: Suspense lazy chunks)
  useEffect(() => {
    if (!hash && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
}
