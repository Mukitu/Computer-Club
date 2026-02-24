import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, GraduationCap, Briefcase, Contact as IdentificationCard, Shield, CheckCircle2, LogOut } from 'lucide-react';

export default function Profile() {
  const { profile, loading: authLoading, signOut } = useAuth();

  const getAvatar = () => {
    if (profile?.avatar_url) return profile.avatar_url;
    
    // Gender based default avatars
    if (profile?.gender === 'female') return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=b6e3f4';
    if (profile?.gender === 'other') return 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix';
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c0aede';
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
        <p className="text-slate-500 mb-8">We couldn't load your profile details. Please try signing in again.</p>
        <button 
          onClick={() => signOut()}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary mb-2">My Profile</h1>
          <p className="text-slate-500">Your account details as managed by the club administration.</p>
        </div>
        <button 
          onClick={() => signOut()}
          className="bg-white text-red-500 border border-red-100 px-6 py-3 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center gap-2"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl text-center"
          >
            <div className="relative inline-block mb-6 group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                <img 
                  src={getAvatar()} 
                  alt={profile.full_name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-1">{profile.full_name}</h2>
            <p className="text-accent font-bold uppercase tracking-widest text-xs mb-6 capitalize">{profile.member_type || 'General Member'}</p>
            
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
              profile.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {profile.status === 'approved' ? <CheckCircle2 size={14} /> : <Shield size={14} />}
              {profile.status}
            </div>
          </motion.div>

          <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Shield size={18} /> Account Status
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your profile is {profile.status}. Only administrators can modify your account details.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10"
          >
            <section>
              <h3 className="text-xl font-display font-bold text-primary mb-6">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={12} /> Full Name
                  </p>
                  <p className="font-semibold text-slate-900">{profile.full_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={12} /> Email Address
                  </p>
                  <p className="font-semibold text-slate-900">{profile.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <IdentificationCard size={12} /> Student ID
                  </p>
                  <p className="font-semibold text-slate-900">{profile.student_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap size={12} /> Batch
                  </p>
                  <p className="font-semibold text-slate-900">{profile.batch} Batch</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={12} /> Department
                  </p>
                  <p className="font-semibold text-slate-900">{profile.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={12} /> Gender
                  </p>
                  <p className="font-semibold text-slate-900 capitalize">{profile.gender || 'Not Specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield size={12} /> Member Type
                  </p>
                  <p className="font-semibold text-slate-900 capitalize">{profile.member_type || 'General'}</p>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
