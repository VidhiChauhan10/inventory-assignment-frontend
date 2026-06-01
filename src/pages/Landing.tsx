import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Star,
  Globe,
} from 'lucide-react'

const features = [
  {
    icon: Package,
    title: 'Smart Inventory',
    description:
      'Track stock levels, set reorder points, and manage products with intelligent alerts.',
    color: 'from-purple-500 to-indigo-500',
    shadow: 'shadow-purple-500/20',
  },
  {
    icon: Users,
    title: 'Customer Hub',
    description:
      'Manage customer profiles, purchase history, and relationships all in one place.',
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20',
  },
  {
    icon: ShoppingCart,
    title: 'Order Management',
    description:
      'Process orders, track fulfillment, and streamline your entire sales pipeline.',
    color: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/20',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description:
      'Gain actionable insights with live dashboards and comprehensive business reports.',
    color: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/20',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description:
      'Enterprise-grade security with 99.9% uptime and encrypted data storage.',
    color: 'from-rose-500 to-pink-500',
    shadow: 'shadow-rose-500/20',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Optimized performance ensures a smooth, responsive experience for your entire team.',
    color: 'from-violet-500 to-purple-500',
    shadow: 'shadow-violet-500/20',
  },
]

const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '10k+', label: 'Products Tracked' },
  { value: '500+', label: 'Businesses' },
  { value: '<50ms', label: 'Response Time' },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Operations Manager',
    company: 'TechCorp India',
    text: 'InventoryPro transformed how we manage our stock. We reduced overstock by 40% in just 3 months.',
    stars: 5,
  },
  {
    name: 'Arjun Mehta',
    role: 'CEO',
    company: 'RetailHub',
    text: 'The real-time analytics dashboard gives us insights we never had before. Absolutely game-changing.',
    stars: 5,
  },
  {
    name: 'Sneha Patel',
    role: 'Supply Chain Lead',
    company: 'LogiTech Solutions',
    text: 'Order management has never been smoother. Our fulfillment speed improved by 60%.',
    stars: 5,
  },
]

function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string
  delay?: number
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

