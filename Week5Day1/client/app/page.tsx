'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
// NEW: Professional React Icons
import { MessageSquare, Heart, Share2, Sparkles, Send, Zap } from 'lucide-react';

const SOCKET_URL = "https://devsquadapi.onrender.com"; 
const socket = io(SOCKET_URL);

const timeAgo = (date: string | number | Date) => {
  if (!date) return 'Just now';
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return new Date(date).toLocaleDateString();
};

export default function Home() {
  const [postId] = useState('main-blog');
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setMounted(true);
    const generatedUser = 'Dev_' + Math.floor(Math.random() * 999);
    setUser(generatedUser);
    
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.emit('join_blog', { postId });
    socket.on('initial_comments', setComments);

    // FIXED: Global Notifications with Icons
    socket.on('new_comment', (c) => {
      setComments(prev => [c, ...prev]);
      toast.success(`${c.user} shared a thought!`, {
        icon: <MessageSquare size={18} className="text-indigo-500" />,
      });
    });

    socket.on('comment_updated', (updated) => {
      setComments(prev => prev.map(c => c._id === updated._id ? updated : c));
      toast(`Pulse Update: New activity`, {
        icon: <Sparkles size={18} className="text-amber-500" />,
      });
    });

    return () => { socket.disconnect(); };
  }, [postId]);

  const postComment = () => {
    if (!text.trim()) return;
    socket.emit('add_comment', { text, user, postId });
    setText('');
  };

  const postReply = (commentId: string) => {
    if (!replyText.trim()) return;
    socket.emit('reply_comment', { commentId, text: replyText, user, postId });
    setReplyText('');
    setActiveReplyId(null);
  };

  if (!mounted || !user) return null;

  return (
    <div className="relative min-h-screen selection:bg-indigo-100 antialiased pb-20">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        html, body { font-family: 'Plus Jakarta Sans', sans-serif !important; }
      `}</style>
      
      <Toaster position="top-right" />
      
      {/* Background Image & Blur */}
      <div className="fixed inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2500" className="w-full h-full object-cover" alt="BG" />
        <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-3xl" />
      </div>

      <nav className="fixed top-0 w-full h-24 flex items-center px-6 z-50">
        <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="max-w-5xl mx-auto w-full flex justify-between items-center bg-white/60 backdrop-blur-2xl px-8 py-4 rounded-[2rem] border border-white/40 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg">
                 <Zap size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-[900] tracking-tighter text-slate-900 uppercase">DEVSQUAD</span>
            </div>
            <div className="hidden md:block h-6 w-[1px] bg-slate-200 mx-2" />
            <span className="hidden md:block text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Articles with a Pulse</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{user}</span>
          </div>
        </motion.div>
      </nav>

      <main className="pt-36 px-6 max-w-4xl mx-auto">
        <article className="mb-20">
           <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Technology & Architecture</motion.span>
           <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-[900] text-slate-900 tracking-tighter leading-[0.9] mb-8">The Future of <br/>Real-Time Web.</motion.h1>
        </article>

        <section id="comments" className="bg-white/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white shadow-slate-200/60 mb-20">
          <h2 className="text-3xl font-[900] text-slate-900 tracking-tight mb-10 flex items-center gap-3">
            <MessageSquare className="text-indigo-500" /> Thoughts <span className="text-indigo-500 text-sm align-top opacity-50">({comments.length})</span>
          </h2>
          
          <div className="group relative bg-slate-50/50 rounded-3xl p-6 border-2 border-slate-100 focus-within:border-indigo-500/20 focus-within:bg-white transition-all mb-16">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Contribute to the architecture..." className="w-full bg-transparent outline-none text-slate-800 text-lg font-medium resize-none h-24 placeholder:text-slate-300" />
            <div className="flex justify-end mt-4 pt-4 border-t border-slate-200/50">
               <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={postComment} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2">
                 Post Thought <Send size={14} />
               </motion.button>
            </div>
          </div>

          <div className="space-y-16">
            <AnimatePresence mode="popLayout">
              {comments.map((c) => (
                <motion.div key={c._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="border-b border-slate-50 pb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg">
                      {c.user?.charAt(4) || 'D'}
                    </div>
                    <div>
                      <span className="font-black text-slate-900 block">{c.user}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{timeAgo(c.createdAt)}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-lg font-medium leading-relaxed mb-6 pl-1">{c.text}</p>
                  
                  <div className="flex gap-3 pl-1">
                    <motion.button 
                      whileTap={{ scale: 1.3, rotate: 8 }}
                      onClick={() => socket.emit('like_comment', { commentId: c._id, postId })} 
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 transition-all font-black text-[11px] uppercase tracking-widest ${c.likes > 0 ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      <Heart size={14} fill={c.likes > 0 ? "currentColor" : "none"} /> {c.likes || 0}
                    </motion.button>
                    
                    <button onClick={() => setActiveReplyId(activeReplyId === c._id ? null : c._id)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-indigo-600 transition-colors">
                      <Share2 size={14} /> {activeReplyId === c._id ? 'Cancel' : 'Reply'}
                    </button>
                  </div>

                  {activeReplyId === c._id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 ml-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-200">
                      <textarea autoFocus value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." className="w-full bg-transparent outline-none h-20 text-slate-700" />
                      <div className="flex justify-end mt-2">
                        <button onClick={() => postReply(c._id)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                          Send Reply <Send size={12} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {c.replies?.length > 0 && (
                    <div className="ml-10 mt-6 space-y-4 border-l-2 border-slate-100 pl-6">
                      {c.replies.map((r: any, i: number) => (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <span className="font-black text-indigo-600 text-[10px] uppercase block mb-1">{r.user}</span>
                          <span className="text-slate-600 font-medium">{r.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}