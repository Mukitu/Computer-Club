import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Feed', path: '/feed' },
    { name: 'Leadership', path: '/leadership' },
    { name: 'Members', path: '/members' },
    { name: 'Payments', path: '/payments' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-accent to-blue-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <span className="relative font-display font-black text-2xl tracking-tighter">C</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-black text-primary leading-none tracking-tight group-hover:text-accent transition-colors duration-300">
              NBIU <span className="text-accent">CSC</span>
            </span>
            <span className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black mt-1">
              Computer Society
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === link.path ? 'text-accent' : 'text-slate-600 hover:text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
              {profile?.role === 'admin' && (
                <Link to="/admin" className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-accent hover:text-white transition-all">
                  <LayoutDashboard size={20} />
                </Link>
              )}
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{profile?.full_name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100 p-2">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                    <User size={16} /> Profile
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-primary/20"
            >
              Join Club
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-primary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-bold ${
                    location.pathname === link.path ? 'text-accent' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link 
                  to="/auth" 
                  onClick={() => setIsOpen(false)}
                  className="bg-primary text-white px-6 py-3 rounded-xl text-center font-bold"
                >
                  Join Club
                </Link>
              )}
              {user && (
                <button 
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="text-red-600 font-bold text-left py-2"
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
