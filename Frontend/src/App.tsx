import React from 'react';
import AppRouter from './routes/AppRouter';
import ToastContainer from './components/ToastContainer';
import { useToast } from './hooks/useToast';
import { useOrders } from './hooks/useOrders';
import { Order } from './types/order';

function App() {
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

  return (
    <>
      <AppRouter onOrderComplete={handleOrderComplete} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default App;