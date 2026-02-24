import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Calendar, Megaphone, Newspaper, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

const PostCard = ({ post }: { post: Post }) => {
  const getBadge = () => {
    switch (post.type) {
      case 'event': return { icon: Calendar, color: 'bg-blue-100 text-blue-600', label: 'Event' };
      case 'notice': return { icon: Megaphone, color: 'bg-red-100 text-red-600', label: 'Notice' };
      default: return { icon: Newspaper, color: 'bg-green-100 text-green-600', label: 'News' };
    }
  };

  const badge = getBadge();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {post.image_url && (
        <div className="h-56 overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.color}`}>
            <badge.icon size={14} />
            <span>{badge.label}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock size={14} />
            <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 leading-tight">{post.title}</h3>
        
        <div className="markdown-body text-slate-600 mb-8 line-clamp-3">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-700">Admin</span>
          </div>
          <button className="text-accent font-bold text-sm hover:underline">Read More</button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'news' | 'notice' | 'event'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
    
    if (filter !== 'all') {
      query = query.eq('type', filter);
    }

    const { data } = await query;
    setPosts(data || []);
    setLoading(false);
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary mb-2">Club Feed</h1>
          <p className="text-slate-500">Stay updated with the latest news, notices, and events.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full sm:w-64 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
            {(['all', 'news', 'notice', 'event'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                  filter === f ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredPosts.length === 0 && (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Filter size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No posts found</h3>
          <p className="text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
