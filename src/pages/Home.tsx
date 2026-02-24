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
  const [stats, setStats] = useState({ members: 0, events: 0, posts: 0 });
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsConfigured(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const { count: members } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: posts } = await supabase.from('posts').select('*', { count: 'exact', head: true });
        setStats({ members: members || 0, events: 12, posts: posts || 0 });
      } catch (e) {
        console.error("Failed to fetch stats:", e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {!isConfigured && (
        <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-center justify-center gap-3 text-amber-800 font-medium">
          <AlertTriangle size={20} />
          <span>Supabase keys missing. Please add VITE_SUPABASE_ANON_KEY to Secrets.</span>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold mb-6">
              <TrendingUp size={16} />
              <span>Innovating the Future</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-display font-bold text-primary leading-[1.1] mb-8">
              NBIU Computer <br />
              <span className="text-accent">Society Club</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
              The premier hub for technology enthusiasts at North Bengal International University. 
              Join us to build, learn, and lead in the digital era.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                Join Community <ArrowRight size={20} />
              </Link>
              <Link to="/feed" className="bg-white text-primary border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                View Feed
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://picsum.photos/seed/tech/800/600" 
                alt="Tech Community" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl z-20 max-w-xs">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <CheckCircle2 size={20} />
                </div>
                <p className="font-bold text-slate-800">Active Community</p>
              </div>
              <p className="text-sm text-slate-500">Weekly workshops, hackathons, and networking events for all members.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard icon={Users} label="Total Members" value={stats.members} color="bg-blue-600" />
          <StatCard icon={Calendar} label="Events Hosted" value={stats.events} color="bg-indigo-600" />
          <StatCard icon={Megaphone} label="Announcements" value={stats.posts} color="bg-violet-600" />
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
