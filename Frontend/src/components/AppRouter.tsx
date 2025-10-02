import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
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
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import OrderTrackingPage from './OrderTrackingPage';
import WishlistPage from './WishlistPage';
import OrderDetailsPage from './OrderDetailsPage';
import CartPage from './CartPage';
import AdminLayout from './admin/AdminLayout';
import ApiTest from './ApiTest';
import ForgotPasswordPage from './ForgotPasswordPage';
import VerifyCodePage from './VerifyCodePage';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/order';

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
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentCategory = () => {
    const path = location.pathname;
    if (path === '/' || path === '/category/home') return 'home';
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
              element={<CartPage onClose={() => window.history.back()} />} 
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
        }
      />
    </Routes>
  );
}

export default function AppRouter({ onOrderComplete }: AppRouterProps) {
  return (
    <Router>
      <AppContent onOrderComplete={onOrderComplete} />
    </Router>
  );
}