import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import { Mic, ShieldCheck, Sparkles, ArrowRight, Languages, HeartHandshake, FlaskConical, Lock } from 'lucide-react'

type Props = {
  lang: Lang
  onStart: () => void
  onAudit: () => void
  onVault: () => void
  onDemo: () => void
}

export function Landing({ lang, onStart, onAudit, onVault, onDemo }: Props) {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-saffron-50 via-white to-leaf-50">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #1f2330 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 chip bg-leaf-100 text-leaf-700 mb-6 animate-fade-up">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">{t(lang, 'tagline')}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink-900 leading-tight max-w-3xl mx-auto animate-fade-up">
            {t(lang, 'heroTitle')}
          </h1>
          <p className="mt-5 text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed animate-fade-up">
            {t(lang, 'heroSubtitle')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up">
            <button onClick={onStart} className="btn-primary text-lg px-8 py-4">
              {t(lang, 'startButton')}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={onDemo} className="btn-ghost">
              <FlaskConical className="w-4 h-4" />
              {t(lang, 'demoMode')}
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-500">
            <ShieldCheck className="w-4 h-4 text-leaf-500" />
            <span>{t(lang, 'privacyNote')}</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <Step
            num="1"
            icon={<Languages className="w-6 h-6" />}
            title={t(lang, 'step1')}
            color="saffron"
          />
          <Step
            num="2"
            icon={<Sparkles className="w-6 h-6" />}
            title={t(lang, 'step2')}
            color="leaf"
          />
          <Step
            num="3"
            icon={<HeartHandshake className="w-6 h-6" />}
            title={t(lang, 'step3')}
            color="ink"
          />
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<Lock className="w-5 h-5" />}
            title={t(lang, 'vaultTitle')}
            desc={t(lang, 'vaultDesc')}
            onClick={onVault}
            color="leaf"
          />
          <FeatureCard
            icon={<FlaskConical className="w-5 h-5" />}
            title={t(lang, 'demoMode')}
            desc={t(lang, 'demoDesc')}
            onClick={onDemo}
            color="saffron"
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title={t(lang, 'auditTitle')}
            desc={t(lang, 'auditSubtitle')}
            onClick={onAudit}
            color="ink"
          />
        </div>
      </section>

      {/* Example prompts */}
      <section className="bg-white border-y border-ink-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h3 className="text-sm font-semibold text-ink-400 uppercase tracking-wide mb-4">{t(lang, 'examples')}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[t(lang, 'ex1'), t(lang, 'ex2'), t(lang, 'ex3'), t(lang, 'ex4')].map((ex, i) => (
              <button
                key={i}
                onClick={onStart}
                className="card p-4 text-left hover:border-saffron-300 hover:shadow-lift transition-all group"
              >
                <div className="flex items-start gap-3">
                  <Mic className="w-5 h-5 text-saffron-400 mt-0.5 group-hover:text-saffron-600 transition-colors" />
                  <span className="text-ink-700 font-medium">{ex}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Step({
  num, icon, title, color,
}: {
  num: string
  icon: React.ReactNode
  title: string
  color: 'saffron' | 'leaf' | 'ink'
}) {
  const colors = {
    saffron: 'bg-saffron-50 text-saffron-600 border-saffron-200',
    leaf: 'bg-leaf-50 text-leaf-600 border-leaf-200',
    ink: 'bg-ink-50 text-ink-600 border-ink-200',
  }
  return (
    <div className="card p-6 text-center">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${colors[color]} mb-4`}>
        {icon}
      </div>
      <div className="text-xs font-bold text-ink-300 mb-1">STEP {num}</div>
      <div className="font-display font-semibold text-ink-800">{title}</div>
    </div>
  )
}

function FeatureCard({
  icon, title, desc, onClick, color,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  onClick: () => void
  color: 'saffron' | 'leaf' | 'ink'
}) {
  const colors = {
    saffron: 'text-saffron-600 bg-saffron-50',
    leaf: 'text-leaf-600 bg-leaf-50',
    ink: 'text-ink-600 bg-ink-50',
  }
  return (
    <button
      onClick={onClick}
      className="card p-5 text-left hover:shadow-lift hover:border-saffron-200 transition-all group"
    >
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors[color]} mb-3`}>
        {icon}
      </div>
      <h3 className="font-display font-semibold text-ink-800 mb-1">{title}</h3>
      <p className="text-sm text-ink-500 leading-relaxed line-clamp-2">{desc}</p>
    </button>
  )
}
