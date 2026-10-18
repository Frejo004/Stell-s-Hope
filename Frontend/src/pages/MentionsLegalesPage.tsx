import { Building2, Mail, Phone, Globe, Shield, FileText, ArrowLeft, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';

interface MentionsLegalesPageProps {
  onClose?: () => void;
}

export default function MentionsLegalesPage({ onClose }: MentionsLegalesPageProps) {
  return (
    <div className="fixed inset-0 bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-stone-200/80 px-6 sm:px-10 py-4 flex items-center justify-between shadow-sm">
        <button
          onClick={() => onClose ? onClose() : window.history.back()}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour</span>
        </button>

        <Logo className="h-6" />

        <div className="w-20 text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Légal
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-3">
            <Sparkles className="w-3 h-3 text-terracotta-500" />
            Informations Légales
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-stone-950 mb-3">
            Mentions Légales
          </h1>
          <p className="text-xs text-stone-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="space-y-6">
          {/* Éditeur */}
          <section className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-terracotta-600" />
              </div>
              <h2 className="font-serif text-lg font-medium text-stone-950">1. Éditeur du Site</h2>
            </div>
            <div className="text-xs sm:text-sm text-stone-600 space-y-1.5 leading-relaxed pl-1">
              <p><strong className="text-stone-900">Enseigne commerciale :</strong> Stell's Hope</p>
              <p><strong className="text-stone-900">Forme juridique :</strong> Société à Responsabilité Limitée</p>
              <p><strong className="text-stone-900">Siège social :</strong> Cocody Riviera Bonoumin, Abidjan, Côte d'Ivoire</p>
              <p><strong className="text-stone-900">Contact Conciergerie :</strong> contact@stellshope.com</p>
              <p><strong className="text-stone-900">Téléphone :</strong> +225 07 00 00 00 00</p>
            </div>
          </section>

          {/* Publication */}
          <section className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center">
                <Shield className="w-4 h-4 text-terracotta-600" />
              </div>
              <h2 className="font-serif text-lg font-medium text-stone-950">2. Direction de la Publication</h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-1">
              La direction de la publication est assurée par la direction générale de la Maison Stell's Hope.
            </p>
          </section>

          {/* Hébergement */}
          <section className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center">
                <Globe className="w-4 h-4 text-terracotta-600" />
              </div>
              <h2 className="font-serif text-lg font-medium text-stone-950">3. Hébergement & Infrastructure</h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-1">
              La plateforme numérique est hébergée sur des serveurs sécurisés haute disponibilité bénéficiant de certificats SSL chiffrés et d'une protection contre les dénis de service.
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center">
                <FileText className="w-4 h-4 text-terracotta-600" />
              </div>
              <h2 className="font-serif text-lg font-medium text-stone-950">4. Propriété Intellectuelle</h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-1">
              L'ensemble des photographies, visuels éditoriaux, logotypes, textes et créations vestimentaires présentés sur ce site demeurent la propriété exclusive de Stell's Hope. Toute reproduction sans accord écrit préalable est prohibée.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
