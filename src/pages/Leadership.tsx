import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award, Briefcase, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

const LeaderCard = ({ member, size = 'md' }: { member: Profile, size?: 'lg' | 'md' | 'sm' }) => {
  const getAvatar = () => {
    if (member.avatar_url) return member.avatar_url;
    if (member.gender === 'female') return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=b6e3f4';
    if (member.gender === 'other') return 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix';
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col items-center text-center p-8 ${
        size === 'lg' ? 'max-w-md mx-auto' : 'max-w-sm'
      }`}
    >
      <div className={`relative mb-6 ${
        size === 'lg' ? 'w-48 h-48' : size === 'md' ? 'w-40 h-40' : 'w-32 h-32'
      }`}>
        <div className="absolute inset-0 bg-accent/10 rounded-full animate-pulse" />
        <img 
          src={getAvatar()} 
          alt={member.full_name} 
          className="w-full h-full rounded-full object-cover relative z-10 border-4 border-white shadow-xl"
          referrerPolicy="no-referrer"
        />
        {size === 'lg' && (
          <div className="absolute -bottom-2 -right-2 bg-accent text-white p-3 rounded-2xl shadow-lg z-20">
            <Award size={24} />
          </div>
        )}
      </div>
      
      <h3 className={`${size === 'lg' ? 'text-3xl' : 'text-xl'} font-display font-bold text-slate-900 mb-2`}>
        {member.full_name}
      </h3>
      <p className="text-accent font-bold uppercase tracking-widest text-xs mb-4">{member.role === 'admin' ? 'Executive Head' : 'Department Head'}</p>
      
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <Briefcase size={14} />
          <span>{member.department}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <GraduationCap size={14} />
          <span>{member.batch} Batch</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-accent hover:text-white transition-all">
          <Mail size={18} />
        </button>
        <button className="px-6 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-slate-800 transition-all">
          Profile
        </button>
      </div>
    </motion.div>
  );
};

export default function Leadership() {
  const [vc, setVc] = useState<Profile | null>(null);
  const [heads, setHeads] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('status', 'approved')
          .eq('member_type', 'executive')
          .in('role', ['admin', 'moderator'])
          .order('role', { ascending: true });

        if (error) throw error;

        // Separate VC (admin) from other heads
        const vcMember = data?.find(m => m.role === 'admin');
        const otherHeads = data?.filter(m => m.role === 'moderator') || [];

        if (vcMember) setVc(vcMember);
        setHeads(otherHeads);
      } catch (error) {
        console.error('Error fetching leadership:', error);
      }
    };

    fetchLeadership();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-24">
        <h1 className="text-5xl font-display font-bold text-primary mb-6">Our Leadership</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Guided by the vision of our esteemed university leaders and dedicated faculty members.
        </p>
      </div>

      {/* VC Section */}
      <section className="mb-32">
        <div className="flex flex-col items-center">
          <div className="inline-block px-6 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm uppercase tracking-widest mb-12">
            Honorable Vice Chancellor
          </div>
          {vc && <LeaderCard member={vc} size="lg" />}
        </div>
      </section>

      {/* Department Heads */}
      <section>
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 rounded-full bg-slate-100 text-slate-500 font-bold text-sm uppercase tracking-widest">
            Department Heads
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {heads.map(head => (
            <LeaderCard key={head.id} member={head} />
          ))}
        </div>
      </section>
    </div>
  );
}
