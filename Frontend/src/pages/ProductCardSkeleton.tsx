/**
 * ProductCardSkeleton.tsx
 * Composant représentant le "squelette" d'une carte produit,
 * utilisé pour améliorer la perception de la vitesse de chargement.
 */
export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square w-full bg-gray-200 rounded-lg"></div>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}