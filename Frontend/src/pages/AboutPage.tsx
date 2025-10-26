;
import { Heart, Leaf, Users, Award } from 'lucide-react';

interface AboutPageProps {
  onClose: () => void;
}

export default function AboutPage({ onClose }: AboutPageProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={onClose} className="mb-6 text-gray-600 hover:text-black">
          ← Retour
        </button>

        <div className="space-y-12">
          {/* Hero */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">À propos de Stell's Hope</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une marque française engagée pour une mode éthique et durable, 
              créée avec passion pour vous offrir des vêtements intemporels.
            </p>
          </div>

          {/* Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Notre Histoire</h2>
              <p className="text-gray-600 mb-4">
                Fondée en 2020 par Stella Martinez, Stell's Hope est née d'une vision simple : 
                créer des vêtements beaux, durables et accessibles à tous.
              </p>
              <p className="text-gray-600">
                Inspirée par les valeurs de respect de l'environnement et du savoir-faire artisanal, 
                notre marque s'engage à proposer des collections intemporelles qui traversent les saisons.
              </p>
            </div>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Image de l'équipe</span>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-2xl font-bold text-center mb-8">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Heart className="w-12 h-12 text-rose-300 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Passion</h3>
                <p className="text-sm text-gray-600">
                  Chaque pièce est conçue avec amour et attention aux détails
                </p>
              </div>
              <div className="text-center">
                <Leaf className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Durabilité</h3>
                <p className="text-sm text-gray-600">
                  Matières éco-responsables et production éthique
                </p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Communauté</h3>
                <p className="text-sm text-gray-600">
                  Une marque proche de ses clients et de ses valeurs
                </p>
              </div>
              <div className="text-center">
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Qualité</h3>
                <p className="text-sm text-gray-600">
                  Excellence dans chaque couture et finition
                </p>
              </div>
            </div>
          </div>

          {/* Commitments */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Nos Engagements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">🌱 Environnement</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Coton biologique certifié GOTS</li>
                  <li>• Emballages recyclables</li>
                  <li>• Transport neutre en carbone</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">👥 Social</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Partenaires équitables</li>
                  <li>• Conditions de travail éthiques</li>
                  <li>• Soutien aux artisans locaux</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}