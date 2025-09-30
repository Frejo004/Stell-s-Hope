import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import NotFoundPage from './components/NotFoundPage';
import { Product } from './types';
import { products } from './data/products';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';
import { useOrders } from './hooks/useOrders';
import { Order } from './types/order';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'category' | '404'>('home');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  
  const { toasts, removeToast, addToast } = useToast();
  const { addOrder } = useOrders();

  const handleOrderComplete = (order: Order) => {
    addOrder(order);
    addToast({
      type: 'success',
      message: `Commande #${order.id} confirmée avec succès !`,
      duration: 5000
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setCurrentView(category === 'all' ? 'home' : 'category');
  };

  const handleNavigateHome = () => {
    setCurrentCategory('all');
    setCurrentView('home');
  };

  const handleShow404 = () => {
    setCurrentView('404');
  };

  const renderContent = () => {
    if (currentView === '404') {
      return (
        <NotFoundPage
          products={products}
          onProductClick={handleProductClick}
          onNavigateHome={handleNavigateHome}
          onCategoryChange={handleCategoryChange}
        />
      );
    }

    if (currentView === 'home' || currentCategory === 'all') {
      return (
        <HomePage
          products={products}
          onProductClick={handleProductClick}
          onCategoryChange={handleCategoryChange}
        />
      );
    }

    return (
      <CategoryPage
        products={products}
        category={currentCategory}
        onProductClick={handleProductClick}
      />
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {currentView !== '404' && (
        <Header
          onCategoryChange={handleCategoryChange}
          currentCategory={currentCategory}
          products={products}
          onProductClick={handleProductClick}
        />
      )}
      
      <main>
        {renderContent()}
      </main>

      {currentView !== '404' && <Footer />}
      
      {/* Test 404 - Remove in production */}
      <button
        onClick={handleShow404}
        className="fixed bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-xs z-40"
      >
        Test 404
      </button>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          isOpen={isProductDetailOpen}
          onClose={() => {
            setIsProductDetailOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      <Cart onOrderComplete={handleOrderComplete} />
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;