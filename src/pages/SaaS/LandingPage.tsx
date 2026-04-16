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
  ChevronDown,
  Users2,
  Trophy,
  Flame,
  Zap,
  TrendingDown,
  Quote
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
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const navigate = useNavigate();

  const mockNotifications = [
    "João acabou de criar uma barbearia ✂️",
    "Estilo & Corte acabou de fazer um agendamento 📅",
    "Ricardo assinou o Plano Profissional 💎",
    "Novo agendamento realizado via link direto 🚀",
    "Mais um barbeiro aderiu ao sistema agora 🔥",
    "Agenda da Barbearia Central lotada para hoje ✅"
  ];

  useEffect(() => {
    // Simulated real-time social proof
    const showNextNotification = () => {
      const randomDelay = Math.floor(Math.random() * 15000) + 10000; // 10-25 seconds
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * mockNotifications.length);
        setActiveNotification(mockNotifications[randomIndex]);
        
        // Hide after 5 seconds
        setTimeout(() => {
          setActiveNotification(null);
          showNextNotification();
        }, 5000);
      }, randomDelay);
    };

    showNextNotification();

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
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed bottom-6 left-6 z-[100] bg-white text-black p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-zinc-200 lg:max-w-xs"
          >
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Atividade Recente</p>
              <p className="text-sm font-medium leading-tight">{activeNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="mb-10 space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm md:text-base font-bold text-zinc-400">
                <span className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <Users2 className="w-4 h-4 text-white" />
                  🔥 Mais de 127 barbeiros já estão usando
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  💈 +3.842 agendamentos realizados nos últimos 30 dias
                </span>
              </div>
              <span className="text-white font-medium block">💰 Barbeiros aumentando o faturamento todos os dias</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-display font-bold text-white tracking-tight mb-8 leading-tight">
              Sua barbearia no <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                piloto automático.
              </span>
            </h1>
            <p className="text-xl text-text-light max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Pare de perder tempo agendando pelo WhatsApp. Tenha seu próprio aplicativo de agendamentos, com a sua marca, e foque no que realmente importa: <span className="text-white underline decoration-white/30">cortar cabelo e faturar mais</span>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/criar-conta" className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-gray-200 transition-all flex items-center justify-center group shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                Profissionalizar minha barbearia <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
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
      <section className="py-24 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-white font-bold text-sm tracking-widest uppercase mb-4 block">Resultados Reais</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Transformação, não apenas elogios.</h2>
            <p className="text-text-light text-xl max-w-2xl mx-auto mt-6">
              Veja por que os melhores barbeiros do Brasil estão migrando para o Barber Network.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Eu vivia esquecendo cliente... agora minha agenda lota sozinha e não perco mais um minuto respondendo 'tem horário?'",
                author: "Carlos",
                role: "Barbeiro Profissional",
                stat: "Tempo livre dobrado"
              },
              {
                quote: "Só com os lembretes automáticos já parei de perder dinheiro com 'furos'. O sistema se paga sozinho em 2 dias.",
                author: "Rafael",
                role: "Dono de barbearia",
                stat: "Zero esquecimentos"
              },
              {
                quote: "Em 1 mês usando o sistema, aumentei meu faturamento em 32% só pela facilidade que o cliente tem de agendar.",
                author: "Diego",
                role: "Mestre Barbeiro",
                stat: "+32% de faturamento"
              }
            ].map((testimony, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-zinc-900 border border-white/10 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-16 h-16 text-white" />
                </div>
                <div className="mb-6 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-4 h-4 rounded-full bg-white/20" />
                  ))}
                </div>
                <p className="text-white text-lg leading-relaxed mb-8 italic">"{testimony.quote}"</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                  <div>
                    <h4 className="text-white font-bold">{testimony.author}</h4>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{testimony.role}</p>
                  </div>
                  <div className="text-sm font-display font-bold text-white px-3 py-1 bg-white/5 rounded-lg border border-white/10 uppercase">
                    {testimony.stat}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Proof / Screen Previews */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="flex items-center gap-2 text-white font-bold mb-6">
                <Flame className="w-5 h-5" />
                DADOS QUE NÃO MENTEM
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
                Tudo sob controle <br /> 
                <span className="text-zinc-500">na palma da mão.</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 p-6 rounded-3xl border border-white/10 bg-zinc-900/50">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Agenda Lotada</h3>
                    <p className="text-zinc-400">Vizualização clara de todos os seus compromissos, organizados por hora e barbeiro.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 rounded-3xl border border-white/10 bg-zinc-900/50">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Faturamento em Tempo Real</h3>
                    <p className="text-zinc-400">Saiba exatamente quanto sua barbearia produziu no dia, na semana e no mês.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 rounded-3xl border border-white/10 bg-zinc-900/50">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0">
                    <Trophy className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Ranking de Profissionais</h3>
                    <p className="text-zinc-400">Descubra quem são seus barbeiros mais produtivos e os serviços mais buscados.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Visual Mock of Dashboard */}
              <motion.div 
                initial={{ rotate: 10, y: 100, opacity: 0 }}
                whileInView={{ rotate: 0, y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl relative z-10"
              >
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">dashboard.barbernetwork.app</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-zinc-500 font-bold mb-1 uppercase">Faturamento Hoje</p>
                    <p className="text-2xl font-display font-bold text-white">R$ 580,00</p>
                    <div className="flex items-center gap-1 text-xs text-green-500 mt-2 font-bold">
                      <TrendingUp className="w-3 h-3" /> +12% vs. ontem
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-zinc-500 font-bold mb-1 uppercase">Confirmados</p>
                    <p className="text-2xl font-display font-bold text-white">18/20</p>
                    <div className="flex items-center gap-1 text-xs text-white/50 mt-2 font-medium">
                      Otimização de 90%
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <p className="text-xs text-zinc-500 font-bold mb-2 uppercase">Próximos Agendamentos</p>
                   {[
                     { name: "João Silva", time: "14:00", service: "Corte Degradê" },
                     { name: "Marcos Oliveira", time: "15:00", service: "Barba & Toalha" },
                     { name: "Ricardo Dias", time: "16:00", service: "Corte + Pigmentação" }
                   ].map((a, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-white/5">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                           {a.name[0]}
                         </div>
                         <div>
                            <p className="text-white text-sm font-bold">{a.name}</p>
                            <p className="text-xs text-zinc-500">{a.service}</p>
                         </div>
                       </div>
                       <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded-md">{a.time}</span>
                     </div>
                   ))}
                </div>
              </motion.div>

              {/* Decorative side cards */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white text-black p-4 rounded-2xl shadow-2xl z-20 border border-zinc-200 hidden lg:block"
              >
                <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <Flame className="w-3 h-3 text-red-500" />
                  Alerta Agenda
                </div>
                <p className="text-sm font-bold leading-tight">Você atingiu 95% da <br />capacidade para hoje!</p>
              </motion.div>

              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: -20, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -left-20 bottom-10 bg-zinc-900 border border-white/20 p-6 rounded-3xl shadow-2xl z-0 hidden lg:block"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Ranking Mensal</p>
                    <p className="text-sm font-bold text-white">Top 1: Carlos Alberto</p>
                  </div>
                </div>
                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-yellow-500 rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="py-24 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center max-w-3xl mb-12">
            <h2 className="text-4xl md:text-7xl font-display font-black mb-6 uppercase leading-tight italic">
               Diferencie os Profissionais <br /> <span className="text-zinc-400">dos amadores.</span>
            </h2>
            <p className="text-xl font-medium leading-relaxed">
              Sistema utilizado por barbeiros profissionais que querem crescer de verdade. O caderninho e as mensagens perdidas no WhatsApp ficaram no passado. Ideal para quem quer sair da estagnação e virar uma referência na região.
            </p>
          </div>
          <motion.div 
             whileHover={{ scale: 1.02 }}
             className="px-8 py-3 bg-black text-white rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-2"
          >
             <ShieldCheck className="w-5 h-5" />
             Aprovado por profissionais do setor
          </motion.div>
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
      <section className="py-24 px-6 bg-zinc-950 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 uppercase italic">A Oferta Irresistível</h2>
            <p className="text-text-light text-xl mb-4">Sem taxas escondidas, sem comissão. Apenas o valor que cabe no seu bolso.</p>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-500 text-white font-black rounded-full animate-pulse uppercase text-sm tracking-widest">
              <Flame className="w-5 h-5" />
              Promoção Ativa: R$ 50/mês
            </div>
            <p className="text-red-500 font-black mt-6 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
              <XOctagon className="w-5 h-5" /> 
              Apenas 23 barbeiros ainda podem entrar com esse valor!
            </p>
          </div>
          
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
             <div className="p-10 rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500 group-hover:h-[6px] transition-all"></div>
                <h3 className="text-xl font-bold text-white/50 mb-2 uppercase tracking-widest">Antigamente</h3>
                <div className="flex items-center gap-2 mb-8">
                  <span className="text-3xl font-display font-bold text-zinc-600 line-through">R$ 97</span>
                  <span className="text-zinc-700">/mês</span>
                </div>
                <p className="text-zinc-600 text-sm mb-0 flex items-center gap-2"><TrendingDown className="w-4 h-4" /> Caderninho e perda de tempo</p>
             </div>

             <div className="p-10 rounded-3xl border-2 border-white bg-zinc-900 shadow-[0_0_60px_rgba(255,255,255,0.1)] relative overflow-hidden scale-110 z-10">
               <div className="absolute -top-4 -right-4 bg-white text-black px-8 py-4 rotate-12 font-black uppercase text-xs">Melhor Oferta</div>
               <h3 className="text-2xl font-bold text-white mb-2">Plano Pro Evolution</h3>
               <div className="flex items-center gap-3 mb-8">
                <span className="text-6xl font-display font-bold text-white">R$ 50</span>
                <span className="text-zinc-400">/mês</span>
               </div>
               <ul className="space-y-4 mb-10 text-left">
                <li className="flex items-center text-zinc-300"><CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" /> Agendamentos Ilimitados</li>
                <li className="flex items-center text-zinc-300"><CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" /> Lembretes Automáticos</li>
                <li className="flex items-center text-zinc-300"><CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" /> Gestão de Faturamento</li>
                <li className="flex items-center text-zinc-300"><CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" /> Suporte VIP 24h</li>
               </ul>
               <Link to="/criar-conta" className="block w-full py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-gray-200 transition-all text-center uppercase shadow-2xl active:scale-95">
                Garantir minha vaga agora
               </Link>
               <p className="text-zinc-500 text-[10px] text-center mt-6 font-bold uppercase tracking-widest">Preço promocional vitalício para os primeiros inscritos</p>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden bg-white text-black">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-2xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-8xl font-display font-black mb-8 uppercase leading-tight italic">
            MAIS DE 100 BARBEIROS <br /> JÁ TOMARAM A DECISÃO.
          </h2>
          <p className="text-2xl font-bold mb-12 max-w-2xl leading-relaxed">
            Agora é a sua vez. Ou você continua perdendo cliente pelo WhatsApp... ou começa hoje a automatizar seu negócio e faturar como um profissional.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Link to="/criar-conta" className="inline-flex items-center px-12 py-6 bg-black text-white rounded-full font-black text-2xl hover:scale-105 transition-all group shadow-2xl uppercase italic">
              Começar hoje por R$ 50/mês
              <ArrowRight className="w-8 h-8 ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            <p className="text-zinc-500 font-bold uppercase tracking-tighter text-xs">Últimas 23 vagas restando para o preço atual</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-zinc-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Barber Network. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
