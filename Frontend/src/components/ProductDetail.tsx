import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, Truck, RotateCcw, Shield, Plus, Minus, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { reviews } from '../data/reviews';
import { products } from '../data/products';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  
  const { addToCart } = useCart();
  const productReviews = reviews.filter(review => review.productId === product.id);
  const relatedProducts = products.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    // Vérifier si product.sizes existe et a des éléments
    if (!selectedSize && product.sizes && product.sizes.length > 1) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    // Utiliser selectedSize ou la première taille si disponible, sinon une chaîne vide
    const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
    addToCart(product, size, selectedColor, quantity);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              Accueil
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Robes de Soirée</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden group cursor-zoom-in">
              <div 
                className="w-full h-full"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
              >
                <img
                  src={product.images && product.images[selectedImage] ? product.images[selectedImage] : '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{
                    transform: isZooming 
                      ? `scale(1.8)` 
                      : 'scale(1)',
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                  }}
                />
              </div>
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Navigation arrows */}
              <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {product.images && product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} avis)
                  </span>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Voir tous les avis
                </button>
              </div>
              
              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {Number(product.price || 0).toFixed(2)} €
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      {Number(product.originalPrice || 0).toFixed(2)} €
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      Livraison gratuite
                    </span>
                  </>
                )}
              </div>
              
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Taille</h3>
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Guide des tailles
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border-2 rounded-lg text-center font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                )) || <p>Aucune taille disponible</p>}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Couleur</h3>
              <div className="flex space-x-4">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase() === 'blanc' ? '#ffffff' :
                                     color.toLowerCase() === 'noir' ? '#000000' :
                                     color.toLowerCase() === 'bleu marine' ? '#1e3a8a' :
                                     color.toLowerCase() === 'rose poudré' ? '#f9a8d4' :
                                     color.toLowerCase() === 'gris' ? '#6b7280' :
                                     color.toLowerCase() === 'camel' ? '#d2b48c' :
                                     color.toLowerCase() === 'bordeaux' ? '#7f1d1d' :
                                     '#e5e7eb'
                    }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <div className="absolute inset-0 rounded-full border-2 border-white" />
                    )}
                  </button>
                )) || <p>Aucune couleur disponible</p>}
              </div>
              <p className="text-gray-700 mt-3 font-medium">
                {selectedColor}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-lg min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-gray-900 transition-colors"
                >
                  Ajouter au panier
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="border-2 border-gray-200 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Ajouter aux favoris</span>
                </button>
                <button className="border-2 border-gray-200 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Partager</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t-2 border-gray-100 pt-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Livraison gratuite</p>
                    <p className="text-sm text-gray-600">Dès 100€ d'achat</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Retours gratuits</p>
                    <p className="text-sm text-gray-600">Sous 30 jours</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Paiement sécurisé</p>
                    <p className="text-sm text-gray-600">SSL & cryptage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'composition', 'entretien', 'avis'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-lg transition-colors ${
                    activeTab === tab
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'description' && 'Description'}
                  {tab === 'composition' && 'Composition'}
                  {tab === 'entretien' && 'Entretien'}
                  {tab === 'avis' && `Avis (${product.reviewCount})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Plongez dans l'élégance avec cette pièce exceptionnelle qui allie sophistication et confort. 
                  Conçue avec attention aux détails, elle s'adapte parfaitement à toutes les occasions spéciales.
                </p>
              </div>
            )}

            {activeTab === 'composition' && (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.composition}</p>
                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Caractéristiques :</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Matière premium certifiée</li>
                    <li>• Coupe moderne et flatteuse</li>
                    <li>• Finitions soignées</li>
                    <li>• Confort optimal</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'entretien' && (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.care}</p>
                <div className="mt-6 bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3 text-blue-900">Conseils d'entretien :</h4>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Laver à l'envers pour préserver les couleurs</li>
                    <li>• Utiliser une lessive douce</li>
                    <li>• Sécher à l'ombre</li>
                    <li>• Repasser à température modérée</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'avis' && (
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl font-bold">{product.rating}</div>
                    <div>
                      <div className="flex items-center mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">Basé sur {product.reviewCount} avis</p>
                    </div>
                  </div>
                </div>
                
                {productReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-gray-600">
                            {review.customerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold">{review.customerName}</span>
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                      Taille commandée: <span className="font-medium">{review.customerSize}</span> • 
                      Taille client: <span className="font-medium">{review.customerHeight}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Produits similaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <img
                    src={relatedProduct.images && relatedProduct.images[0] ? relatedProduct.images[0] : '/placeholder.jpg'}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{relatedProduct.name}</h3>
                <p className="text-lg font-semibold">{Number(relatedProduct.price || 0).toFixed(2)} €</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}