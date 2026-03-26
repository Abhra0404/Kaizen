import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2,
  Target,
  Code,
  Kanban,
  ArrowRight,
  Zap,
  Moon,
  Sun,
  TrendingUp,
  Menu,
  X,
  Github,
  Monitor,
  Mail,
} from 'lucide-react';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const GITHUB_URL = 'https://github.com/Abhra0404/Kaizen';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const FEATURES: readonly FeatureCardProps[] = [
  {
    icon: Code,
    title: 'Track DSA Progress',
    description: 'Log problems by difficulty and topic. See your solve rate climb week by week.',
  },
  {
    icon: Kanban,
    title: 'Manage Projects',
    description: 'Track status from Planning to Done with progress bars, team tags, and tech stacks.',
  },
  {
    icon: CheckCircle2,
    title: 'Build Daily Habits',
    description: 'Set daily or weekly habits and watch your streak grow. One tap to check in.',
  },
  {
    icon: Target,
    title: 'Set Clear Goals',
    description: 'Define goals with deadlines and progress percentages. Mark them done when you ship.',
  },
] as const;

const STEPS: readonly HowItWorksCardProps[] = [
  { number: '1', title: 'Sign up', description: 'Create your account in seconds' },
  { number: '2', title: 'Track your progress', description: 'Log habits, projects, and goals' },
  { number: '3', title: 'Improve daily', description: 'Watch your consistency grow' },
] as const;

