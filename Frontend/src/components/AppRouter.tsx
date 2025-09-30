import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Product } from '../types';
import { products } from '../data/products';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import CategoryPage from './CategoryPage';
import ProductDetail from './ProductDetail';
import SearchPage from './SearchPage';
import ContactPage from './ContactPage';
import AboutPage from './AboutPage';
import FAQPage from './FAQPage';
import LegalPage from './LegalPage';
import AccountPage from './AccountPage';
import CheckoutPage from './CheckoutPage';
import OrderConfirmationPage from './OrderConfirmationPage';
import NotFoundPage from './NotFoundPage';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/order';

interface AppRouterProps {
  onOrderComplete: (order: Order) => void;
}

export default function AppRouter({ onOrderComplete }: AppRouterProps) {
  const { isAuthenticated } = useAuth();
  const { getOrderById } = useOrders();

  const handleProductClick = (product: Product) => {
    window.location.href = `/product/${product.id}`;
  };

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      window.location.href = '/';
    } else {
      window.location.href = `/category/${category}`;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header
          onCategoryChange={handleCategoryChange}
          currentCategory="all"
          products={products}
          onProductClick={handleProductClick}
        />

        <main>
          <Routes>
            {/* Pages principales */}
            <Route 
              path="/" 
              element={
                <HomePage
                  products={products}
                  onProductClick={handleProductClick}
                  onCategoryChange={handleCategoryChange}
                />
              } 
            />
            
            <Route 
              path="/category/:category" 
              element={
                <CategoryPage
                  products={products}
                  category="homme"
                  onProductClick={handleProductClick}
                />
              } 
            />

            <Route 
              path="/product/:id" 
              element={
                <ProductDetail
                  product={products[0]}
                  isOpen={true}
                  onClose={() => window.history.back()}
                />
              } 
            />

            <Route 
              path="/search" 
              element={
                <SearchPage
                  products={products}
                  onClose={() => window.history.back()}
                  onProductClick={handleProductClick}
                />
              } 
            />

            {/* Pages informatives */}
            <Route 
              path="/contact" 
              element={<ContactPage onClose={() => window.history.back()} />} 
            />
            
            <Route 
              path="/about" 
              element={<AboutPage onClose={() => window.history.back()} />} 
            />
            
            <Route 
              path="/faq" 
              element={<FAQPage onClose={() => window.history.back()} />} 
            />

            {/* Pages légales */}
            <Route 
              path="/cgv" 
              element={<LegalPage type="cgv" onClose={() => window.history.back()} />} 
            />
            
            <Route 
              path="/privacy" 
              element={<LegalPage type="privacy" onClose={() => window.history.back()} />} 
            />
            
            <Route 
              path="/shipping" 
              element={<LegalPage type="shipping" onClose={() => window.history.back()} />} 
            />

            {/* Pages utilisateur */}
            <Route 
              path="/account" 
              element={
                isAuthenticated ? (
                  <AccountPage onClose={() => window.history.back()} />
                ) : (
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
                    <button onClick={() => window.location.href = '/'}>
                      Retour à l'accueil
                    </button>
                  </div>
                )
              } 
            />

            <Route 
              path="/checkout" 
              element={
                <CheckoutPage
                  onClose={() => window.history.back()}
                  onOrderComplete={onOrderComplete}
                />
              } 
            />

            <Route 
              path="/order-confirmation/:orderId" 
              element={
                <OrderConfirmationPage
                  order={getOrderById('CMD123') || {} as Order}
                  onClose={() => window.location.href = '/'}
                  onContinueShopping={() => window.location.href = '/'}
                />
              } 
            />

            {/* Page 404 */}
            <Route 
              path="*" 
              element={
                <NotFoundPage
                  products={products}
                  onProductClick={handleProductClick}
                  onNavigateHome={() => window.location.href = '/'}
                  onCategoryChange={handleCategoryChange}
                />
              } 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}