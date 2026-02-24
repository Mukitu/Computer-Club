import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Grid, List, User, GraduationCap, Briefcase, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

const MemberCard = ({ member }: { member: Profile }) => {
  const getAvatar = () => {
    if (member.avatar_url) return member.avatar_url;
    if (member.gender === 'female') return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=b6e3f4';
    if (member.gender === 'other') return 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix';
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
          <img 
            src={getAvatar()} 
            alt={member.full_name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-accent transition-colors">{member.full_name}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{member.role}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100">{member.batch} Batch</span>
            <span className="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100">{member.department}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Members() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'approved')
      .order('full_name');
    setMembers(data || []);
    setLoading(false);
  };

  const filteredMembers = members.filter(m => 
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase()) ||
    m.batch.toLowerCase().includes(search.toLowerCase())
  );

  const executives = filteredMembers.filter(m => m.member_type === 'executive');
  const general = filteredMembers.filter(m => m.member_type === 'general' || !m.member_type);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary mb-2">Club Members</h1>
          <p className="text-slate-500">Meet the brilliant minds behind NBIU Computer Society.</p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full sm:w-64 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-primary text-white' : 'text-slate-400'}`}
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-primary text-white' : 'text-slate-400'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-20">
          {/* Executive Section */}
          {executives.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-display font-bold text-primary">Executive Committee</h2>
                <div className="h-px flex-grow bg-slate-100" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {executives.map(m => <MemberCard key={m.id} member={m} />)}
              </div>
            </section>
          )}

          {/* General Members */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-display font-bold text-primary">General Members</h2>
              <div className="h-px flex-grow bg-slate-100" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {general.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </section>
        </div>
      )}

      {!loading && filteredMembers.length === 0 && (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <User size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No members found</h3>
          <p className="text-slate-500">Try searching for a different name, batch, or department.</p>
        </div>
      )}
    </div>
  );
}
