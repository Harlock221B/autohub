import { useNavigate } from 'react-router-dom';
import { 
  CarFront, ShieldCheck, Wrench, TrendingUp, ChevronRight, 
  Menu, X, Mail, Phone, MapPin, CheckCircle2 
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Efeito para mudar o fundo do Header ao fazer scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 overflow-x-hidden selection:bg-red-500/30 selection:text-red-200">
      
      {/* Background Decorativo Global */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* HEADER / NAVBAR */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="p-2 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg">
              <CarFront className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter">
              AUTO<span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent">HUB</span>
            </h1>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <button onClick={() => scrollToSection('como-funciona')} className="hover:text-white transition-colors">Como Funciona</button>
            <button onClick={() => scrollToSection('sobre')} className="hover:text-white transition-colors">Sobre Nós</button>
            <button onClick={() => scrollToSection('contato')} className="hover:text-white transition-colors">Contato</button>
          </nav>

          {/* Botões de Ação Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-zinc-300 hover:text-white transition-colors">Entrar</button>
            <button onClick={() => navigate('/register')} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-bold rounded-xl transition-all hover:scale-105 active:scale-95">Criar Conta</button>
          </div>

          {/* Menu Mobile Toggle */}
          <button className="md:hidden text-zinc-300 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MENU MOBILE */}
      <div className={`fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-3xl transform transition-transform duration-300 pt-24 px-6 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col gap-6`}>
        <button onClick={() => scrollToSection('como-funciona')} className="text-xl font-bold text-zinc-400 text-left">Como Funciona</button>
        <button onClick={() => scrollToSection('sobre')} className="text-xl font-bold text-zinc-400 text-left">Sobre Nós</button>
        <button onClick={() => scrollToSection('contato')} className="text-xl font-bold text-zinc-400 text-left border-b border-white/10 pb-6">Contato</button>
        <button onClick={() => navigate('/login')} className="w-full py-4 bg-white/5 rounded-xl font-bold">Entrar na Conta</button>
        <button onClick={() => navigate('/register')} className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl font-bold">Criar Conta Grátis</button>
      </div>

      <main className="relative z-10">
        
        {/* SECÇÃO 1: HERO (Página Inicial) */}
        <section className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6 md:px-12 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 backdrop-blur-md mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              O prontuário digital definitivo para o seu veículo
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              A história do seu carro <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">valoriza o seu património.</span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Registe manutenções, sincronize valores com a Tabela FIPE e crie um dossiê inalterável que aumenta o valor de revenda do seu veículo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button onClick={() => navigate('/register')} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2">
                Começar Gratuitamente <ChevronRight size={18} />
              </button>
              <button onClick={() => scrollToSection('como-funciona')} className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
                Conhecer a Plataforma
              </button>
            </div>
          </div>
        </section>

        {/* SECÇÃO 2: COMO FUNCIONA (Features) */}
        <section id="como-funciona" className="py-24 px-6 md:px-12 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-2">Como Funciona</h3>
              <h2 className="text-3xl md:text-5xl font-black">Gestão inteligente e integrada.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                  <Wrench size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3">Registo de Manutenções</h4>
                <p className="text-zinc-400 leading-relaxed">Guarde faturas, custos e anotações de cada serviço realizado no veículo. Nunca mais esqueça quando trocou o óleo ou a correia dentada.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 md:-translate-y-4">
                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3">Dossiê Inalterável</h4>
                <p className="text-zinc-400 leading-relaxed">Crie uma linha do tempo transparente. Na hora da revenda, um histórico comprovado transmite confiança e acelera o negócio.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                  <TrendingUp size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3">Sincronização FIPE</h4>
                <p className="text-zinc-400 leading-relaxed">Acompanhe a valorização ou depreciação do seu património em tempo real com a nossa integração oficial e direta com a Tabela FIPE.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECÇÃO 3: SOBRE NÓS */}
        <section id="sobre" className="py-24 px-6 md:px-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6 z-10">
              <h3 className="text-sm font-bold text-orange-500 uppercase tracking-widest">Sobre o AutoHub</h3>
              <h2 className="text-3xl md:text-5xl font-black leading-tight">Nascemos para acabar com a desconfiança automotiva.</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Comprar e vender um carro usado sempre foi um jogo de sorte. O AutoHub foi criado por entusiastas automotivos para centralizar dados, organizar manutenções e criar um padrão de transparência.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-emerald-500" size={20} /> Feito para proprietários exigentes.</li>
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-emerald-500" size={20} /> Dados seguros e encriptados na nuvem.</li>
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-emerald-500" size={20} /> Design premium e intuitivo.</li>
              </ul>
            </div>
            
            <div className="flex-1 relative w-full aspect-square max-w-md mx-auto">
              {/* Elemento Decorativo Visual simulando o App */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-orange-500/20 rounded-[3rem] blur-2xl"></div>
              <div className="absolute inset-4 bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl p-8 flex flex-col justify-between overflow-hidden">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center"><CarFront className="text-red-500"/></div>
                   <div><div className="h-4 w-24 bg-white/10 rounded mb-2"></div><div className="h-3 w-32 bg-white/5 rounded"></div></div>
                 </div>
                 <div className="space-y-4">
                   <div className="h-20 w-full bg-white/5 rounded-2xl"></div>
                   <div className="h-20 w-full bg-white/5 rounded-2xl"></div>
                   <div className="h-20 w-full bg-white/5 rounded-2xl"></div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECÇÃO 4: CONTATO & FOOTER */}
        <section id="contato" className="pt-24 pb-12 px-6 md:px-12 bg-zinc-950 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg"><CarFront className="text-white" size={20} /></div>
                <h1 className="text-xl font-black tracking-tighter">AUTO<span className="text-red-500">HUB</span></h1>
              </div>
              <p className="text-zinc-500 max-w-xs mb-8">O padrão definitivo de gestão e transparência para o mercado automotivo.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-zinc-400"><Mail size={18} /> contato@autohub.com.br</div>
                <div className="flex items-center gap-4 text-zinc-400"><Phone size={18} /> (11) 99999-9999</div>
                <div className="flex items-center gap-4 text-zinc-400"><MapPin size={18} /> São Paulo, SP - Brasil</div>
              </div>
            </div>
            
            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-6">Fale Connosco</h3>
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <input type="text" placeholder="Seu Nome" className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-white focus:border-red-500 outline-none" />
                <input type="email" placeholder="Seu E-mail" className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-white focus:border-red-500 outline-none" />
                <textarea placeholder="Como podemos ajudar?" rows="3" className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-white focus:border-red-500 outline-none resize-none"></textarea>
                <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">Enviar Mensagem</button>
              </form>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} AutoHub. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}