import AppRouter from './routes/AppRouter';
import { useToast } from './hooks/useToast';
import { useOrders } from './hooks/useOrders';
import { Order } from './types/order';
import { ToastProvider } from './contexts/ToastContext';

function AppContent() {
  const { addToast } = useToast();
  const { addOrder } = useOrders();

  const handleOrderComplete = (order: Order) => {
    addOrder(order);
    addToast({
      type: 'success',
      message: `Commande #${order.id} confirmée avec succès !`,
      duration: 5000
    });
  };

  return <AppRouter onOrderComplete={handleOrderComplete} />;
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;