import { Building2, Mail, Phone, Globe, Shield, FileText } from 'lucide-react';

interface MentionsLegalesPageProps {
  onClose: () => void;
}

export default function MentionsLegalesPage({ onClose }: MentionsLegalesPageProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        <button onClick={onClose} className="mb-8 text-gray-600 hover:text-black transition-colors flex items-center gap-2">
          ← Retour
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentions Légales</h1>
            <p className="text-sm text-gray-500 mt-1">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Éditeur du site */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-rose-400" />
              <h2 className="text-xl font-semibold text-gray-900">1. Éditeur du site</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">Raison sociale :</span> Stell's Hope</p>
              <p><span className="font-medium">Forme juridique :</span> Entreprise individuelle</p>
              <p><span className="font-medium">Siège social :</span> 123 Rue de la Mode, 75001 Paris, France</p>
              <p><span className="font-medium">SIRET :</span> XXX XXX XXX XXXXX</p>
              <p><span className="font-medium">N° TVA intracommunautaire :</span> FR XX XXX XXX XXX</p>
              <div className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>contact@stellshope.fr</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+33 1 23 45 67 89</span>
              </div>
            </div>
          </section>

          {/* Directeur de publication */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Directeur de la publication</h2>
            <p className="text-gray-700 leading-relaxed">
              Le directeur de la publication du site <strong>stellshope.fr</strong> est le représentant légal de Stell's Hope.
            </p>
          </section>

          {/* Hébergement */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-rose-400" />
              <h2 className="text-xl font-semibold text-gray-900">3. Hébergement</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">Hébergeur :</span> OVH SAS</p>
              <p><span className="font-medium">Adresse :</span> 2 rue Kellermann, 59100 Roubaix, France</p>
              <p><span className="font-medium">Site :</span> <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">www.ovh.com</a></p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
            <p className="text-gray-700 leading-relaxed">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes) est la propriété exclusive de Stell's Hope ou de ses partenaires. Toute reproduction, distribution, modification ou utilisation de ces contenus, sans autorisation écrite préalable, est strictement interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
            </p>
          </section>

          {/* Données personnelles */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-rose-400" />
              <h2 className="text-xl font-semibold text-gray-900">5. Données personnelles (RGPD)</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants concernant vos données personnelles :
            </p>
            <ul className="space-y-2 text-sm text-gray-700 ml-4">
              {[
                'Droit d\'accès à vos données',
                'Droit de rectification',
                'Droit à l\'effacement (droit à l\'oubli)',
                'Droit à la limitation du traitement',
                'Droit à la portabilité des données',
                'Droit d\'opposition'
              ].map((right) => (
                <li key={right} className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5">•</span>
                  {right}
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Pour exercer ces droits, contactez-nous à : <strong>contact@stellshope.fr</strong>
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Ce site utilise des cookies techniques nécessaires à son fonctionnement (session, panier, authentification) et des cookies analytiques pour mesurer l'audience. Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation de responsabilité</h2>
            <p className="text-gray-700 leading-relaxed">
              Stell's Hope s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Cependant, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. Stell's Hope décline toute responsabilité pour tout dommage résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur le site.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Droit applicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>

          {/* Contact */}
          <div className="bg-rose-50 rounded-xl p-6 border border-rose-100">
            <h3 className="font-semibold text-gray-900 mb-3">Une question ?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400" />
                <span>contact@stellshope.fr</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400" />
                <span>+33 1 23 45 67 89 — Lun-Ven 9h-19h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
