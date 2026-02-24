import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, CheckCircle2, AlertCircle, History, Smartphone, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Payment, ClubSettings } from '../types';

export default function Payments() {
  const { profile } = useAuth();
  const [settings, setSettings] = useState<ClubSettings | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    const { data: settingsData } = await supabase.from('settings').select('*').single();
    setSettings(settingsData);

    if (profile) {
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      setPayments(paymentsData || []);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('payments').insert({
        user_id: profile?.id,
        amount: settings?.monthly_fee,
        trx_id: trxId,
        month: format(new Date(), 'MMMM yyyy'),
        status: 'pending'
      });

      if (error) throw error;
      toast.success('Payment submitted! Admin will verify soon.');
      setTrxId('');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Number copied!');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-primary mb-2">Monthly Fee</h1>
        <p className="text-slate-500">Manage your club membership payments and history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Payment Form */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-accent/20">
                <CreditCard size={28} />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Make Payment</h2>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-500 text-sm font-medium">Monthly Fee</span>
                  <span className="text-2xl font-display font-bold text-primary">৳{settings?.monthly_fee || 0}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-slate-500 text-sm font-medium">bKash Number</span>
                  <button 
                    onClick={() => copyToClipboard(settings?.bkash_number || '')}
                    className="flex items-center gap-2 text-accent font-bold hover:underline"
                  >
                    {settings?.bkash_number}
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Transaction ID (TRX ID)</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Enter bKash TRX ID" 
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit Payment'}
                </button>
              </form>
            </div>
          </motion.div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
            <AlertCircle className="text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800 leading-relaxed">
              Please ensure you send the exact amount to the bKash number above before submitting your Transaction ID. Verification usually takes 24-48 hours.
            </p>
          </div>
        </div>

        {/* Payment History */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="text-slate-400" />
                <h2 className="text-2xl font-display font-bold text-slate-900">Payment History</h2>
              </div>
              <span className="px-4 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
                {payments.length} Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <th className="px-8 py-4">Month</th>
                    <th className="px-8 py-4">TRX ID</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-900">{p.month}</td>
                      <td className="px-8 py-5 text-slate-600 font-mono text-sm">{p.trx_id}</td>
                      <td className="px-8 py-5 font-bold text-slate-900">৳{p.amount}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          p.status === 'verified' ? 'bg-green-100 text-green-600' : 
                          p.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {p.status === 'verified' && <CheckCircle2 size={12} />}
                          {p.status === 'rejected' && <AlertCircle size={12} />}
                          <span className="capitalize">{p.status}</span>
                        </span>
                      </td>
                      <td className="px-8 py-5 text-slate-500 text-sm">
                        {format(new Date(p.created_at), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                        No payment records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
