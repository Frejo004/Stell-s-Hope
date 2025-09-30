import React, { useState } from 'react';
import { X, Star, Heart, Truck, RotateCcw, Shield, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { reviews } from '../data/reviews';

interface ProductDetailProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useCart();
  
  const productReviews = reviews.filter(review => review.productId === product.id);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    addToCart(product, selectedSize || product.sizes[0], selectedColor, quantity);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-rose-300' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {product.isNew && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded">NOUVEAU</span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-rose-300 text-white text-xs px-2 py-1 rounded">PROMO</span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">BEST-SELLER</span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviewCount} avis)</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">{product.price.toFixed(2)} €</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice.toFixed(2)} €
                  </span>
                )}
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Couleur: {selectedColor}</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-rose-300' : 'border-gray-300'
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
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes.length > 1 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Taille</h3>
                    <button className="text-sm text-rose-300 hover:underline">
                      Guide des tailles
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-3 text-sm border rounded ${
                          selectedSize === size
                            ? 'border-rose-300 bg-rose-300 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Quantité</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-3 px-6 rounded font-medium hover:bg-gray-900 transition-colors"
                >
                  Ajouter au panier
                </button>
                <button className="w-full flex items-center justify-center space-x-2 py-3 px-6 border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Ajouter aux favoris</span>
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Truck className="w-5 h-5" />
                  <span>Livraison gratuite dès 100€</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <RotateCcw className="w-5 h-5" />
                  <span>Retours gratuits sous 30 jours</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Shield className="w-5 h-5" />
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t">
            <div className="flex border-b">
              {['description', 'composition', 'avis'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-rose-300 text-rose-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'avis' ? `Avis (${productReviews.length})` : tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  <h4 className="font-medium mb-2">Conseils d'entretien:</h4>
                  <p className="text-gray-600">{product.care}</p>
                </div>
              )}

              {activeTab === 'composition' && (
                <div>
                  <h4 className="font-medium mb-2">Composition:</h4>
                  <p className="text-gray-700">{product.composition}</p>
                </div>
              )}

              {activeTab === 'avis' && (
                <div className="space-y-6">
                  {productReviews.length === 0 ? (
                    <p className="text-gray-500">Aucun avis pour ce produit.</p>
                  ) : (
                    productReviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{review.customerName}</span>
                              <div className="flex items-center">
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
                            <p className="text-sm text-gray-500">
                              Taille {review.customerSize} • {review.customerHeight}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        {review.hasPhoto && review.photoUrl && (
                          <img
                            src={review.photoUrl}
                            alt="Photo client"
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}