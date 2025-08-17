'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { SuperDesignThemeToggle } from '@/components/SuperDesignThemeSystem';
import { 
  Zap, 
  Users, 
  FileText, 
  Mail, 
  BarChart, 
  Shield, 
  Search, 
  ChevronDown, 
  Menu, 
  Play,
  Sun,
  Moon
} from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check initial theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (savedTheme === null && systemPrefersDark);
    
    setIsDark(shouldUseDark);
    
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const playDemo = () => {
    const video = document.getElementById('demo-video') as HTMLVideoElement;
    const overlay = video?.previousElementSibling as HTMLElement;
    
    if (video && overlay) {
      overlay.style.display = 'none';
      video.style.display = 'block';
      video.play();
      
      video.addEventListener('ended', () => {
        overlay.style.display = 'flex';
        video.style.display = 'none';
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading ClientHandle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="nav-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg gradient-text">ClientHandle</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#home" className="nav-link-dark active">Home</a>
                <a href="#features" className="nav-link-dark">Features</a>
                <a href="#demo" className="nav-link-dark">Demo</a>
                <a href="#about" className="nav-link-dark">About</a>
              </div>
            </div>
            
            {/* Right side */}
            <div className="flex items-center space-x-4">
              <SuperDesignThemeToggle />
              
              <div className="hidden md:flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <input type="text" placeholder="Search..." 
                         className="input-dark pl-10 pr-4 py-2 w-64 rounded-lg text-sm" />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                </div>
                
                {/* User Profile */}
                <Link href="/auth/login">
                  <button className="btn-secondary-dark px-4 py-2 flex items-center space-x-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-green-500"></div>
                    <span className="text-sm">Profile</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </Link>
              </div>
              
              {/* Mobile menu button */}
              <button 
                id="mobile-menu-btn" 
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {showMobileMenu && (
            <div id="mobile-menu" className="md:hidden">
              <div className="card-dark mt-4 p-4">
                <div className="flex flex-col space-y-4">
                  <a href="#home" className="nav-link-dark">Home</a>
                  <a href="#features" className="nav-link-dark">Features</a>
                  <a href="#demo" className="nav-link-dark">Demo</a>
                  <a href="#about" className="nav-link-dark">About</a>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <input type="text" placeholder="Search..." className="input-dark rounded-lg" />
                  <Link href="/auth/login">
                    <button className="btn-secondary-dark px-4 py-2 flex items-center justify-center space-x-2 rounded-lg w-full">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-green-500"></div>
                      <span className="text-sm">Profile</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-bg min-h-screen flex items-center px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 animate-fade-up">
              Manage Clients <br />
              <span className="gradient-text">Like a Pro</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 animate-fade-up animate-delayed-1">
              Streamline your freelance workflow with AI-powered client onboarding, 
              automated communications, and professional invoice management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-delayed-2">
              <Link href="/auth/register">
                <button className="btn-primary-dark px-8 py-4 text-lg font-semibold rounded-lg">
                  Get Started Free
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="btn-secondary-dark px-8 py-4 text-lg font-semibold rounded-lg">
                  Watch Demo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help freelancers and agencies manage clients efficiently.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
            {/* Feature 1 */}
            <div className="feature-card card-dark p-8 animate-fade-up">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Client Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep all your client information organized in one place. Track projects, 
                communications, and important milestones.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card card-dark p-8 animate-fade-up animate-delayed-1">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">AI-Powered Templates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate professional emails, contracts, and proposals instantly with 
                our intelligent template system.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card card-dark p-8 animate-fade-up animate-delayed-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Smart Invoicing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and send professional invoices with automated reminders and 
                integrated payment processing.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="feature-card card-dark p-8 animate-fade-up">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Email Automation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set up automated email sequences for onboarding, follow-ups, 
                and project updates.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="feature-card card-dark p-8 animate-fade-up animate-delayed-1">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-6">
                <BarChart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Analytics Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your business performance with detailed analytics and 
                actionable insights.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="feature-card card-dark p-8 animate-fade-up animate-delayed-2">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your data is protected with enterprise-grade security and 
                automatic backups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            See ClientHandle in <span className="gradient-text">Action</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Watch how ClientHandle transforms your client management workflow.
          </p>
          
          <div className="relative aspect-video max-w-4xl mx-auto card-dark overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center cursor-pointer group" onClick={playDemo}>
              <button className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                <Play className="w-8 h-8 text-white ml-1" />
              </button>
            </div>
            <video 
              id="demo-video" 
              className="w-full h-full object-cover" 
              poster="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=675&fit=crop&crop=center" 
              style={{display: 'none'}}
            >
              <source src="#" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="card-dark p-12 text-center bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Business?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers and agencies who trust ClientHandle 
              to manage their client relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <button className="btn-primary-dark px-8 py-4 text-lg font-semibold rounded-lg">
                  Start Free Trial
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="btn-secondary-dark px-8 py-4 text-lg font-semibold rounded-lg">
                  Schedule Demo
                </button>
              </Link>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-6">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ClientHandle</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Built by freelancers, for freelancers. Transform your client management today.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <a href="#" className="nav-link-dark">Privacy Policy</a>
            <a href="#" className="nav-link-dark">Terms of Service</a>
            <a href="#" className="nav-link-dark">Contact</a>
            <a href="#" className="nav-link-dark">Help Center</a>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2024 ClientHandle. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}