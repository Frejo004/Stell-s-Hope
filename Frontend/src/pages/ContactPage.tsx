import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles, ArrowLeft, MessageSquare, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';
import { eventBus } from '../utils/eventBus';

interface ContactPageProps {
  onClose?: () => void;
}

export default function ContactPage({ onClose }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'conseil',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    eventBus.emit('show-toast', {
      type: 'success',
      message: 'Votre message a bien été transmis à la Conciergerie Stell\'s Hope.'
    });
  };

  return (
    <div className="fixed inset-0 bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-stone-200/80 px-6 sm:px-10 py-4 flex items-center justify-between shadow-sm">
        <button
          onClick={() => onClose ? onClose() : window.history.back()}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour à l'Atelier</span>
        </button>

        <Logo className="h-6" />

        <div className="w-20 text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-100">
            Conciergerie
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-3">
            <Sparkles className="w-3 h-3 text-terracotta-500" />
            À votre entière écoute
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-stone-950 mb-3">
            Contacter la Maison
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
            Pour un conseil personnalisé, une question sur une commande ou un projet sur-mesure, nos stylistes et conseillers vous répondent avec le plus grand soin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="font-serif text-xl font-medium text-stone-950 border-b border-stone-100 pb-4">
                Nos Coordonnées
              </h2>

              <div className="space-y-5 text-xs text-stone-600">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 text-stone-800">
                    <MapPin className="w-4 h-4 text-terracotta-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm">Atelier & Boutique</h3>
                    <p className="text-stone-500 mt-0.5 leading-relaxed">
                      Cocody Riviera Bonoumin<br />
                      Abidjan, Côte d'Ivoire
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 text-stone-800">
                    <Phone className="w-4 h-4 text-terracotta-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm">Téléphone & WhatsApp</h3>
                    <p className="text-stone-500 mt-0.5">+225 07 00 00 00 00</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Assistance directe 6j/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 text-stone-800">
                    <Mail className="w-4 h-4 text-terracotta-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm">Courrier électronique</h3>
                    <p className="text-stone-500 mt-0.5">contact@stellshope.com</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Réponse garantie sous 24 heures ouvrées</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 text-stone-800">
                    <Clock className="w-4 h-4 text-terracotta-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm">Horaires d'ouverture</h3>
                    <p className="text-stone-500 mt-0.5 leading-relaxed">
                      Du lundi au vendredi : 9h00 – 19h00<br />
                      Samedi : 10h00 – 18h00<br />
                      Dimanche : Fermé
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote banner */}
            <div className="p-6 rounded-3xl bg-stone-950 text-white relative overflow-hidden shadow-card-luxury">
              <p className="font-serif text-sm italic text-white/90 leading-relaxed mb-3">
                « L'écoute et le service constituent la première parure de l'élégance. »
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">
                — L'Équipe Stell's Hope
              </p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-stone-950 mb-2">Message bien reçu</h3>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-8 leading-relaxed">
                    Merci {formData.name}. Notre conciergerie a pris connaissance de votre demande et reviendra vers vous à l'adresse <strong>{formData.email}</strong> dans les meilleurs délais.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'conseil', message: '' });
                    }}
                    className="px-6 py-3 rounded-full bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition-colors shadow-card-luxury"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl font-medium text-stone-950 mb-1">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-xs text-stone-500">
                      Renseignez vos coordonnées pour être mis en relation avec le service concerné.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Jean Dupont"
                          className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="jean@exemple.com"
                          className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                        Objet de votre demande
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm"
                      >
                        <option value="conseil">Conseil Style & Tailles</option>
                        <option value="commande">Suivi de commande & Livraison</option>
                        <option value="retour">Retours, Échanges & Remboursement</option>
                        <option value="partenariat">Presse, Partenariats & Événements</option>
                        <option value="autre">Autre demande</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                        Votre message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Précisez votre demande ou vos questions..."
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-4 px-6 rounded-2xl bg-stone-950 text-white font-medium text-xs tracking-wider uppercase hover:bg-stone-800 disabled:opacity-50 transition-all duration-200 shadow-card-luxury flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Transmission en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Transmettre ma demande</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}