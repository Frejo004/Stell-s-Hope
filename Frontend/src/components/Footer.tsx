import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import ContactPage from '../pages/ContactPage';
import AboutPage from '../pages/AboutPage';
import FAQPage from '../pages/FAQPage';
import LegalPage from '../pages/LegalPage';
import AccountPage from '../pages/AccountPage';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';

export default function Footer() {
  const [activePage, setActivePage] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const openPage = (page: string) => setActivePage(page);
  const closePage = () => setActivePage(null);
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo className="text-white" />
            <p className="text-gray-400">
              Mode contemporaine et intemporelle pour homme et femme. 
              Qualité premium et style authentique depuis 2020.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Boutique</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Collection Femme</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Collection Homme</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessoires</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nouveautés</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Promotions</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Service Client</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => isAuthenticated ? openPage('account') : openPage('auth')}
                  className="hover:text-white transition-colors"
                >
                  Mon Compte
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = '/account'}
                  className="hover:text-white transition-colors"
                >
                  Suivi de Commande
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openPage('shipping')}
                  className="hover:text-white transition-colors"
                >
                  Retours & Échanges
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Guide des Tailles</a></li>
              <li>
                <button 
                  onClick={() => openPage('faq')}
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>contact@elegance.fr</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" />
                <span>75001 Paris, France</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="pt-4">
              <h5 className="font-medium mb-3">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l focus:outline-none focus:border-rose-300"
                />
                <button className="bg-rose-300 px-4 py-2 rounded-r hover:bg-rose-400 transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Stell's Hope. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <button 
              onClick={() => openPage('cgv')}
              className="hover:text-white transition-colors"
            >
              Conditions Générales
            </button>
            <button 
              onClick={() => openPage('privacy')}
              className="hover:text-white transition-colors"
            >
              Politique de Confidentialité
            </button>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
      
      {/* Pages modales */}
      {activePage === 'contact' && <ContactPage onClose={closePage} />}
      {activePage === 'about' && <AboutPage onClose={closePage} />}
      {activePage === 'faq' && <FAQPage onClose={closePage} />}
      {activePage === 'cgv' && <LegalPage type="cgv" onClose={closePage} />}
      {activePage === 'privacy' && <LegalPage type="privacy" onClose={closePage} />}
      {activePage === 'shipping' && <LegalPage type="shipping" onClose={closePage} />}
      {activePage === 'account' && isAuthenticated && <AccountPage onClose={closePage} />}
    </footer>
  );
}