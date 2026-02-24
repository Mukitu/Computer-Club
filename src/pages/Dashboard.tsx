import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, GraduationCap, Briefcase, 
  Contact as IdentificationCard, Shield, 
  CheckCircle2, LogOut, TrendingUp, 
  Users, Calendar, Activity, DollarSign,
  ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

export default function Dashboard() {
  const { profile, loading: authLoading, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    eventsPlanned: 0,
    latestUpdates: 0,
    feeIncome: 0,
    eventIncome: 0,
    totalExpenses: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const dataGuard = setTimeout(() => setLoading(false), 5000);

    try {
      // 1. Member Stats
      const { count: total } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: active } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'approved');
      
      // 2. Post Stats
      const { count: events } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('type', 'event');
      const { count: updates } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('type', 'news');

      // 3. Financial Stats - Fee Income
      const { data: feePayments } = await supabase.from('payments').select('amount').eq('status', 'verified');
      const feeIncome = feePayments?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

      // 4. Financial Stats - Transactions (Event Income & Expenses)
      const { data: transactions } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
      
      const eventIncome = transactions
        ?.filter(t => t.type === 'income' && t.category === 'event')
        .reduce((acc, curr) => acc + curr.amount, 0) || 0;
        
      const totalExpenses = transactions
        ?.filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0) || 0;

      setStats({
        totalMembers: total || 0,
        activeMembers: active || 0,
        eventsPlanned: events || 0,
        latestUpdates: updates || 0,
        feeIncome,
        eventIncome,
        totalExpenses
      });

      setRecentTransactions(transactions?.slice(0, 5) || []);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      clearTimeout(dataGuard);
      setLoading(false);
    }
  };

  const getAvatar = () => {
    if (profile?.avatar_url) return profile.avatar_url;
    if (profile?.gender === 'female') return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=b6e3f4';
    if (profile?.gender === 'other') return 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix';
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede';
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
        <p className="text-slate-500 mb-8">We couldn't find your society profile. Please ensure you have registered correctly or contact an administrator.</p>
        <button 
          onClick={() => signOut()}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-black text-slate-900 mb-2 tracking-tight">Member Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, {profile.full_name.split(' ')[0]}! Here's what's happening in the society.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
            profile.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {profile.status === 'approved' ? <CheckCircle2 size={14} /> : <Activity size={14} />}
            {profile.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Financials */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Active Members</p>
              <p className="text-4xl font-display font-black text-slate-900">{stats.activeMembers}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar size={24} />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Events Planned</p>
              <p className="text-4xl font-display font-black text-slate-900">{stats.eventsPlanned}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6">
                <Activity size={24} />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Latest Updates</p>
              <p className="text-4xl font-display font-black text-slate-900">{stats.latestUpdates}</p>
            </motion.div>
          </div>

          {/* Financial Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/20"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-display font-black mb-2">Society Treasury</h3>
                <p className="text-slate-400 text-sm font-medium">Real-time financial transparency for all members.</p>
              </div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <DollarSign size={28} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-2">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Member Fees</p>
                <p className="text-3xl font-display font-black">৳{stats.feeIncome}</p>
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase">
                  <ArrowUpCircle size={12} /> Verified
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Event Income</p>
                <p className="text-3xl font-display font-black">৳{stats.eventIncome}</p>
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase">
                  <ArrowUpCircle size={12} /> External
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Expenses</p>
                <p className="text-3xl font-display font-black">৳{stats.totalExpenses}</p>
                <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase">
                  <ArrowDownCircle size={12} /> Outflow
                </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Net Balance</p>
                <p className="text-4xl font-display font-black text-primary">৳{stats.feeIncome + stats.eventIncome - stats.totalExpenses}</p>
              </div>
              <TrendingUp size={40} className="text-white/5" />
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-display font-black text-slate-900">Recent Transactions</h3>
              <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentTransactions.length > 0 ? recentTransactions.map((t) => (
                <div key={t.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{t.description}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{t.category} • {new Date(t.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-display font-black ${
                    t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}৳{t.amount}
                  </p>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-400 font-medium">No recent transactions recorded.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Details */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl text-center"
          >
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-slate-50">
                <img 
                  src={getAvatar()} 
                  alt={profile.full_name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-2xl shadow-xl border-4 border-white">
                <Shield size={16} />
              </div>
            </div>
            
            <h2 className="text-2xl font-display font-black text-slate-900 mb-2 tracking-tight">{profile.full_name}</h2>
            <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-8 px-4 py-1.5 bg-primary/5 rounded-full inline-block">
              {profile.role} • {profile.member_type}
            </p>

            <div className="space-y-6 text-left pt-8 border-t border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <IdentificationCard size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student ID</p>
                  <p className="text-sm font-bold text-slate-700">{profile.student_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch & Dept</p>
                  <p className="text-sm font-bold text-slate-700">{profile.batch} • {profile.department}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => signOut()}
              className="w-full mt-10 bg-rose-50 text-rose-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </motion.div>

          {/* Quick Links */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-white rounded-2xl border border-slate-100 text-center hover:shadow-md transition-all">
                <Activity size={20} className="mx-auto mb-2 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Pay Fees</span>
              </button>
              <button className="p-4 bg-white rounded-2xl border border-slate-100 text-center hover:shadow-md transition-all">
                <TrendingUp size={20} className="mx-auto mb-2 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