function CountUp({
  target,
  suffix = '',
  prefix = '',
}: {
  target: number | string
  suffix?: string
  prefix?: string
}) {
  const [count, setCount] = useState(0)
  const numTarget = typeof target === 'number' ? target : parseFloat(target)
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true)
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let start = 0
    const duration = 1800
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * numTarget))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(numTarget)
    }
    requestAnimationFrame(step)
  }, [started, numTarget])

  if (typeof target === 'string' && isNaN(numTarget)) {
    return (
      <span ref={ref} className={started ? 'opacity-100' : 'opacity-0'} style={{ transition: 'opacity 0.3s' }}>
        {target}
      </span>
    )
  }

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToDashboard = () => navigate('/dashboard')

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ─── Navbar ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[hsl(222,47%,7%)]/90 backdrop-blur-xl border-b border-white/5 shadow-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ background: 'linear-gradient(135deg, hsl(262,83%,75%), hsl(200,80%,65%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              InventoryPro
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Stats', 'Testimonials'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-[hsl(215,20%,55%)] hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
          <button
            onClick={goToDashboard}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
          >
            Launch App →
          </button>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Background orbs */}
        <FloatingOrb className="w-[500px] h-[500px] bg-purple-600 -top-40 -left-40" delay={0} />
        <FloatingOrb className="w-[400px] h-[400px] bg-blue-600 top-20 -right-32" delay={1.5} />
        <FloatingOrb className="w-[300px] h-[300px] bg-indigo-600 bottom-0 left-1/3" delay={3} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(262,83%,68%) 1px, transparent 1px), linear-gradient(90deg, hsl(262,83%,68%) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-medium text-purple-300 mb-8 backdrop-blur-sm">
            <Globe className="w-3.5 h-3.5" />
            <span>Enterprise Inventory Management · v1.0.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Manage Your{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, hsl(262,83%,75%), hsl(200,80%,65%), hsl(280,80%,70%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% auto',
                animation: 'shimmer 3s linear infinite',
              }}
            >
              Inventory
            </span>
            <br />
            Like a Pro
          </h1>

          <p className="text-lg md:text-xl text-[hsl(215,20%,55%)] max-w-2xl mx-auto mb-10 leading-relaxed">
            A powerful, real-time inventory management platform built for modern
            businesses. Track products, manage orders, and grow smarter — all
            from one beautiful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={goToDashboard}
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-[hsl(215,20%,65%)] border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Explore Features
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[hsl(215,20%,45%)]">
            {['No credit card required', 'Free to use', 'Instant access'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[hsl(215,20%,40%)] text-xs animate-bounce">
          <span>Scroll to explore</span>
          <div className="w-5 h-8 border border-white/10 rounded-full flex items-start justify-center pt-1">
            <div className="w-1 h-2 bg-white/30 rounded-full" style={{ animation: 'scrollDot 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section id="stats" className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => {
            const numPart = parseFloat(value)
            const suffix = value.replace(/[\d.]/g, '').trim()
            return (
              <div key={label} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold mb-2" style={{ background: 'linear-gradient(135deg, hsl(262,83%,75%), hsl(200,80%,65%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {isNaN(numPart) ? value : <><CountUp target={numPart} suffix={suffix} /></>}
                </div>
                <p className="text-sm text-[hsl(215,20%,50%)]">{label}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-3">Everything You Need</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Built for{' '}
              <span style={{ background: 'linear-gradient(135deg, hsl(262,83%,75%), hsl(200,80%,65%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                modern teams
              </span>
            </h2>
            <p className="text-[hsl(215,20%,55%)] max-w-xl mx-auto">
              Every feature designed to help your business move faster, smarter, and more profitably.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color, shadow }) => (
              <div
                key={title}
                className="group relative p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 hover:-translate-y-1 cursor-default overflow-hidden"
                style={{ backdropFilter: 'blur(10px)' }}
              >
                {/* Hover glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${color} blur-2xl`} style={{ opacity: 0, transform: 'scale(0.5)' }} />

                <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${shadow} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="relative text-base font-semibold text-white mb-2">{title}</h3>
                <p className="relative text-sm text-[hsl(215,20%,50%)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section id="testimonials" className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-3">Trusted by Teams</p>
            <h2 className="text-3xl md:text-5xl font-bold">
              What our{' '}
              <span style={{ background: 'linear-gradient(135deg, hsl(262,83%,75%), hsl(200,80%,65%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                customers say
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, company, text, stars }) => (
              <div
                key={name}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:border-purple-500/20 hover:bg-white/[0.05] transition-all duration-300"
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <div className="flex mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[hsl(215,20%,65%)] leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-[hsl(215,20%,45%)]">{role} · {company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <FloatingOrb className="w-[400px] h-[400px] bg-purple-600 -left-20 -bottom-20" delay={0} />
        <FloatingOrb className="w-[300px] h-[300px] bg-blue-600 -right-20 top-0" delay={2} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Ready to take{' '}
            <span style={{ background: 'linear-gradient(135deg, hsl(262,83%,75%), hsl(200,80%,65%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              control
            </span>
            ?
          </h2>
          <p className="text-lg text-[hsl(215,20%,55%)] mb-10">
            Jump straight into your inventory dashboard and start managing your business smarter today.
          </p>
          <button
            onClick={goToDashboard}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
          >
            Open Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ background: 'linear-gradient(135deg, hsl(262,83%,75%), hsl(200,80%,65%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              InventoryPro
            </span>
          </div>
          <p className="text-xs text-[hsl(215,20%,40%)]">
            © {new Date().getFullYear()} InventoryPro. Built with ❤️ for modern businesses.
          </p>
          <p className="text-xs text-[hsl(215,20%,40%)]">v1.0.0 · Production Ready</p>
        </div>
      </footer>

      {/* ─── Keyframe animations ─── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
