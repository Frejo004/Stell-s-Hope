import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react-router';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/order';

// Lazy loading des pages pour optimisation
const HomePage = lazy(() => import('../pages/HomePage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const ProductDetail = lazy(() => import('../components/ProductDetail'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const FAQPage = lazy(() => import('../pages/FAQPage'));
const LegalPage = lazy(() => import('../pages/LegalPage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const OrderTrackingPage = lazy(() => import('../pages/OrderTrackingPage'));
const WishlistPage = lazy(() => import('../pages/WishlistPage'));
const OrderDetailsPage = lazy(() => import('../pages/OrderDetailsPage'));
const CartPageNew = lazy(() => import('../pages/CartPageNew'));
const AdminLayout = lazy(() => import('../components/admin/AdminLayout'));
const ApiTest = lazy(() => import('../components/ApiTest'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const VerifyCodePage = lazy(() => import('../pages/VerifyCodePage'));

// Composant de loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-300"></div>
  </div>
);

interface AppRouterProps {
  onOrderComplete: (order: Order) => void;
}

function CategoryPageWrapper() {
  useParams<{ category: string }>();
  return (
    <CategoryPage />
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

function ProductDetailWrapper({ products }: { products: Product[] }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id.toString() === id);

  if (!product) {
    return <NotFoundPage
      products={products}
      onProductClick={(p) => navigate(`/product/${p.id}`)}
      onNavigateHome={() => navigate('/')}
      onCategoryChange={(c) => navigate(`/category/${c}`)}
    />;
  }

  return (
    <ProductDetail
      product={product}
      onClose={() => window.history.back()}
    />
  );
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
    <Suspense fallback={<PageLoader />}>
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
              <div className="bg-white">
                <Header
                  onCategoryChange={handleCategoryChange}
                  currentCategory={getCurrentCategory()}
                  products={products}
                  onProductClick={handleProductClick}
                />
                <main className="flex-grow">
                  <Suspense fallback={<PageLoader />}>
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
                          <CategoryPage />
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
                          <CategoryPageWrapper />
                        }
                      />

                      <Route
                        path="/product/:id"
                        element={<ProductDetailWrapper products={products} />}
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
                  </Suspense>
                </main>
                <Footer />
              </div>
            </>
          }
        />
      </Routes>
    </Suspense>
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
};