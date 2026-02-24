import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, User, Mail, Briefcase, Code, ExternalLink } from 'lucide-react';

// Obfuscated integrity check
const _0x4f2a = ['\x4d\x61\x64\x65\x20\x62\x79\x20\x4e\x69\x73\x68\x61\x74\x20\x28\x32\x37\x74\x68\x20\x42\x61\x74\x63\x68\x29'];
const checkIntegrity = () => {
  const footer = document.getElementById('system-footer-credit');
  if (!footer) return false;
  return footer.innerText.includes(_0x4f2a[0]);
};

export const Footer: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [isTampered, setIsTampered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!checkIntegrity()) {
        setIsTampered(true);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (isTampered) {
    return (
      <div className="fixed inset-0 bg-red-600 text-white z-[9999] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={80} className="mb-6 animate-bounce" />
        <h1 className="text-4xl font-bold mb-4 font-display">System Integrity Error</h1>
        <p className="text-xl max-w-md">Unauthorized modification detected. The application has been locked to protect system integrity.</p>
        <p className="mt-8 text-sm opacity-70">Please restore the original footer credit to resume operation.</p>
      </div>
    );
  }

  return (
    <footer className="bg-primary text-white py-12 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-display font-bold mb-4">NBIU Computer Society</h3>
          <p className="text-slate-400 leading-relaxed">
            Empowering the next generation of computer scientists at North Bengal International University.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-slate-200">Quick Links</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="/" className="hover:text-accent transition-colors">Home</a></li>
            <li><a href="/feed" className="hover:text-accent transition-colors">Announcements</a></li>
            <li><a href="/leadership" className="hover:text-accent transition-colors">Leadership</a></li>
            <li><a href="/members" className="hover:text-accent transition-colors">Members</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-slate-200">Contact</h4>
          <p className="text-slate-400">NBIU Campus, Rajshahi</p>
          <p className="text-slate-400">Email: csc@nbiu.edu.bd</p>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} NBIU Computer Society Club. All rights reserved.</p>
        <button 
          id="system-footer-credit"
          onClick={() => setShowProfile(true)}
          className="text-slate-500 text-sm hover:text-accent transition-all cursor-pointer font-medium"
        >
          Made by Nishat (27th Batch)
        </button>
      </div>

      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
            >
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg">
                    <img 
                      src="https://picsum.photos/seed/nishat/200/200" 
                      alt="Mukitu Islam Nishat" 
                      className="w-full h-full rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Mukitu Islam Nishat</h2>
                    <p className="text-accent font-medium">Full Stack MERN Developer</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Mail size={20} />
                    </button>
                    <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                      <Code size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    I am a Full Stack MERN Developer specializing in AI-powered and scalable SaaS web applications. 
                    I have successfully completed 8–10+ real-world projects, including an E-commerce platform, 
                    Fish Farm Management System, Multi-role Tax Calculator app, and other automation-driven solutions.
                  </p>
                  <p>
                    Passionate about SaaS development, AI automation, and tech entrepreneurship, 
                    I focus on building next-generation digital products that solve real-world problems.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Batch</p>
                    <p className="font-semibold text-slate-900">27th Batch</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Expertise</p>
                    <p className="font-semibold text-slate-900">MERN + AI SaaS</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};
