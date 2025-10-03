import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { products } from '../data/products';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/order';

interface SimpleRouterProps {
  onOrderComplete: (order: Order) => void;
}

export default function SimpleRouter({ onOrderComplete }: SimpleRouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { getOrderById } = useOrders();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
    navigate(`/product/${product.id}`);
  };

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      navigate('/');
    } else {
      navigate(`/category/${category}`);
    }
  };

  const getCurrentCategory = () => {
    if (currentPath.startsWith('/category/')) {
      return currentPath.split('/')[2];
    }
    return 'all';
  };

  const renderPage = () => {
    // Pages principales
    if (currentPath === '/') {
      return (
        <HomePage
          products={products}
          onProductClick={handleProductClick}
          onCategoryChange={handleCategoryChange}
        />
      );
    }

    if (currentPath.startsWith('/category/')) {
      const category = currentPath.split('/')[2];
      return (
        <CategoryPage
          products={products}
          category={category}
          onProductClick={handleProductClick}
        />
      );
    }

    if (currentPath.startsWith('/product/')) {
      const productId = currentPath.split('/')[2];
      const product = products.find(p => p.id === productId);
      if (product) {
        return (
          <ProductDetail
            product={product}
            onClose={() => navigate('/')}
          />
        );
      }
    }

    // Pages informatives
    if (currentPath === '/search') {
      return (
        <SearchPage
          products={products}
          onClose={() => navigate('/')}
          onProductClick={handleProductClick}
        />
      );
    }

    if (currentPath === '/contact') {
      return <ContactPage onClose={() => navigate('/')} />;
    }

    if (currentPath === '/about') {
      return <AboutPage onClose={() => navigate('/')} />;
    }

    if (currentPath === '/faq') {
      return <FAQPage onClose={() => navigate('/')} />;
    }

    // Pages légales
    if (currentPath === '/cgv') {
      return <LegalPage type="cgv" onClose={() => navigate('/')} />;
    }

    if (currentPath === '/privacy') {
      return <LegalPage type="privacy" onClose={() => navigate('/')} />;
    }

    if (currentPath === '/shipping') {
      return <LegalPage type="shipping" onClose={() => navigate('/')} />;
    }

    // Pages utilisateur
    if (currentPath === '/account') {
      if (isAuthenticated) {
        return <AccountPage onClose={() => navigate('/')} />;
      } else {
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
            <button 
              onClick={() => navigate('/')}
              className="bg-black text-white px-6 py-2 rounded"
            >
              Retour à l'accueil
            </button>
          </div>
        );
      }
    }

    if (currentPath === '/checkout') {
      return (
        <CheckoutPage
          onClose={() => navigate('/')}
          onOrderComplete={onOrderComplete}
        />
      );
    }

    if (currentPath.startsWith('/order-confirmation/')) {
      const orderId = currentPath.split('/')[2];
      const order = getOrderById(orderId);
      if (order) {
        return (
          <OrderConfirmationPage
            order={order}
            onClose={() => navigate('/')}
            onContinueShopping={() => navigate('/')}
          />
        );
      }
    }

    // Page 404
    return (
      <NotFoundPage
        products={products}
        onProductClick={handleProductClick}
        onNavigateHome={() => navigate('/')}
        onCategoryChange={handleCategoryChange}
      />
    );
  };

  const showHeaderFooter = !currentPath.startsWith('/order-confirmation/');

  return (
    <div className="min-h-screen bg-white">
      <Header
        onCategoryChange={handleCategoryChange}
        currentCategory={getCurrentCategory()}
        products={products}
        onProductClick={handleProductClick}
      />

      <main>
        {renderPage()}
      </main>

      {showHeaderFooter && <Footer />}


    </div>
  );
}