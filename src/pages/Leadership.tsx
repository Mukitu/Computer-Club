import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award, Briefcase, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

const ExecutiveProfileCard = ({ profile, displaySize = 'md' }: { profile: Profile, displaySize?: 'lg' | 'md' | 'sm' }) => {
  const resolveAvatar = () => {
    if (profile.avatar_url) return profile.avatar_url;
    if (profile.gender === 'female') return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=b6e3f4';
    if (profile.gender === 'other') return 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix';
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -12 }}
      className={`bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-center text-center p-10 transition-all duration-500 ${
        displaySize === 'lg' ? 'max-w-md mx-auto' : 'max-w-sm'
      }`}
    >
      <div className={`relative mb-8 ${
        displaySize === 'lg' ? 'w-56 h-56' : displaySize === 'md' ? 'w-44 h-44' : 'w-32 h-32'
      }`}>
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
        <img 
          src={resolveAvatar()} 
          alt={profile.full_name} 
          className="w-full h-full rounded-full object-cover relative z-10 border-[6px] border-white shadow-2xl"
          referrerPolicy="no-referrer"
        />
        {displaySize === 'lg' && (
          <div className="absolute -bottom-3 -right-3 bg-primary text-white p-4 rounded-2xl shadow-2xl z-20 border-4 border-white">
            <Award size={28} />
          </div>
        )}
      </div>
      
      <h3 className={`${displaySize === 'lg' ? 'text-4xl' : 'text-2xl'} font-display font-black text-slate-900 mb-3 tracking-tight`}>
        {profile.full_name}
      </h3>
      <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-6 px-4 py-1.5 bg-primary/5 rounded-full">
        {profile.role === 'admin' ? 'Chief Executive Head' : 'Departmental Director'}
      </p>
      
      <div className="space-y-3 mb-10 w-full">
        <div className="flex items-center justify-center gap-3 text-slate-500 text-sm font-semibold">
          <Briefcase size={16} className="text-slate-400" />
          <span>{profile.department}</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-slate-500 text-sm font-semibold">
          <GraduationCap size={16} className="text-slate-400" />
          <span>{profile.batch} Batch</span>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button className="flex-1 py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-black hover:bg-primary transition-all shadow-lg shadow-slate-900/20">
          View Profile
        </button>
        <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100">
          <Mail size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default function Leadership() {
  const [executiveHead, setExecutiveHead] = useState<Profile | null>(null);
  const [departmentalDirectors, setDepartmentalDirectors] = useState<Profile[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const synchronizeLeadershipTeam = async () => {
      setIsSyncing(true);
      try {
        const { data: teamMembers, error: syncError } = await supabase
          .from('profiles')
          .select('*')
          .eq('status', 'approved')
          .eq('member_type', 'executive')
          .in('role', ['admin', 'moderator'])
          .order('role', { ascending: true });

        if (syncError) throw syncError;

        setExecutiveHead(teamMembers?.find(m => m.role === 'admin') || null);
        setDepartmentalDirectors(teamMembers?.filter(m => m.role === 'moderator') || []);
      } catch (err) {
        console.error('Leadership synchronization failed:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    synchronizeLeadershipTeam();
  }, []);

  if (isSyncing) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-32">
        <h1 className="text-6xl font-display font-black text-slate-900 mb-8 tracking-tighter">Executive Leadership</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
          The visionary architects behind the NBIU Computer Society, dedicated to fostering a culture of innovation and excellence.
        </p>
      </div>

      {/* Primary Leadership */}
      <section className="mb-40">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-primary/5 text-primary font-black text-xs uppercase tracking-[0.3em] mb-16 border border-primary/10">
            <Award size={16} />
            <span>Honorable Executive Head</span>
          </div>
          {executiveHead && <ExecutiveProfileCard profile={executiveHead} displaySize="lg" />}
        </div>
      </section>

      {/* Secondary Leadership */}
      <section>
        <div className="flex items-center gap-6 mb-20">
          <div className="h-px bg-slate-200 flex-1" />
          <div className="px-8 py-3 rounded-full bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-[0.3em] border border-slate-100">
            Departmental Directors
          </div>
          <div className="h-px bg-slate-200 flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {departmentalDirectors.map(director => (
            <ExecutiveProfileCard key={director.id} profile={director} />
          ))}
        </div>
      </section>
    </div>
  );
}
