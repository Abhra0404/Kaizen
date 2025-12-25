import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Target, Code, Kanban, ArrowRight, Zap, Moon, Sun } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPos = 0;
    const scrollSpeed = 1;
    const containerWidth = container.scrollWidth / 2;

    const animate = () => {
      scrollPos += scrollSpeed;
      
      if (scrollPos >= containerWidth) {
        scrollPos = 0;
      }
      
      container.style.transform = `translateX(-${scrollPos}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center text-white dark:text-gray-900 group-hover:shadow-md transition-shadow">
              <Zap size={20} className="fill-current" />
            </div>
            <span className="text-lg font-bold tracking-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Kaizen</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link 
              to="/login"
              className="text-sm font-medium px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-all duration-200"
            >
              Login
            </Link>
            <Link 
              to="/signup"
              className="text-sm font-semibold px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-6 overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-full blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full blur-3xl opacity-20 animate-float-delayed"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] dark:opacity-[0.08]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4 relative">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <div className={`transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
              }`}>
                <span className="inline-block animate-shimmer">
                  Build better habits.
                </span>
              </div>
              <div className={`transition-all duration-1000 delay-300 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
              }`}>
                <span className="inline-block animate-shimmer">
                  Track real progress.
                </span>
              </div>
            </h1>
            <p className={`text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ease-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              Kaizen is a minimalist productivity dashboard for students to track learning, habits, projects, and goals — all in one place.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 transition-all duration-1000 delay-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Link
              to="/signup"
              className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Explore Dashboard
            </Link>
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }
        
        .animate-shimmer {
          position: relative;
          display: inline-block;
        }
        
        .animate-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          animation: shimmer 3s ease-in-out infinite;
          pointer-events: none;
        }
        
        .dark .animate-shimmer::before {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 50%,
            transparent 100%
          );
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite 4s;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Everything you need</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">All the tools to track what matters</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Code}
              title="Track DSA Progress"
              description="Visualize problem-solving progress by difficulty and topic."
            />
            <FeatureCard
              icon={Kanban}
              title="Manage Projects"
              description="Organize development projects with status and tech stack."
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Build Daily Habits"
              description="Maintain consistency with streak-based habit tracking."
            />
            <FeatureCard
              icon={Target}
              title="Set Clear Goals"
              description="Break semester goals into measurable progress."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Get started in seconds</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Three simple steps</p>
          </div>

          <div className="flex items-center justify-center gap-8 max-w-6xl mx-auto flex-wrap md:flex-nowrap">
            <HowItWorksCard
              number="1"
              title="Sign up"
              description="Create your account in seconds"
            />
            <div className="hidden md:flex items-center justify-center flex-shrink-0">
              <ArrowRight className="text-gray-300 dark:text-gray-600" size={24} />
            </div>
            <HowItWorksCard
              number="2"
              title="Track your progress"
              description="Log habits, projects, and goals"
            />
            <div className="hidden md:flex items-center justify-center flex-shrink-0">
              <ArrowRight className="text-gray-300 dark:text-gray-600" size={24} />
            </div>
            <HowItWorksCard
              number="3"
              title="Improve daily"
              description="Watch your consistency grow"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Loved by students</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">See what others are saying</p>
          </div>

          <div className="relative w-full">
            <div 
              ref={scrollContainerRef}
              className="flex gap-6"
              style={{ willChange: 'transform' }}
            >
              {/* Original Testimonials */}
              <div className="flex-shrink-0 w-full md:w-96 p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gray-900 dark:text-white">★</span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "Kaizen helped me track my DSA progress consistently. Seeing the streak grow every day keeps me motivated to code."
                </p>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Sarah Chen</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Computer Science, 2nd Year</p>
                </div>
              </div>

              <div className="flex-shrink-0 w-full md:w-96 p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gray-900 dark:text-white">★</span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "Finally, a productivity app that doesn't overwhelm me. Kaizen is clean, simple, and actually helps me stay focused."
                </p>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Alex Rodriguez</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Engineering, 3rd Year</p>
                </div>
              </div>

              <div className="flex-shrink-0 w-full md:w-96 p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gray-900 dark:text-white">★</span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "The habit tracking feature changed how I approach my semester goals. I'm more organized and productive."
                </p>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Jamie Taylor</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data Science, 4th Year</p>
                </div>
              </div>

              {/* Duplicates for Infinite Loop */}
              <div className="flex-shrink-0 w-full md:w-96 p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gray-900 dark:text-white">★</span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "Kaizen helped me track my DSA progress consistently. Seeing the streak grow every day keeps me motivated to code."
                </p>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Sarah Chen</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Computer Science, 2nd Year</p>
                </div>
              </div>

              <div className="flex-shrink-0 w-full md:w-96 p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gray-900 dark:text-white">★</span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "Finally, a productivity app that doesn't overwhelm me. Kaizen is clean, simple, and actually helps me stay focused."
                </p>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Alex Rodriguez</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Engineering, 3rd Year</p>
                </div>
              </div>

              <div className="flex-shrink-0 w-full md:w-96 p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gray-900 dark:text-white">★</span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "The habit tracking feature changed how I approach my semester goals. I'm more organized and productive."
                </p>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Jamie Taylor</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data Science, 4th Year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Ready to start?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join students who are tracking their progress and building better habits.
            </p>
          </div>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p className="font-semibold text-gray-900 dark:text-white">Kaizen</p>
          <p>Small improvements, every day.</p>
          <p>&copy; 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon size={24} className="text-gray-700 dark:text-gray-300" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
}

type HowItWorksCardProps = {
  number: string;
  title: string;
  description: string;
  className?: string;
};

function HowItWorksCard({ number, title, description, className = '' }: HowItWorksCardProps) {
  return (
    <div className={`text-center space-y-3 ${className}`}>
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm">
        {number}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
}
