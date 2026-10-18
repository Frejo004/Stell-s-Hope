import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Presentation (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Logo className="text-white" size="md" />
            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Maison de mode contemporaine et intemporelle. L'alliance subtile entre silhouettes audacieuses, coupes raffinées et matières d'exception.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/15 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/15 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/15 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/15 transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Boutique Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Collections</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400 font-light">
              <li>
                <button onClick={() => navigate('/category/femme')} className="hover:text-white transition-colors">
                  Vestiaire Femme
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/homme')} className="hover:text-white transition-colors">
                  Vestiaire Homme
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/accessories')} className="hover:text-white transition-colors">
                  Maroquinerie & Accessoires
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/boutique')} className="hover:text-white transition-colors">
                  Toutes les Pièces
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/boutique')} className="text-rose-400 hover:text-rose-300 transition-colors font-medium">
                  Ventes Privées & Promos
                </button>
              </li>
            </ul>
          </div>

          {/* Service Client (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Service Client</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400 font-light">
              <li>
                <button
                  onClick={() => isAuthenticated ? navigate('/account') : navigate('/login')}
                  className="hover:text-white transition-colors"
                >
                  Mon Espace Client
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/track')} className="hover:text-white transition-colors">
                  Suivi de Commande en Direct
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/returns')} className="hover:text-white transition-colors">
                  Retours & Modalités d'Échange
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
                  Foire Aux Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  Nous Contacter
                </button>
              </li>
            </ul>
          </div>

          {/* Coordonnées & Newsletter Rapide (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Atelier & Contact</h4>
            <div className="space-y-2.5 text-xs text-stone-400 font-light">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>contact@stellshope.fr</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>+225 07 00 00 00 00</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>Abidjan, Côte d'Ivoire</span>
              </div>
            </div>

            {/* Newsletter Mini */}
            <div className="pt-3">
              <p className="text-[11px] uppercase tracking-wider text-stone-300 font-medium mb-2">
                Lettre Confidentielle
              </p>
              <div className="flex rounded-full overflow-hidden border border-stone-800 bg-stone-900 focus-within:border-stone-600 transition-colors">
                <input
                  type="email"
                  placeholder="Votre email..."
                  className="w-full px-4 py-2 bg-transparent text-xs text-white placeholder:text-stone-500 focus:outline-none"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-white text-stone-950 hover:bg-stone-200 transition-colors text-xs font-semibold"
                  aria-label="S'inscrire"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Séparateur & Paiements Sécurisés ── */}
        <div className="border-t border-stone-900 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Paiement 100% sécurisé via Mobile Money (Wave, Orange, MTN, Moov) & Cartes Bancaires</span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone-400">
            <button onClick={() => navigate('/cgv')} className="hover:text-white transition-colors">Conditions Générales</button>
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Confidentialité</button>
            <button onClick={() => navigate('/mentions-legales')} className="hover:text-white transition-colors">Mentions Légales</button>
            <button onClick={() => navigate('/returns')} className="hover:text-white transition-colors">Politique Retours</button>
          </div>
        </div>

        <div className="text-center mt-8 text-[11px] text-stone-500">
          © {new Date().getFullYear()} Stell's Hope. Tous droits réservés. L'élégance sans compromis.
        </div>
      </div>
    </footer>
  );
}