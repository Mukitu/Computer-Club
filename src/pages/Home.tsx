import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Users, Calendar, Megaphone, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <p className="text-2xl font-display font-bold text-slate-900">{value}</p>
    </div>
  </motion.div>
);

export default function Home() {
  const [statistics, setStatistics] = useState({ members: 0, events: 12, announcements: 0 });
  const [isDatabaseReady, setIsDatabaseReady] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsDatabaseReady(false);
      return;
    }

    const loadDashboardData = async () => {
      try {
        const { count: memberCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        const { count: postCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });

        setStatistics(prev => ({
          ...prev,
          members: memberCount || 0,
          announcements: postCount || 0
        }));
      } catch (err) {
        console.error("Dashboard data sync failed:", err);
      }
    };
    
    loadDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-24 pb-32">
      {!isDatabaseReady && (
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-center justify-center gap-3 text-rose-800 text-sm font-semibold">
          <AlertTriangle size={18} />
          <span>System configuration incomplete. Please verify environment secrets.</span>
        </div>
      )}

      {/* Hero Experience */}
      <section className="relative min-h-[85vh] flex items-center px-6 overflow-hidden pt-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-15%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/5 text-primary text-xs font-black uppercase tracking-widest mb-8 border border-primary/10">
              <TrendingUp size={14} />
              <span>Pioneering Digital Excellence</span>
            </div>
            
            <p className="text-2xl md:text-3xl text-slate-500 font-display font-light leading-relaxed mb-12 max-w-xl">
              Empowering the next generation of engineers at <span className="text-primary font-bold">North Bengal International University</span> through collaboration, innovation, and technical mastery.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link 
                to="/auth" 
                className="group bg-primary text-white px-10 py-4.5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-primary/25 flex items-center gap-3"
              >
                Join the Society
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/feed" 
                className="bg-white text-slate-900 border border-slate-200 px-10 py-4.5 rounded-2xl font-bold text-lg hover:border-primary hover:text-primary transition-all"
              >
                Explore Feed
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-[12px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200" 
                alt="Modern Workspace" 
                className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] z-20 max-w-xs shadow-2xl border border-white/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-black text-slate-900 tracking-tight">Vibrant Ecosystem</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Engage in high-impact workshops, hackathons, and collaborative research initiatives.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <StatCard icon={Users} label="Active Members" value={statistics.members} color="bg-blue-600" />
          <StatCard icon={Calendar} label="Events Planned" value={statistics.events} color="bg-indigo-600" />
          <StatCard icon={Megaphone} label="Latest Updates" value={statistics.announcements} color="bg-emerald-600" />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 py-24 px-6 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Why Join CSC?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We provide the resources and environment needed to excel in your computer science journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Skill Development', desc: 'Hands-on workshops on web dev, AI, and competitive programming.' },
              { title: 'Networking', desc: 'Connect with seniors, alumni, and industry professionals.' },
              { title: 'Project Collaboration', desc: 'Build real-world applications with fellow club members.' }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-6 font-bold text-xl">
                  0{i+1}
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
