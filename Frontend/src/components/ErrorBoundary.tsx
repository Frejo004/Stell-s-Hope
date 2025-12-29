
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Une erreur inattendue est survenue
            </h1>

            <p className="text-gray-500 mb-8">
              Nous sommes désolés pour ce désagrément. Notre équipe a été notifiée.
              Veuillez essayer de rafraîchir la page.
            </p>

            {import.meta.env.MODE === 'development' && this.state.error && (
              <div className="bg-gray-100 p-4 rounded text-left text-xs font-mono text-red-600 mb-6 overflow-auto max-h-40">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 flex items-center justify-center transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Rafraîchir la page
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </button>
            </div>

            <p className="mt-8 text-xs text-gray-400">
              Code d'erreur : {this.state.error?.name || 'UNKNOWN'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;