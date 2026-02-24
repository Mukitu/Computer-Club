import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const currentPath = useLocation().pathname;
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const monitorScroll = () => setHasScrolled(window.scrollY > 20);
    window.addEventListener('scroll', monitorScroll);
    return () => window.removeEventListener('scroll', monitorScroll);
  }, []);

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Feed', href: '/feed' },
    { label: 'Leadership', href: '/leadership' },
    { label: 'Members', href: '/members' },
    { label: 'Payments', href: '/payments' },
    ...(user ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      hasScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary to-accent rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="relative font-display font-black text-2xl tracking-tighter">C</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-black text-slate-900 leading-none tracking-tight group-hover:text-primary transition-colors duration-300">
              NBIU <span className="text-primary">CSC</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-bold tracking-tight transition-all hover:text-primary ${
                  currentPath === item.href ? 'text-primary' : 'text-slate-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {user ? (
            <div className="flex items-center gap-6 ml-4 pl-8 border-l border-slate-200">
              {profile?.role === 'admin' && (
                <Link to="/admin" className="p-2.5 rounded-full bg-slate-50 text-slate-500 hover:bg-primary hover:text-white transition-all shadow-sm">
                  <LayoutDashboard size={18} />
                </Link>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-black text-slate-700 tracking-tight">{profile?.full_name?.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-black hover:bg-primary transition-all shadow-xl shadow-slate-900/20"
            >
              Join the Society
            </Link>
          )}
        </div>

        {/* Mobile Interaction */}
        <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-2xl"
          >
            <div className="p-8 flex flex-col gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xl font-black tracking-tight ${
                    currentPath === item.href ? 'text-primary' : 'text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {!user ? (
                <Link 
                  to="/auth" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-center font-black shadow-xl shadow-slate-900/20"
                >
                  Join Club
                </Link>
              ) : (
                <button 
                  onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                  className="text-rose-600 font-black text-left py-2 text-xl"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
