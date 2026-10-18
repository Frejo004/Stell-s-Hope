import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, AlertCircle, Sparkles } from 'lucide-react';

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
    console.error('Erreur interceptée par ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans flex items-center justify-center p-6 antialiased selection:bg-rose-100 selection:text-stone-900">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-stone-200/80 p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200/60 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-terracotta-600 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-terracotta-400" />
                <span>Interruption Inattendue</span>
              </span>
              <h1 className="font-serif text-2xl font-normal text-stone-950">
                Une légère anomalie est survenue
              </h1>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                Notre conciergerie technique a été informée. Veuillez réactualiser la page ou regagner l'accueil de la boutique.
              </p>
            </div>

            {import.meta.env.MODE === 'development' && this.state.error && (
              <div className="bg-stone-50 border border-stone-200/80 p-3.5 rounded-2xl text-left text-[11px] font-mono text-rose-700 overflow-auto max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-stone-950 hover:bg-black text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-terracotta-400" />
                <span>Actualiser la page</span>
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 py-3 rounded-full text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-stone-400" />
                <span>Retour à l'accueil</span>
              </button>
            </div>

            <p className="text-[10px] font-mono uppercase tracking-wider text-stone-400 pt-2 border-t border-stone-100">
              Réf : {this.state.error?.name || 'ANOMALY_HANDLED'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;