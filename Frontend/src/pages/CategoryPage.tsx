import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface CategoryPageProps {
  products: Product[];
  category: string;
  onProductClick: (product: Product) => void;
}

export default function CategoryPage({ products, category, onProductClick }: CategoryPageProps) {
  const filteredProducts = products.filter(p => 
    category === 'all' || p.category.name.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Boutique - Tous nos produits
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
}