import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  MessageCircle, 
  ArrowRight, 
  Star, 
  Package, 
  User,
  Instagram,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { db, OperationType, handleFirestoreError } from './firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

interface Review {
  id: string;
  name: string;
  role?: string;
  text: string;
  rating: number;
  createdAt: Timestamp;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const App: React.FC = () => {
  const instagramUrl = "https://www.instagram.com/_venzamoda/";
  const whatsappUrl = "https://chat.whatsapp.com/HsFA1xaX8LpLpqFmniyti7?mode=hq1tsha";
  const logoUrl = "https://lh3.googleusercontent.com/d/1k8Pd3jl-j4udPghwwUJVKrcqca5r0R7e";
  const profileImageUrl = "https://lh3.googleusercontent.com/d/1G1HB3rH1t-llWGMLc8rgxXa_lmQE7EPw";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', role: '', text: '', rating: 5 });
  const [showForm, setShowForm] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setHasError(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        ...newReview,
        createdAt: serverTimestamp()
      });
      setNewReview({ name: '', role: '', text: '', rating: 5 });
      setShowForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-terracotta/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-brand-nude">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <img 
              src={logoUrl} 
              alt="Venza Moda Logo" 
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border border-brand-nude"
              referrerPolicy="no-referrer"
            />
            <div className="text-lg md:text-2xl font-serif font-bold tracking-widest text-brand-terracotta uppercase truncate max-w-[150px] sm:max-w-none">
              VENZA MODA
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest font-medium">
            <a href="#sobre" className="hover:text-brand-terracotta transition-colors">Sobre</a>
            <a href="#colecao" className="hover:text-brand-terracotta transition-colors">Coleção</a>
            <a href="#diferenciais" className="hover:text-brand-terracotta transition-colors">Diferenciais</a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-brand-terracotta text-white px-6 py-2 rounded-full hover:bg-brand-dark transition-all">
              Instagram
            </a>
          </div>
          <div className="md:hidden flex items-center space-x-4">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-brand-dark">
              <Instagram size={24} />
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-brand-dark">
              <MessageCircle size={24} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Moda Feminina Premium" 
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white text-center md:text-left"
          >
            <span className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-4 block font-medium">Venza Moda & Acessórios</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl mb-8 leading-[1.1]">
              Vista a sua <span className="italic">essência</span>, revele sua força.
            </h1>
            <p className="text-base md:text-xl mb-10 text-brand-nude/90 font-light leading-relaxed">
              Curadoria premium para a mulher que equilibra todos os seus papéis com elegância e determinação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-brand-gold text-brand-dark px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
              >
                Ver Novidades no Instagram
                <Instagram className="ml-2" size={20} />
              </a>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Grupo VIP WhatsApp
                <MessageCircle className="ml-2" size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sobre Nós */}
      <section id="sobre" className="py-16 md:py-24 bg-brand-nude/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 md:order-1"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={profileImageUrl} 
                  alt="Sara Fernandes - Venza Moda" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-2xl shadow-xl hidden lg:block max-w-xs border border-brand-nude">
                <p className="font-serif italic text-brand-terracotta text-lg">
                  "A moda não é apenas sobre o que você veste, mas sobre como você se sente para conquistar o mundo."
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 text-center md:text-left"
            >
              <span className="text-brand-terracotta font-semibold uppercase tracking-widest text-sm mb-4 block">Nossa História</span>
              <h2 className="text-3xl md:text-5xl mb-8 leading-tight">Venza Moda: De Mãe e Estudante a Empreendedora</h2>
              <div className="space-y-6 text-brand-dark/80 leading-relaxed text-base md:text-lg">
                <p>
                  Olá, eu sou <strong>Sara Fernandes</strong>. Aos 32 anos, minha vida é um mosaico de papéis: sou mãe da Amanda e do Heitor, estudante de Estética e Cosméticos, e uma mulher movida por uma fé inabalável.
                </p>
                <p>
                  A <strong>Venza Moda & Acessórios</strong> nasceu do desejo de unir minha paixão pelo autocuidado com a necessidade de oferecer às mulheres algo que fosse além de roupas. Eu queria criar uma curadoria que falasse com a mulher moderna — aquela que corre atrás dos sonhos, cuida da família e não abre mão de sua sofisticação.
                </p>
                <p>
                  Cada peça aqui foi escolhida com a determinação de quem sabe que a beleza exterior é um reflexo da força que carregamos por dentro. Seja bem-vinda à Venza, feita para exaltar o seu poder.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vitrine Estratégica */}
      <section id="colecao" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl mb-4">Curadoria Venza</h2>
            <p className="text-brand-dark/60 max-w-xl mx-auto text-sm md:text-base">Peças selecionadas para elevar seu estilo em todas as ocasiões.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Roupas', 
                img: 'https://lh3.googleusercontent.com/d/1y6Z95GfbCtK0XWhjrR6GKYQLqW2fMWST',
                desc: 'Elegância em cada costura.'
              },
              { 
                title: 'Bolsas', 
                img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop',
                desc: 'O toque final de sofisticação.'
              },
              { 
                title: 'Acessórios', 
                img: 'https://lh3.googleusercontent.com/d/10LkgpjQiaYdSwTacoEWaGyWHN-9cyupn',
                desc: 'Detalhes que contam sua história.'
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-brand-dark/40 transition-colors" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-3xl mb-1">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section id="diferenciais" className="py-16 md:py-24 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-16 h-16 bg-brand-terracotta rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl mb-4">Curadoria Humanizada</h3>
              <p className="text-white/70">Cada peça é escolhida pensando na rotina real da mulher moderna, unindo conforto e luxo.</p>
            </div>
            
            <div className="text-center p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={32} className="text-brand-dark" />
              </div>
              <h3 className="text-2xl mb-4">Embalagem com Carinho</h3>
              <p className="text-white/70">Receber um pacote nosso é uma experiência sensorial, preparada com fragrâncias e mimos especiais.</p>
            </div>
            
            <div className="text-center p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-16 h-16 bg-brand-nude rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={32} className="text-brand-dark" />
              </div>
              <h3 className="text-2xl mb-4">Atendimento VIP</h3>
              <p className="text-white/70">Consultoria personalizada via WhatsApp para te ajudar a montar looks que valorizam seu biotipo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl mb-4">O que dizem nossas clientes</h2>
            <p className="text-brand-dark/60 mb-8 text-sm md:text-base">Depoimentos reais de quem vive a experiência Venza.</p>
            <div className="flex justify-center space-x-1 text-brand-gold">
              {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
            </div>
          </div>
          
          {hasError ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-brand-nude/10 rounded-3xl mb-16">
              <AlertCircle size={48} className="text-brand-terracotta mb-4" />
              <h2 className="text-2xl font-bold mb-2">Ops! Algo deu errado.</h2>
              <p className="text-brand-dark/60 mb-6">Não conseguimos carregar as avaliações no momento.</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-brand-terracotta text-white px-6 py-2 rounded-full font-semibold"
              >
                Tentar Novamente
              </button>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-12 mb-16">
              <Loader2 className="animate-spin text-brand-terracotta" size={48} />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-brand-nude/10 rounded-3xl border border-dashed border-brand-nude mb-16">
              <p className="text-brand-dark/60">Seja a primeira a avaliar! Preencha o formulário abaixo.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
              {reviews.map((testimonial) => (
                <motion.div 
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-brand-nude/20 p-8 rounded-2xl relative flex flex-col h-full"
                >
                  <div className="flex text-brand-gold mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} fill="currentColor" size={14} />)}
                  </div>
                  <p className="text-brand-dark/80 italic mb-6 flex-grow">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-brand-terracotta rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      {testimonial.role && <p className="text-sm text-brand-dark/60">{testimonial.role}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Formulário de Avaliação - Sempre Visível */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-2xl md:text-3xl mb-4">Sua opinião é fundamental</h3>
              <p className="text-brand-dark/60 text-sm md:text-base">Compartilhe sua experiência e ajude outras mulheres a escolherem com confiança.</p>
            </div>

            <form onSubmit={handleSubmitReview} className="bg-brand-nude/10 p-8 md:p-12 rounded-[2rem] border border-brand-nude shadow-sm">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Seu Nome *</label>
                  <input 
                    type="text" 
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-brand-nude focus:outline-none focus:ring-2 focus:ring-brand-terracotta/20 bg-white"
                    placeholder="Como você gostaria de ser chamada?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Sua Profissão (Opcional)</label>
                  <input 
                    type="text" 
                    value={newReview.role}
                    onChange={(e) => setNewReview({...newReview, role: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-brand-nude focus:outline-none focus:ring-2 focus:ring-brand-terracotta/20 bg-white"
                    placeholder="Ex: Arquiteta, Mãe, Empresária"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Sua Nota</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className={`p-1 transition-colors ${newReview.rating >= star ? 'text-brand-gold' : 'text-brand-nude'}`}
                    >
                      <Star fill={newReview.rating >= star ? 'currentColor' : 'none'} size={32} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2">Seu Depoimento *</label>
                <textarea 
                  required
                  value={newReview.text}
                  onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-brand-nude focus:outline-none focus:ring-2 focus:ring-brand-terracotta/20 h-32 bg-white"
                  placeholder="Conte-nos sua experiência com a Venza..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-brand-dark/90 disabled:opacity-50 transition-all transform hover:scale-[1.01]"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                <span>{submitting ? 'Enviando...' : 'Publicar minha avaliação'}</span>
              </button>
            </form>
          </div>
          
          <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-6 md:gap-8 items-center opacity-50 grayscale">
            <div className="flex items-center space-x-2 text-sm md:text-base">
              <ShieldCheck size={20} className="md:w-6 md:h-6" />
              <span className="font-semibold">Compra 100% Segura</span>
            </div>
            <div className="flex items-center space-x-2 text-sm md:text-base">
              <Package size={20} className="md:w-6 md:h-6" />
              <span className="font-semibold">Entrega Garantida</span>
            </div>
            <div className="flex items-center space-x-2 text-sm md:text-base">
              <User size={20} className="md:w-6 md:h-6" />
              <span className="font-semibold">Privacidade Protegida</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24 bg-brand-terracotta text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-6xl mb-6 md:mb-8">Pronta para transformar sua autoestima?</h2>
          <p className="text-lg md:text-xl mb-10 md:mb-12 text-white/80 max-w-2xl mx-auto">
            Fale agora com nossa consultora e descubra as peças que vão revelar a sua melhor versão.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-brand-terracotta px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl hover:scale-105 transition-transform flex items-center justify-center"
            >
              <Instagram className="mr-2" />
              Ver no Instagram
            </a>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl hover:bg-white hover:text-brand-terracotta transition-all flex items-center justify-center"
            >
              <MessageCircle className="mr-2" />
              Entrar no Grupo VIP
            </a>
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/10 rounded-full -ml-48 -mb-48 blur-3xl" />
      </section>

      {/* Footer */}
      <footer className="py-12 bg-brand-dark text-white/60 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="text-lg md:text-xl font-serif font-bold tracking-widest text-white uppercase">
              VENZA MODA & ACESSÓRIOS
            </div>
            <div className="flex space-x-6">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram size={24} /></a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><MessageCircle size={24} /></a>
            </div>
            <div className="text-xs md:text-sm">
              © 2024 Venza Moda & Acessórios. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
