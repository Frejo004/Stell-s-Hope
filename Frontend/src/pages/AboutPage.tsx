import { Heart, Sparkles, Award, ArrowLeft, ShieldCheck, Feather, Scissors, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';

interface AboutPageProps {
  onClose?: () => void;
}

export default function AboutPage({ onClose }: AboutPageProps) {
  const values = [
    {
      icon: Scissors,
      title: 'Haute Précision',
      desc: 'Chaque coupe est sculptée dans nos ateliers avec le souci méticuleux des tombés et des proportions.'
    },
    {
      icon: Feather,
      title: 'Fibres d\'Exception',
      desc: 'Coton biologique certifié GOTS, soies naturelles et lins nobles sélectionnés pour leur douceur et longévité.'
    },
    {
      icon: ShieldCheck,
      title: 'Engagement Éthique',
      desc: 'Une confection responsable et humaine, respectueuse des femmes et des hommes qui façonnent vos pièces.'
    },
    {
      icon: Award,
      title: 'Intemporalité',
      desc: 'Nous créons des silhouettes pérennes qui transcendent les saisons plutôt que de céder à l\'éphémère.'
    }
  ];

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
            Histoire
          </span>
        </div>
      </header>

      {/* Hero Cover */}
      <section className="relative overflow-hidden bg-stone-950 text-white min-h-[380px] sm:min-h-[460px] flex items-center">
        <img
          src="https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg"
          alt="L'Atelier Stell's Hope"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-10 py-16 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-white/10 text-rose-300 border border-white/15 backdrop-blur-md mb-4">
            <Sparkles className="w-3 h-3 text-terracotta-400" />
            La Maison Stell's Hope
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-4">
            L'Élégance comme une seconde nature
          </h1>
          <p className="text-stone-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Née de la passion pour le beau geste et les coupes architecturales, Stell's Hope redéfinit le vestiaire contemporain à travers l'artisanat et la pureté des lignes.
          </p>
        </div>
      </section>

      {/* Story section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-100">
              Genèse & Vision
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-stone-950">
              Créer pour durer, sublimer le quotidien
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Fondée avec la conviction intime que le vêtement doit magnifier la posture sans jamais la contraindre, Stell's Hope réunit le meilleur du savoir-faire tailleur et l'exigence contemporaine.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Nous sélectionnons chaque fibre auprès d'ateliers partenaires respectant des chartes environnementales strictes, alliant tombé noble et durabilité éprouvée.
            </p>
            <div className="pt-2 flex items-center gap-6">
              <div>
                <p className="font-serif text-3xl font-bold text-stone-950">100%</p>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">Matières certifiées</p>
              </div>
              <div className="w-px h-10 bg-stone-200" />
              <div>
                <p className="font-serif text-3xl font-bold text-stone-950">Atelier</p>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider mt-0.5">Confection soignée</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-card-luxury">
            <img
              src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg"
              alt="Artisanat Stell's Hope"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white text-xs">
              <p className="font-serif text-base italic mb-1">« La perfection réside dans ce qui ne se voit pas au premier regard. »</p>
              <p className="text-white/70 text-[10px] tracking-wider uppercase">— Atelier de prototypage</p>
            </div>
          </div>
        </div>

        {/* Values 4-grid */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-12 shadow-sm space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-950 mb-2">
              Les Piliers de notre Maison
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Quatre principes cardinaux qui guident chacune de nos pièces, du dessin préparatoire au point d'arrêt final.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-950 text-white flex items-center justify-center shadow-card-luxury">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-medium text-stone-900">{val.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commitment box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-stone-950 text-white relative overflow-hidden shadow-card-luxury flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-lg">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-rose-300">
              Passez les portes de l'Atelier
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium">
              Vivez l'expérience Stell's Hope
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Explorez nos dernières créations ou échangez directement avec nos conseillers de style.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/boutique"
              onClick={onClose}
              className="px-6 py-3.5 rounded-full bg-white text-stone-950 font-semibold text-xs tracking-wider uppercase hover:bg-stone-100 transition-colors shadow-sm"
            >
              Explorer les collections
            </Link>
            <Link
              to="/contact"
              onClick={onClose}
              className="px-6 py-3.5 rounded-full bg-white/10 text-white border border-white/20 font-semibold text-xs tracking-wider uppercase hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}