const TECH_STACK: readonly string[] = [
  'React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Chart.js', 'Vite',
] as const;

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/** Observe elements with `.reveal` and add `.revealed` when they enter the viewport */
function useRevealOnScroll() {
  const observed = useRef(new Set<Element>());

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => {
      observed.current.add(el);
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Landing Page                                                       */
/* ------------------------------------------------------------------ */

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleDark } = useTheme();

  // Scroll detection for navbar background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hero entrance animation — fire once on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setHeroReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Close mobile menu on resize past the breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Intersection Observer reveals for below-fold sections
  useRevealOnScroll();

  // Keyboard handler for toggle (accessibility)
  const handleToggleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDark();
      }
    },
    [toggleDark],
  );

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-primary overflow-x-hidden relative">
      {/* -------- Global grid background -------- */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.04] pointer-events-none z-0" aria-hidden="true" />

      {/* -------- Pill Navbar -------- */}
      <nav
        className="fixed top-0 w-full z-50 flex justify-center px-4 pt-4 pointer-events-none"
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className={`pointer-events-auto flex items-center justify-between gap-4 px-5 py-3 rounded-2xl border transition-all duration-500 ${
            scrolled || mobileMenuOpen
              ? 'bg-white/40 dark:bg-dark-bg/40 backdrop-blur-xl border-gray-200/40 dark:border-dark-border/40 shadow-lg shadow-gray-900/5 dark:shadow-black/20'
              : 'bg-white/20 dark:bg-dark-bg/20 backdrop-blur-lg border-gray-200/30 dark:border-dark-border/30'
          } w-full max-w-3xl`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="Kaizen — Home">
            <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 group-hover:shadow-md transition-shadow">
              <Zap size={16} className="fill-current" />
            </div>
            <span className="text-sm font-bold tracking-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
              Kaizen
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-1.5 text-gray-600 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-dark-primary transition-colors rounded-full"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Register
            </Link>
            <button
              onClick={toggleDark}
              onKeyDown={handleToggleKey}
              className="p-1.5 text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-primary rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              role="switch"
              aria-checked={isDark}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Mobile actions */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={toggleDark}
              onKeyDown={handleToggleKey}
              className="p-1.5 text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-primary rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover transition-all duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              role="switch"
              aria-checked={isDark}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="p-1.5 text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-primary rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover transition-all duration-200"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown — pill-shaped too */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto sm:hidden absolute top-full mt-2 left-4 right-4 max-w-xl mx-auto rounded-2xl border border-gray-200/40 dark:border-dark-border/40 bg-white/30 dark:bg-dark-bg/30 backdrop-blur-xl shadow-lg shadow-gray-900/5 dark:shadow-black/20 px-4 py-3 space-y-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center text-sm font-medium px-4 py-2.5 text-gray-700 dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-dark-hover rounded-full transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center text-sm font-medium px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </nav>

      {/* -------- Hero -------- */}
      <section
        className="relative z-10 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Radial glow behind heading for depth */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-radial from-gray-200/40 via-gray-100/20 to-transparent dark:from-dark-card/30 dark:via-dark-surface/10 dark:to-transparent rounded-full blur-3xl" />
        </div>

        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-dark-card dark:to-dark-input rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-dark-input dark:to-dark-card rounded-full blur-3xl opacity-20 animate-float-delayed" />
        </div>

        {/* Floating stationary items — desktop only */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Top-left — Code icon */}
          <div className="absolute top-[18%] left-[8%] animate-float-slow" style={{ animationDelay: '0s' }}>
            <div className="w-12 h-12 rounded-xl border border-gray-200/60 dark:border-dark-border/60 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm shadow-lg shadow-gray-900/5 dark:shadow-black/10 flex items-center justify-center">
              <Code size={20} className="text-gray-400 dark:text-dark-muted" />
            </div>
          </div>

          {/* Top-right — Target icon */}
          <div className="absolute top-[22%] right-[10%] animate-float-diagonal" style={{ animationDelay: '1.5s' }}>
            <div className="w-11 h-11 rounded-xl border border-gray-200/60 dark:border-dark-border/60 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm shadow-lg shadow-gray-900/5 dark:shadow-black/10 flex items-center justify-center">
              <Target size={18} className="text-gray-400 dark:text-dark-muted" />
            </div>
          </div>

          {/* Mid-left — CheckCircle icon */}
          <div className="absolute top-[55%] left-[5%] animate-float-gentle" style={{ animationDelay: '3s' }}>
            <div className="w-10 h-10 rounded-xl border border-gray-200/60 dark:border-dark-border/60 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm shadow-lg shadow-gray-900/5 dark:shadow-black/10 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-gray-400 dark:text-dark-muted" />
            </div>
          </div>

          {/* Mid-right — Kanban icon */}
          <div className="absolute top-[50%] right-[6%] animate-float-slow" style={{ animationDelay: '2s' }}>
            <div className="w-12 h-12 rounded-xl border border-gray-200/60 dark:border-dark-border/60 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm shadow-lg shadow-gray-900/5 dark:shadow-black/10 flex items-center justify-center">
              <Kanban size={20} className="text-gray-400 dark:text-dark-muted" />
            </div>
          </div>

          {/* Bottom-left — TrendingUp icon */}
          <div className="absolute top-[75%] left-[12%] animate-float-diagonal" style={{ animationDelay: '4s' }}>
            <div className="w-10 h-10 rounded-xl border border-gray-200/60 dark:border-dark-border/60 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm shadow-lg shadow-gray-900/5 dark:shadow-black/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-gray-400 dark:text-dark-muted" />
            </div>
          </div>

          {/* Bottom-right — Zap icon */}
          <div className="absolute top-[78%] right-[11%] animate-float-gentle" style={{ animationDelay: '1s' }}>
            <div className="w-11 h-11 rounded-xl border border-gray-200/60 dark:border-dark-border/60 bg-white/70 dark:bg-dark-card/70 backdrop-blur-sm shadow-lg shadow-gray-900/5 dark:shadow-black/10 flex items-center justify-center">
              <Zap size={18} className="text-gray-400 dark:text-dark-muted" />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 pt-32 pb-20 md:pt-44 md:pb-32 lg:pt-48 lg:pb-36 px-6">
          <div className="flex flex-col items-center text-center gap-8 md:gap-10">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-dark-border bg-white/70 dark:bg-dark-surface/70 backdrop-blur-sm text-sm text-gray-600 dark:text-dark-secondary transition-all duration-700 ${
                heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <TrendingUp size={14} />
              <span>Improve 1&nbsp;% every day</span>
            </div>

            {/* Heading — large, tight, two stacked lines with shimmer */}
            <h1
              id="hero-heading"
              className="text-[2.75rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
            >
              <span
                className={`block transition-all duration-1000 ease-out ${
                  heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
                }`}
              >
                <span className="heading-shine">Build better habits.</span>
              </span>
              <span
                className={`block mt-1 md:mt-2 transition-all duration-1000 delay-200 ease-out ${
                  heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <span className="heading-shine">Track real progress.</span>
              </span>
            </h1>

            {/* Sub-heading */}
            <p
              className={`text-lg md:text-xl text-gray-500 dark:text-dark-muted max-w-xl leading-relaxed transition-all duration-1000 delay-400 ease-out ${
                heroReady ? 'opacity-100' : 'opacity-0'
              }`}
            >
              DSA problems, daily habits, projects, and semester goals&nbsp;&mdash;&nbsp;one
              dashboard, zero clutter.
            </p>

            {/* CTA buttons */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500 ease-out ${
                heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Link
                to="/signup"
                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg shadow-gray-900/10 dark:shadow-white/10 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-primary rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2"
              >
                Log In
              </Link>
            </div>

            {/* Trust line */}
            <p
              className={`text-xs text-gray-400 dark:text-dark-muted tracking-wide transition-all duration-1000 delay-[850ms] ease-out ${
                heroReady ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Free &amp; open-source&nbsp;&nbsp;·&nbsp;&nbsp;No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* -------- Product Preview -------- */}
      <section className="relative z-10 py-24 px-6" aria-labelledby="preview-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4 reveal">
            <h2 id="preview-heading" className="text-3xl md:text-4xl font-bold">
              See it in action
            </h2>
            <p className="text-gray-600 dark:text-dark-muted text-lg max-w-xl mx-auto">
              A clean dashboard that shows what matters
            </p>
          </div>

          <div className="reveal">
            <div className="mx-auto max-w-5xl" style={{ perspective: '1200px' }}>
              <div className="rounded-xl border-2 border-gray-200 dark:border-dark-border shadow-2xl shadow-gray-900/10 dark:shadow-black/30 overflow-hidden bg-white dark:bg-dark-card md:hover:[transform:rotateY(-2deg)_rotateX(1deg)] transition-transform duration-500">
                {/* Browser chrome bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="max-w-sm mx-auto px-3 py-1 rounded-md bg-white dark:bg-dark-input border border-gray-200 dark:border-dark-border text-xs text-gray-400 dark:text-dark-muted text-center truncate">
                      kaizen-phi-five.vercel.app/dashboard
                    </div>
                  </div>
                </div>
                <DashboardPreview />
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-dark-muted mt-6">
              Real-time stats, progress charts, and streak tracking&nbsp;&mdash;&nbsp;all on one page.
            </p>
          </div>
        </div>
      </section>

      {/* -------- Features -------- */}
      <section className="relative z-10 py-24 px-6 bg-gray-50/80 dark:bg-dark-surface/80 backdrop-blur-sm border-y border-gray-200 dark:border-dark-border" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4 reveal">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold">
              Everything you need
            </h2>
            <p className="text-gray-600 dark:text-dark-muted text-lg max-w-xl mx-auto">
              All the tools to track what matters&nbsp;&mdash;&nbsp;nothing more, nothing less.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="reveal" style={{ animationDelay: `${i * 120}ms` }}>
                <FeatureCard {...f} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------- How It Works -------- */}
      <section className="relative z-10 py-24 px-6" aria-labelledby="how-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4 reveal">
            <h2 id="how-heading" className="text-3xl md:text-4xl font-bold">
              Get started in seconds
            </h2>
            <p className="text-gray-600 dark:text-dark-muted text-lg">Three simple steps</p>
          </div>

          <div className="flex items-center justify-center gap-8 max-w-6xl mx-auto flex-wrap md:flex-nowrap reveal">
            {STEPS.map((step, i) => (
              <div key={step.number} className="contents">
                <HowItWorksCard {...step} />
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex items-center justify-center flex-shrink-0">
                    <div className="w-12 h-px bg-gray-300 dark:bg-dark-border" />
                    <ArrowRight className="text-gray-400 dark:text-dark-accent -ml-1" size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------- CTA -------- */}
      <section className="relative z-10 py-24 px-6 bg-white dark:bg-dark-surface border-y border-gray-200 dark:border-dark-border" aria-labelledby="cta-heading">
        <div className="max-w-2xl mx-auto text-center space-y-8 reveal">
          <div className="space-y-4">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-primary">
              Ready to start?
            </h2>
            <p className="text-lg text-gray-600 dark:text-dark-muted">
              Join students who are tracking their progress and building better habits.
            </p>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg shadow-gray-900/10 dark:shadow-white/10 focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 group"
          >
            Get Started
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* -------- Footer -------- */}
      <footer
        className="relative z-10 bg-black border-t border-gray-800"
        role="contentinfo"
      >
        {/* Main footer content */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            {/* Brand column — spans 6 cols */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-900 shadow-sm">
                  <Zap size={20} className="fill-current" />
                </div>
                <div>
                  <span className="font-bold text-lg tracking-tight text-white">Kaizen</span>
                  <p className="text-xs text-gray-400 leading-tight">Productivity Suite</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                Improve 1% today. Repeat tomorrow. A minimalist dashboard for students to track
                DSA progress, habits, projects, and goals.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 hover:bg-gray-900 transition-all duration-200"
                  aria-label="Kaizen on GitHub"
                >
                  <Github size={16} />
                </a>
                <a
                  href="mailto:contact@kaizen.app"
                  className="w-9 h-9 rounded-lg border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-600 hover:bg-gray-900 transition-all duration-200"
                  aria-label="Email us"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>

            {/* Account column */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Account</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Built with column */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Built with</h3>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium text-gray-400 bg-gray-900 border border-gray-800 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Kaizen. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Made with dedication for continuous improvement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-6 border-2 border-gray-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-card hover:border-gray-400 dark:hover:border-dark-accent hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon size={22} className="text-white dark:text-gray-900" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-dark-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

type HowItWorksCardProps = {
  number: string;
  title: string;
  description: string;
};

function HowItWorksCard({ number, title, description }: HowItWorksCardProps) {
  return (
    <div className="text-center space-y-3 flex-1 min-w-[160px]">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm shadow-md">
        {number}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 dark:text-dark-muted text-sm">{description}</p>
    </div>
  );
}

/** Dashboard screenshot with a graceful fallback when the image doesn't exist yet */
function DashboardPreview() {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-surface dark:to-dark-card flex flex-col items-center justify-center gap-3 p-8">
        <Monitor size={48} className="text-gray-300 dark:text-dark-border" />
        <p className="text-sm text-gray-400 dark:text-dark-muted font-medium">Dashboard preview</p>
        <p className="text-xs text-gray-300 dark:text-dark-border">
          Sign up to see the full dashboard
        </p>
      </div>
    );
  }

  return (
    <img
      src="/dashboard-preview.png"
      alt="Kaizen dashboard showing stat cards, weekly activity chart, project progress, and habit streaks"
      className="w-full h-auto block"
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
}
