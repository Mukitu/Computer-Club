import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Grid, List, User, GraduationCap, Briefcase, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

const MemberIdentityCard = ({ identity }: { identity: Profile }) => {
  const resolveAvatar = () => {
    if (identity.avatar_url) return identity.avatar_url;
    if (identity.gender === 'female') return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=b6e3f4';
    if (identity.gender === 'other') return 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix';
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-500 border-4 border-white bg-slate-50">
          <img 
            src={resolveAvatar()} 
            alt={identity.full_name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-display font-black text-slate-900 group-hover:text-primary transition-colors truncate tracking-tight">
            {identity.full_name}
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            {identity.role}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-500 rounded-lg border border-slate-100 uppercase tracking-wider">
              {identity.batch} Batch
            </span>
            <span className="px-3 py-1 bg-primary/5 text-[10px] font-black text-primary rounded-lg border border-primary/10 uppercase tracking-wider">
              {identity.department}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Members() {
  const [memberRegistry, setMemberRegistry] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegistryLoading, setIsRegistryLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const synchronizeMemberRegistry = async () => {
      setIsRegistryLoading(true);
      try {
        const { data: registryData, error: registryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('status', 'approved')
          .order('full_name');
          
        if (registryError) throw registryError;
        setMemberRegistry(registryData || []);
      } catch (err) {
        console.error("Member registry synchronization failed:", err);
      } finally {
        setIsRegistryLoading(false);
      }
    };

    synchronizeMemberRegistry();
  }, []);

  const filteredRegistry = memberRegistry.filter(member => 
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const executiveTier = filteredRegistry.filter(m => m.member_type === 'executive');
  const generalTier = filteredRegistry.filter(m => m.member_type === 'general' || !m.member_type);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
        <div className="max-w-xl">
          <h1 className="text-5xl font-display font-black text-slate-900 mb-4 tracking-tighter">Member Registry</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Explore the diverse community of innovators and problem solvers at NBIU Computer Society.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Filter by name, batch, or dept..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-8 py-4 bg-white border border-slate-200 rounded-2xl w-full sm:w-80 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 shadow-sm"
            />
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setDisplayMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${displayMode === 'grid' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid size={22} />
            </button>
            <button 
              onClick={() => setDisplayMode('list')}
              className={`p-2.5 rounded-xl transition-all ${displayMode === 'list' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={22} />
            </button>
          </div>
        </div>
      </div>

      {isRegistryLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-14 h-14 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Synchronizing Registry...</p>
        </div>
      ) : (
        <div className="space-y-24">
          {executiveTier.length > 0 && (
            <section>
              <div className="flex items-center gap-6 mb-12">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Executive Tier</h2>
                <div className="h-px bg-primary/10 flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {executiveTier.map(member => (
                  <MemberIdentityCard key={member.id} identity={member} />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">General Registry</h2>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {generalTier.map(member => (
                <MemberIdentityCard key={member.id} identity={member} />
              ))}
            </div>
            {generalTier.length === 0 && searchQuery && (
              <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No members found matching your criteria.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
