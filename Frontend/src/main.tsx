import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Gestion d'erreur globale pour les erreurs non capturées
window.addEventListener('error', (event) => {
  console.error('Erreur globale capturée:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée non gérée:', event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Element root non trouvé');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
