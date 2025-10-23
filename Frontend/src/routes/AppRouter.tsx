import React, { memo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react-router';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/order';

// Imports directs des pages pour éviter les erreurs de lazy loading
import HomePage from '../pages/HomePage';
import CategoryPage from '../pages/CategoryPage';
import ProductDetail from '../components/ProductDetail';
import SearchPage from '../pages/SearchPage';
import ContactPage from '../pages/ContactPage';
import AboutPage from '../pages/AboutPage';
import FAQPage from '../pages/FAQPage';
import LegalPage from '../pages/LegalPage';
import AccountPage from '../pages/AccountPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderConfirmationPage from '../pages/OrderConfirmationPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';

import RegisterPage from '../pages/RegisterPage';
import OrderTrackingPage from '../pages/OrderTrackingPage';
import WishlistPage from '../pages/WishlistPage';
import OrderDetailsPage from '../pages/OrderDetailsPage';
import CartPageNew from '../pages/CartPageNew';
import AdminLayout from '../components/admin/AdminLayout';
import ApiTest from '../components/ApiTest';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import VerifyCodePage from '../pages/VerifyCodePage';

// Composant de loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-300"></div>
  </div>
);

interface AppRouterProps {
  onOrderComplete: (order: Order) => void;
}

function CategoryPageWrapper({ products, onProductClick }: { products: Product[], onProductClick: (product: Product) => void }) {
  const { category } = useParams<{ category: string }>();
  return (
    <CategoryPage
      products={products}
      category={category || 'all'}
      onProductClick={onProductClick}
    />
  );
}

function OrderTrackingPageWrapper({ onClose }: { onClose: () => void }) {
  const { orderId } = useParams<{ orderId: string }>();
  return <OrderTrackingPage orderId={orderId || ''} onClose={onClose} />;
}

function OrderDetailsPageWrapper({ onClose }: { onClose: () => void }) {
  const { orderId } = useParams<{ orderId: string }>();
  return <OrderDetailsPage orderId={orderId || ''} onClose={onClose} />;
}

function AppContent({ onOrderComplete }: AppRouterProps) {
  const { isAuthenticated } = useAuth();
  const { getOrderById } = useOrders();
  const { products, loading } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <PageLoader />;
  }

  const getCurrentCategory = () => {
    const path = location.pathname;
    if (path === '/boutique') return 'all';
    if (path.startsWith('/category/')) return path.split('/')[2];
    return 'home';
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCategoryChange = (category: string) => {
    if (category === 'home') {
      navigate('/');
    } else if (category === 'all') {
      navigate('/boutique');
    } else {
      navigate(`/category/${category}`);
    }
  };

  return (
    <Routes>
      {/* Admin Route - No Header/Footer */}
      <Route 
        path="/admin" 
        element={<AdminLayout />} 
      />
      
      {/* Auth Routes - No Header/Footer */}
      <Route 
        path="/login" 
        element={<LoginPage onClose={() => navigate('/')} />} 
      />
      
      <Route 
        path="/register" 
        element={<RegisterPage onClose={() => navigate('/')} />} 
      />
      
      <Route 
        path="/forgot-password" 
        element={<ForgotPasswordPage onClose={() => navigate('/')} />} 
      />
      
      <Route 
        path="/verify-code" 
        element={<VerifyCodePage onClose={() => navigate('/')} />} 
      />
      
      {/* Regular Routes with Header/Footer */}
      <Route 
        path="/*" 
        element={
          <>
            <div className="min-h-screen bg-white">
            <Header
              onCategoryChange={handleCategoryChange}
              currentCategory={getCurrentCategory()}
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
              path="/boutique" 
              element={
                <CategoryPage
                  products={products}
                  category="all"
                  onProductClick={handleProductClick}
                />
              } 
            />
            
            <Route 
              path="/category/home" 
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
                <CategoryPageWrapper
                  products={products}
                  onProductClick={handleProductClick}
                />
              } 
            />

            <Route 
              path="/product/:id" 
              element={
                <ProductDetail
                  product={products[0]}
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


            
            <Route 
              path="/order-tracking/:orderId" 
              element={
                <OrderTrackingPageWrapper
                  onClose={() => window.history.back()}
                />
              } 
            />
            
            <Route 
              path="/wishlist" 
              element={
                <WishlistPage
                  onClose={() => window.history.back()}
                  onProductClick={handleProductClick}
                />
              } 
            />
            
            <Route 
              path="/order-details/:orderId" 
              element={
                <OrderDetailsPageWrapper
                  onClose={() => window.history.back()}
                />
              } 
            />
            
            <Route 
              path="/cart" 
              element={<CartPageNew onClose={() => window.history.back()} />} 
            />
            
            <Route 
              path="/api-test" 
              element={<ApiTest />} 
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

          </>
        }
      />
    </Routes>
  );
}

export default function AppRouter({ onOrderComplete }: AppRouterProps) {
  return (
    <Router>
      <NuqsAdapter>
        <AppContent onOrderComplete={onOrderComplete} />
      </NuqsAdapter>
    </Router>
  );
}