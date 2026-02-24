import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Newspaper, CreditCard, Settings, 
  CheckCircle2, XCircle, Trash2, Edit, Plus,
  LayoutDashboard, TrendingUp, UserCheck, Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile, Post, Payment, ClubSettings } from '../types';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'posts' | 'payments' | 'settings'>('overview');
  const [stats, setStats] = useState({ members: 0, pending: 0, posts: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  // Data states
  const [members, setMembers] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [payments, setPayments] = useState<(Payment & { profiles: Profile })[]>([]);
  const [settings, setSettings] = useState<ClubSettings | null>(null);

  useEffect(() => {
    fetchStats();
    fetchData();
  }, [activeTab]);

  const fetchStats = async () => {
    const { count: members } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: pending } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: posts } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    
    // Revenue calc (verified payments)
    const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'verified');
    const revenue = payments?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

    setStats({ members: members || 0, pending: pending || 0, posts: posts || 0, revenue });
  };

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'members') {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setMembers(data || []);
    } else if (activeTab === 'posts') {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      setPosts(data || []);
    } else if (activeTab === 'payments') {
      const { data } = await supabase.from('payments').select('*, profiles(*)').order('created_at', { ascending: false });
      setPayments(data as any || []);
    } else if (activeTab === 'settings') {
      const { data } = await supabase.from('settings').select('*').single();
      setSettings(data);
    }
    setLoading(false);
  };

  const handleMemberStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Member ${status}`);
      fetchData();
    }
  };

  const handlePaymentStatus = async (id: string, status: 'verified' | 'rejected') => {
    const { error } = await supabase.from('payments').update({ status }).eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Payment ${status}`);
      fetchData();
    }
  };

  const updateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('settings').update({
      monthly_fee: settings?.monthly_fee,
      bkash_number: settings?.bkash_number
    }).eq('id', settings?.id);
    
    if (error) toast.error(error.message);
    else toast.success('Settings updated');
  };

  const [editingMember, setEditingMember] = useState<Profile | null>(null);

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editingMember.full_name,
        batch: editingMember.batch,
        department: editingMember.department,
        member_type: editingMember.member_type,
        avatar_url: editingMember.avatar_url,
        status: editingMember.status,
        role: editingMember.role
      })
      .eq('id', editingMember.id);

    if (error) toast.error(error.message);
    else {
      toast.success('Member updated successfully');
      setEditingMember(null);
      fetchData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Edit Member Modal */}
      <AnimatePresence>
        {editingMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingMember(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-display font-bold text-primary mb-6">Edit Member Details</h2>
              <form onSubmit={handleUpdateMember} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editingMember.full_name}
                      onChange={(e) => setEditingMember({...editingMember, full_name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Batch</label>
                    <input 
                      type="text" 
                      value={editingMember.batch}
                      onChange={(e) => setEditingMember({...editingMember, batch: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Department</label>
                  <input 
                    type="text" 
                    value={editingMember.department}
                    onChange={(e) => setEditingMember({...editingMember, department: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Member Type</label>
                    <select 
                      value={editingMember.member_type}
                      onChange={(e) => setEditingMember({...editingMember, member_type: e.target.value as any})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                    >
                      <option value="general">General Member</option>
                      <option value="executive">Executive Member</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Gender</label>
                    <select 
                      value={editingMember.gender}
                      onChange={(e) => setEditingMember({...editingMember, gender: e.target.value as any})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
                  <select 
                    value={editingMember.status}
                    onChange={(e) => setEditingMember({...editingMember, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Image Link (Google Drive/Direct Link)</label>
                  <input 
                    type="text" 
                    placeholder="https://..."
                    value={editingMember.avatar_url || ''}
                    onChange={(e) => setEditingMember({...editingMember, avatar_url: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Required for Executive Members to show on website.</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit"
                    className="flex-grow bg-primary text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your club operations and members.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'members', icon: Users, label: 'Members' },
            { id: 'posts', icon: Newspaper, label: 'Posts' },
            { id: 'payments', icon: CreditCard, label: 'Payments' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Total Members</p>
              <p className="text-4xl font-display font-bold text-primary">{stats.members}</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Clock size={24} />
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Pending Approval</p>
              <p className="text-4xl font-display font-bold text-primary">{stats.pending}</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Total Revenue</p>
              <p className="text-4xl font-display font-bold text-primary">৳{stats.revenue}</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6">
                <Newspaper size={24} />
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Total Posts</p>
              <p className="text-4xl font-display font-bold text-primary">{stats.posts}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-display font-bold text-primary mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100" />
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-slate-900">New member joined</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <th className="px-8 py-4">Member</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Joined</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                          <img src={m.avatar_url || `https://picsum.photos/seed/${m.id}/100/100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{m.full_name}</p>
                          <p className="text-xs text-slate-500">{m.student_id} • {m.batch}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {m.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        m.status === 'approved' ? 'bg-green-100 text-green-600' : 
                        m.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500">
                      {format(new Date(m.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {m.status === 'pending' && (
                          <>
                            <button onClick={() => handleMemberStatus(m.id, 'approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                              <CheckCircle2 size={18} />
                            </button>
                            <button onClick={() => handleMemberStatus(m.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => setEditingMember(m)}
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <th className="px-8 py-4">Member</th>
                  <th className="px-8 py-4">TRX ID</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-900">{p.profiles?.full_name}</p>
                      <p className="text-xs text-slate-500">{p.month}</p>
                    </td>
                    <td className="px-8 py-5 font-mono text-sm text-slate-600">{p.trx_id}</td>
                    <td className="px-8 py-5 font-bold text-slate-900">৳{p.amount}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        p.status === 'verified' ? 'bg-green-100 text-green-600' : 
                        p.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {p.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handlePaymentStatus(p.id, 'verified')} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                            <CheckCircle2 size={18} />
                          </button>
                          <button onClick={() => handlePaymentStatus(p.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl"
          >
            <h2 className="text-2xl font-display font-bold text-primary mb-8">Club Settings</h2>
            <form onSubmit={updateSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Membership Fee (৳)</label>
                <input 
                  type="number" 
                  value={settings?.monthly_fee || 0}
                  onChange={(e) => setSettings(s => s ? {...s, monthly_fee: parseInt(e.target.value)} : null)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">bKash Payment Number</label>
                <input 
                  type="text" 
                  value={settings?.bkash_number || ''}
                  onChange={(e) => setSettings(s => s ? {...s, bkash_number: e.target.value} : null)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-primary/20"
              >
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display font-bold text-primary">Manage Posts</h2>
            <button className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-accent/20">
              <Plus size={20} /> Create Post
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">{post.title}</h3>
                <p className="text-xs text-slate-500 mb-6">{format(new Date(post.created_at), 'MMM d, yyyy')}</p>
                <div className="flex justify-end gap-2">
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
