import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Clock, 
  TrendingUp, 
  Smartphone, 
  XOctagon, 
  CheckCircle2, 
  CalendarX, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  Store,
  X,
  ChevronDown
} from 'lucide-react';

interface Tenant {
  id: number;
  slug: string;
  name: string;
  logo: string;
  cover_image: string;
}

export default function LandingPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginSlug, setLoginSlug] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/tenants')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTenants(data);
        }
      })
      .catch(err => console.error('Error fetching tenants:', err));
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginSlug.trim()) {
      navigate(`/${loginSlug.trim().toLowerCase()}/admin/login`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-white selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Scissors className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white hidden sm:block">Barber Network</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-sm font-medium text-text-light hover:text-white transition-colors"
            >
              Login Admin
            </button>
            <Link to="/criar-conta" className="px-5 py-2.5 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
              Criar Conta
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Admin Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 w-full max-w-md relative shadow-2xl"
            >
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h3>
              <p className="text-zinc-400 mb-6">Digite o link da sua barbearia para acessar o painel administrativo.</p>
              
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Link da Barbearia</label>
                  <div className="flex items-center">
                    <span className="text-zinc-500 mr-2">app.com/</span>
                    <input 
                      type="text" 
                      required
                      placeholder="sua-barbearia"
                      value={loginSlug}
                      onChange={(e) => setLoginSlug(e.target.value)}
                      className="w-full p-3 rounded-xl border border-white/10 bg-zinc-950 text-white placeholder:text-zinc-600 focus:border-white/30 outline-none transition-colors"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Acessar Painel
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/80 mb-6 inline-block">
              O sistema definitivo para barbearias de alto nível
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight mb-6 leading-tight">
              Sua barbearia no <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                piloto automático.
              </span>
            </h1>
            <p className="text-xl text-text-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Pare de perder tempo agendando pelo WhatsApp. Tenha seu próprio aplicativo de agendamentos, com a sua marca, e foque no que realmente importa: cortar cabelo e faturar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/criar-conta" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center group">
                Profissionalizar minha barbearia
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#detalhes" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-zinc-800 transition-all flex items-center justify-center">
                Ver mais informações
              </a>
            </div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-16 flex justify-center"
            >
              <a href="#detalhes" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/30 transition-all">
                <ChevronDown className="w-6 h-6" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Problem (Drawbacks) */}
      <section id="detalhes" className="py-24 px-6 bg-zinc-900/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">O preço invisível de não ter um sistema</h2>
            <p className="text-text-light text-lg max-w-2xl mx-auto">
              Continuar agendando de forma manual está custando dinheiro, tempo e a imagem da sua barbearia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-zinc-950 border border-white/10"
            >
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Escravidão do WhatsApp</h3>
              <p className="text-zinc-400 leading-relaxed">
                Você para o corte a todo momento para responder mensagens. Se demorar, o cliente procura outro barbeiro. Seu tempo livre desaparece.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-zinc-950 border border-white/10"
            >
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                <CalendarX className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Furos e Esquecimentos</h3>
              <p className="text-zinc-400 leading-relaxed">
                Clientes esquecem o horário, você confunde as anotações no caderno e acaba com horários vagos que não geram faturamento.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-zinc-950 border border-white/10"
            >
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                <XOctagon className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Imagem Amadora</h3>
              <p className="text-zinc-400 leading-relaxed">
                Sem um link profissional, sua barbearia é vista como apenas "mais uma". Você perde a chance de transmitir autoridade e valor.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Solution (Benefits) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">A revolução na sua barbearia</h2>
            <p className="text-text-light text-lg max-w-2xl mx-auto">
              O Barber Network entrega tudo que você precisa para escalar seu negócio e oferecer uma experiência premium.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Agenda Lotada 24/7</h3>
                  <p className="text-text-light">Seu link de agendamento funciona de madrugada, nos finais de semana e feriados. O cliente escolhe o horário sozinho, sem depender de você.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Sua Marca, Suas Cores</h3>
                  <p className="text-text-light">Não é um app genérico. Você personaliza o sistema com seu logo, foto de capa e as cores da sua barbearia. Uma experiência 100% sua.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Gestão Inteligente</h3>
                  <p className="text-text-light">Painel administrativo completo para acompanhar faturamento, serviços mais populares e histórico de clientes. Tome decisões baseadas em dados.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-3xl transform rotate-3 scale-105 border border-white/10" />
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                  <div>
                    <h4 className="text-white font-bold text-lg">Barbearia Premium</h4>
                    <p className="text-sm text-text-light">app.com/premium</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-zinc-950">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Corte Degradê</p>
                          <p className="text-xs text-text-light">45 min</p>
                        </div>
                      </div>
                      <span className="text-white font-bold">R$ 45,00</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6 bg-zinc-900/50 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-12 text-center">A diferença é clara</h2>
          
          <div className="bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-2 border-b border-white/10">
              <div className="p-6 text-center border-r border-white/10 bg-red-500/5">
                <h3 className="text-lg font-bold text-white/50">Sem Sistema (Manual)</h3>
              </div>
              <div className="p-6 text-center bg-white/5">
                <h3 className="text-lg font-bold text-white">Com Barber Network</h3>
              </div>
            </div>
            
            {[
              ['Agendamento depende da sua resposta', 'Cliente agenda sozinho em segundos'],
              ['Risco alto de esquecimentos e furos', 'Organização impecável e automática'],
              ['Mistura vida pessoal e profissional no WhatsApp', 'Painel profissional separado'],
              ['Imagem de barbearia amadora', 'Autoridade e percepção de alto valor'],
              ['Dificuldade em saber o faturamento exato', 'Métricas e relatórios na palma da mão']
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-2 border-b border-white/10 last:border-0">
                <div className="p-6 border-r border-white/10 flex items-center gap-3 text-zinc-400">
                  <XOctagon className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-sm">{row[0]}</span>
                </div>
                <div className="p-6 flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span className="text-sm font-medium">{row[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lojas Parceiras */}
      {tenants.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Barbearias Parceiras</h2>
              <p className="text-text-light text-lg max-w-2xl mx-auto">
                Conheça algumas das barbearias que já estão utilizando o Barber Network para escalar seus negócios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tenants.map(tenant => (
                <Link 
                  key={tenant.id} 
                  to={`/${tenant.slug}`}
                  className="group bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 block"
                >
                  <div className="h-40 w-full relative bg-zinc-800 overflow-hidden">
                    {tenant.cover_image ? (
                      <img src={tenant.cover_image} alt="Capa" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <Store className="w-12 h-12 text-zinc-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                  </div>
                  <div className="p-6 relative">
                    <div className="w-16 h-16 rounded-2xl border-4 border-zinc-900 bg-zinc-800 absolute -top-10 left-6 overflow-hidden shadow-xl flex items-center justify-center">
                      {tenant.logo ? (
                        <img src={tenant.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Scissors className="w-6 h-6 text-zinc-500" />
                      )}
                    </div>
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-white mb-1">{tenant.name}</h3>
                      <p className="text-sm text-zinc-400 mb-4">app.com/{tenant.slug}</p>
                      <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                        Acessar barbearia <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Simples e Transparente</h2>
          <p className="text-text-light text-lg mb-12">Sem taxas escondidas, sem comissão por agendamento. Um valor fixo para você crescer.</p>
          
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-10 max-w-lg mx-auto relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Plano Profissional</h3>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-5xl font-display font-bold text-white">R$ 70</span>
              <span className="text-zinc-400">/mês</span>
            </div>
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center text-zinc-300"><CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" /> Agendamentos ilimitados</li>
              <li className="flex items-center text-zinc-300"><CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" /> Página com a sua marca</li>
              <li className="flex items-center text-zinc-300"><CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" /> Painel de gestão completo</li>
              <li className="flex items-center text-zinc-300"><CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" /> Suporte prioritário</li>
            </ul>
            <Link to="/criar-conta" className="block w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors text-center">
              Começar agora
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/5 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Pronto para dar o próximo passo?
          </h2>
          <p className="text-xl text-text-light mb-10">
            Junte-se às barbearias que estão dominando o mercado. Crie seu sistema agora e transforme a gestão do seu negócio hoje mesmo.
          </p>
          <Link to="/criar-conta" className="inline-flex items-center px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all group shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Criar minha conta agora
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-zinc-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Barber Network. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
