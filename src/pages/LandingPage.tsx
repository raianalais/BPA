import { useNavigate } from 'react-router-dom';
import logoBpaSemFundo from '@/assets/logo-bpa-semfundo.png';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  ClipboardCheck,
  UserSearch,
  TrendingUp,
  FileDown,
  Stethoscope,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const features = [
  {
    icon: ClipboardCheck,
    title: 'Registro de Atendimentos',
    desc: 'Registre procedimentos, dados do paciente e do profissional de forma rápida e segura, garantindo a identificação correta de cada atendimento.',
  },
  {
    icon: UserSearch,
    title: 'Automação e Confiabilidade',
    desc: 'O sistema classifica automaticamente os procedimentos e realiza cálculos como idade do paciente, reduzindo erros e aumentando a precisão.',
  },
  {
    icon: TrendingUp,
    title: 'Gestão e Eficiência',
    desc: 'Encontre e acompanhe informações com filtros e seleções inteligentes, otimizando o tempo e facilitando o trabalho da equipe.',
  },
  {
    icon: FileDown,
    title: 'Relatórios e Prestação de Contas',
    desc: 'Gere relatórios por período e faça o download dos dados de maneira simples, garantindo organização e agilidade nas informações.',
  },
];

const slides = [
  {
    icon: Stethoscope,
    title: 'Sistema BPA',
    subtitle: 'Gestão odontológica completa para CEO',
    gradient: 'linear-gradient(135deg, #043E6E, #0876D6)',
    info: {
      title: 'Plataforma completa para CEO',
      desc: 'Centralize a operação do Centro de Especialidades Odontológicas em um único sistema, com fluxos pensados para a rotina da equipe.',
      cta: 'Saiba mais',
    },
  },
  {
    icon: ClipboardCheck,
    title: 'Atendimentos',
    subtitle: 'Registro rápido, seguro e organizado',
    gradient: 'linear-gradient(135deg, #1A827E, #64CFBB)',
    info: {
      title: 'Registro de atendimentos sem fricção',
      desc: 'Cadastre procedimentos, pacientes e profissionais em poucos cliques, com validações automáticas que evitam retrabalho.',
      cta: 'Ver detalhes',
    },
  },
  {
    icon: TrendingUp,
    title: 'Eficiência',
    subtitle: 'Mais agilidade no dia a dia da equipe',
    gradient: 'linear-gradient(135deg, #0876D6, #8574C0)',
    info: {
      title: 'Eficiência operacional',
      desc: 'Filtros inteligentes, classificações automáticas e atalhos pensados para reduzir o tempo gasto em tarefas repetitivas.',
      cta: 'Explorar',
    },
  },
  {
    icon: FileDown,
    title: 'Relatórios BPA',
    subtitle: 'Exportação simples e padronizada',
    gradient: 'linear-gradient(135deg, #043E6E, #1A827E)',
    info: {
      title: 'Relatórios prontos para envio',
      desc: 'Gere arquivos BPA-C e BPA-I no padrão exigido e exporte por período com poucos cliques, garantindo conformidade.',
      cta: 'Conhecer relatórios',
    },
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    const interval = setInterval(() => api.scrollNext(), 5000);
    return () => {
      api.off('select', onSelect);
      clearInterval(interval);
    };
  }, [api]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F5F5] px-4 py-10">
      {/* Background blurred blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full bg-[#0876D6]/40 blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 h-[460px] w-[460px] rounded-full bg-[#1A827E]/40 blur-[130px]" />
        <div className="absolute -bottom-20 -right-10 h-[460px] w-[460px] rounded-full bg-[#8574C0]/40 blur-[130px]" />
        <div className="absolute top-10 right-1/4 h-[300px] w-[300px] rounded-full bg-[#64CFBB]/30 blur-[110px]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center">
        {/* Logo */}
        <img src={logoBpaSemFundo} alt="BPA" className="mb-6 h-28 w-auto object-contain drop-shadow-md" />

        <div className="grid w-full gap-6 lg:grid-cols-5 lg:items-stretch">
          {/* Left column - Carousel (2/5) */}
          <div
            className="flex flex-col rounded-3xl border p-5 sm:p-6 lg:col-span-2"
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <Carousel
              setApi={setApi}
              opts={{ loop: true, align: 'start' }}
              className="relative w-full"
            >
              <CarouselContent>
                {slides.map((s, i) => (
                  <CarouselItem key={i}>
                    <div
                      className="flex aspect-[5/4] w-full flex-col items-center justify-center rounded-2xl p-6 text-center text-white shadow-lg transition-all"
                      style={{ background: s.gradient }}
                    >
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <s.icon className="h-8 w-8" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold">{s.title}</h3>
                      <p className="max-w-xs text-sm leading-relaxed opacity-90">{s.subtitle}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 border-0 bg-white/60 text-[#043E6E] hover:bg-white/80" />
              <CarouselNext className="right-2 border-0 bg-white/60 text-[#043E6E] hover:bg-white/80" />
            </Carousel>

            {/* Indicators */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir para slide ${i + 1}`}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    current === i ? 'w-6 bg-[#043E6E]' : 'w-2 bg-[#043E6E]/30'
                  }`}
                />
              ))}
            </div>

            {/* Dynamic info linked to current slide */}
            <div
              key={current}
              className="mt-5 rounded-2xl border p-5 text-left animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{
                background: 'rgba(255,255,255,0.35)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
            >
              <h4 className="mb-1.5 text-base font-bold text-[#043E6E]">
                {slides[current].info.title}
              </h4>
              <p className="mb-3 text-sm leading-relaxed text-[#043E6E]/80">
                {slides[current].info.desc}
              </p>
              <Button
                variant="ghost"
                className="h-8 rounded-full px-4 text-xs font-medium text-[#043E6E] hover:bg-[#043E6E]/10"
              >
                {slides[current].info.cta}
              </Button>
            </div>
          </div>

          {/* Right column - existing content (3/5) */}
          <div
            className="rounded-3xl border p-7 sm:p-9 lg:col-span-3"
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-7">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #1A827E, #0876D6)' }}
                  >
                    <f.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold text-[#043E6E]">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-[#043E6E]/80">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={() => navigate('/login')}
                className="h-12 w-48 rounded-full border-0 text-base font-medium text-white shadow-lg hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #043E6E, #1A827E, #8574C0)' }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/cadastro')}
                className="h-12 w-48 rounded-full border-0 text-base font-medium text-white shadow-lg hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #043E6E, #1A827E, #8574C0)' }}
              >
                Cadastro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
