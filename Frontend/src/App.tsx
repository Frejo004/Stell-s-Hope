import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import { Product } from './types';
import { products } from './data/products';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';
import { useOrders } from './hooks/useOrders';
import { Order } from './types/order';

function App() {
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
  };

  const renderContent = () => {
    if (currentCategory === 'all') {
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
      <Header
        onCategoryChange={handleCategoryChange}
        currentCategory={currentCategory}
        products={products}
        onProductClick={handleProductClick}
      />
      
      <main>
        {renderContent()}
      </main>

      <Footer />

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