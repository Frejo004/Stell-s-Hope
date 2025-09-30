import React from 'react';
import { ArrowRight, Star, Truck, RotateCcw, Shield, Headphones } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface HomePageProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onCategoryChange: (category: string) => void;
}

export default function HomePage({ products, onProductClick, onCategoryChange }: HomePageProps) {
  const bestSellers = products.filter(product => product.isBestSeller).slice(0, 4);
  const newProducts = products.filter(product => product.isNew).slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gray-900 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        
        <div className="relative z-10 text-center text-white space-y-6 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Collection Automne/Hiver 2024
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto">
            Découvrez nos pièces essentielles pour un style intemporel et moderne
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onCategoryChange('femme')}
              className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-100 transition-colors"
            >
              Collection Femme
            </button>
            <button
              onClick={() => onCategoryChange('homme')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded font-medium hover:bg-white hover:text-black transition-colors"
            >
              Collection Homme
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Truck,
              title: 'Livraison gratuite',
              description: 'Dès 100€ d\'achat'
            },
            {
              icon: RotateCcw,
              title: 'Retours gratuits',
              description: 'Sous 30 jours'
            },
            {
              icon: Shield,
              title: 'Paiement sécurisé',
              description: 'SSL & cryptage'
            },
            {
              icon: Headphones,
              title: 'Service client',
              description: '7j/7 de 9h à 19h'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center space-y-3">
              <feature.icon className="w-8 h-8 mx-auto text-rose-300" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Best-Sellers</h2>
            <p className="text-gray-600 mt-2">Nos pièces les plus populaires</p>
          </div>
          <button
            onClick={() => onCategoryChange('all')}
            className="flex items-center space-x-2 text-rose-300 hover:underline"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-rose-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Inscrivez-vous à notre newsletter
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Recevez en avant-première nos nouveautés et nos offres exclusives
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button className="bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-900 transition-colors whitespace-nowrap">
              S'inscrire
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            10% de réduction sur votre première commande
          </p>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Nouveautés</h2>
            <p className="text-gray-600 mt-2">Les dernières tendances mode</p>
          </div>
          <button
            onClick={() => onCategoryChange('all')}
            className="flex items-center space-x-2 text-rose-300 hover:underline"
          >
            <span>Découvrir</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {newProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ils parlent de nous
            </h2>
            <div className="flex items-center justify-center space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-gray-600">4.8/5 basé sur 1,247 avis</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sophie L.',
                comment: 'Qualité exceptionnelle et livraison rapide. Je recommande vivement !',
                rating: 5,
                image: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg'
              },
              {
                name: 'Marc D.',
                comment: 'Parfait pour renouveler ma garde-robe avec style. Service client au top.',
                rating: 5,
                image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg'
              },
              {
                name: 'Emma R.',
                comment: 'Des pièces intemporelles et de grande qualité. Mon nouveau site préféré !',
                rating: 5,
                image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'
              }
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-900">{review.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}