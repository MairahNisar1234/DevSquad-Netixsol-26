import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Play, Plus, Star, Calendar, ArrowRight, ArrowLeft,
  ThumbsUp, Volume2, X, LayoutGrid 
} from 'lucide-react';
import Footer from '../components/Footer';
import TrailBanner from '../components/TrailBanner';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MovieView: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [data, setData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  // Review Form State
  const [newRating, setNewRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const castScrollRef = useRef<HTMLDivElement>(null);
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const isShow = location.pathname.includes('/show/');
      const endpoint = isShow 
        ? `${API_URL}/api/shows/${id}` 
        : `${API_URL}/api/movies/${id}`;
        
      const res = await axios.get(endpoint);
      setData(res.data);
    } catch (err) { 
      console.error("API Error:", err); 
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, location.pathname]);

  const handlePlayClick = () => {
    if (!user) {
      alert("Please log in to watch content.");
      return;
    }
    const hasAccess = user.role === 'admin' || (user.subscriptionPlan && user.subscriptionPlan !== 'none');
    if (hasAccess) {
      setIsPlaying(true);
    } else {
      alert("Your current plan does not include this content.");
      navigate('/subscriptions'); 
    }
  };

  const scroll = (direction: 'left' | 'right', type: 'cast' | 'review') => {
    const ref = type === 'cast' ? castScrollRef : reviewScrollRef;
    
    // The 'ref && ref.current' check prevents the Build Error
    if (ref && ref.current) {
      const scrollAmount = direction === 'left' ? -450 : 450;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Login to review");
    if (newRating === 0) return alert("Please select a rating");

    try {
      const isShow = location.pathname.includes('/show/');
      const endpoint = isShow 
        ? `${API_URL}/api/shows/${id}/reviews` 
        : `${API_URL}/api/movies/${id}/reviews`;

      await axios.post(endpoint, {
        rating: newRating,
        text: comment,
        name: user.name
      });

      // Reset form and close modal
      setComment('');
      setNewRating(0);
      setIsReviewModalOpen(false);
      
      // Refresh data locally
      fetchData();
      alert("Review added successfully!");
    } catch (err) {
      console.error("Review Error:", err);
      alert("Failed to post review. Check your connection.");
    }
  };

  if (!data) return (
    <div className="h-screen bg-black flex items-center justify-center text-red-600 font-black text-4xl uppercase animate-pulse">
      STREAMVIBE
    </div>
  );

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#0F0F0F] text-white pb-20 font-sans selection:bg-red-600">
        
        {/* REVIEW MODAL OVERLAY */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[1001] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F0F0F] border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl relative">
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-2 uppercase tracking-tighter">Rate this Content</h2>
              <p className="text-gray-500 text-sm mb-8">Share your thoughts with the community.</p>

              <form onSubmit={handleReviewSubmit}>
                <div className="flex gap-3 mb-8 justify-center bg-[#141414] py-6 rounded-2xl border border-white/5">
                  {[...Array(5)].map((_, i) => (
                    <button 
                      key={i} 
                      type="button" 
                      onClick={() => setNewRating(i + 1)}
                      onMouseEnter={() => setHover(i + 1)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star 
                        size={32} 
                        fill={(hover || newRating) > i ? "#E50000" : "none"} 
                        className={(hover || newRating) > i ? "text-[#E50000]" : "text-gray-600"} 
                      />
                    </button>
                  ))}
                </div>

                <textarea 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you think of the story and cast?" 
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-red-600 min-h-[120px] mb-6 resize-none"
                  required
                />

                <button 
                  type="submit" 
                  className="w-full bg-red-600 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-red-700 transition-all"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIDEO PLAYER */}
        {isPlaying && (
          <div className="fixed inset-0 z-[999] bg-black flex items-center justify-center">
            <button onClick={() => setIsPlaying(false)} className="absolute top-10 right-10 z-[1000] p-4 bg-white/10 rounded-full hover:bg-red-600 border border-white/10">
              <X size={28} />
            </button>
            <div className="w-full max-w-6xl aspect-video px-4">
              <video className="w-full h-full object-contain rounded-3xl" controls autoPlay>
                <source src={data.videoUrl} type="video/mp4" />
              </video>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        <div className="max-w-[90%] mx-auto mt-28"> 
          <div className="relative aspect-[21/9] w-full rounded-[1.2rem] overflow-hidden border border-white/5 bg-[#141414] shadow-2xl">
            <img src={data.thumbnail} className="w-full h-full object-cover brightness-[0.4]" alt="" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center bg-gradient-to-t from-[#0F0F0F] via-transparent">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight uppercase ">{data.title}</h1>
              <p className="max-w-3xl text-gray-400 text-xs md:text-sm mb-8 font-light leading-relaxed line-clamp-2">{data.description}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button onClick={handlePlayClick} className="flex items-center gap-2 bg-[#E50914] px-10 py-4 rounded-xl font-bold uppercase text-sm hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all">
                  <Play fill="white" size={16} /> Play Now
                </button>
                <button className="p-4 bg-[#141414]/80 border border-white/10 rounded-xl hover:bg-white/10"><Plus size={18}/></button>
                <button className="p-4 bg-[#141414]/80 border border-white/10 rounded-xl hover:bg-white/10"><ThumbsUp size={18}/></button>
                <button className="p-4 bg-[#141414]/80 border border-white/10 rounded-xl hover:bg-white/10"><Volume2 size={18}/></button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[95%] mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            
            <section className="bg-[#141414] p-8 rounded-md border border-white/10">
              <h3 className="text-gray-500 font-black text-[14px] mb-4 uppercase tracking-widest">Description</h3>
              <p className="text-gray-200 leading-[1.8] font-normal text-sm lg:text-lg">{data.description}</p>
            </section>

            {/* CAST SECTION */}
            <section className="p-10 rounded-[1.5rem] border border-white/10 bg-[#141414]">
               <div className="flex items-center justify-between mb-10">
                 <span className="text-gray-500 font-black text-[14px] uppercase tracking-widest">Cast</span>
                 <div className="flex gap-2">
                    <button onClick={() => scroll('left', 'cast')} className="p-3 bg-[#1A1A1A] border border-white/10 rounded-full text-white hover:bg-white/5 transition-colors"><ArrowLeft size={16}/></button>
                    <button onClick={() => scroll('right', 'cast')} className="p-3 bg-[#1A1A1A] border border-white/10 rounded-full text-white hover:bg-white/5 transition-colors"><ArrowRight size={16}/></button>
                 </div>
               </div>
               <div ref={castScrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth">
                  {data.cast?.map((actor: any, i: number) => (
                    <div key={i} className="flex-shrink-0 w-28 text-center group">
                      <img src={actor.image} className="w-24 h-24 rounded-3xl object-cover mb-4 border border-white/10 group-hover:border-red-600 transition-all" alt={actor.name} />
                      <p className="text-[10px] font-bold text-gray-400 truncate">{actor.name}</p>
                    </div>
                  ))}
               </div>
            </section>

            {/* REVIEWS SECTION */}
            <section className="p-10 rounded-[1.5rem] border border-white/10 bg-[#141414]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-semibold text-white">Reviews</h2>
                <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  className="flex items-center gap-2 bg-[#1A1A1A] border border-white/10 px-5 py-3 rounded-xl hover:bg-white/5 transition-all text-sm"
                >
                  <Plus size={18} /> Add Your Review
                </button>
              </div>

              <div ref={reviewScrollRef} className="flex gap-5 overflow-x-auto hide-scrollbar scroll-smooth">
                {data.reviews?.length > 0 ? data.reviews.map((rev: any, i: number) => (
                  <div key={i} className="flex-shrink-0 w-[450px] bg-[#0F0F0F] p-10 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="font-bold text-lg mb-1">{rev.name}</p>
                        <p className="text-gray-500 text-xs font-medium">From {rev.location || 'Member'}</p>
                      </div>
                      <div className="bg-[#141414] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, starIdx) => (
                            <Star 
                              key={starIdx} 
                              size={14} 
                              fill={starIdx < Math.floor(rev.rating) ? "#E50000" : "none"} 
                              className={starIdx < Math.floor(rev.rating) ? "text-[#E50000]" : "text-gray-600"}
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 font-bold text-sm ml-1">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-[1.8] font-light ">
                      "{rev.text}"
                    </p>
                  </div>
                )) : (
                  <div className="w-full text-center py-10 text-gray-500">No reviews yet. Be the first to rate!</div>
                )}
              </div>

              <div className="flex items-center justify-center mt-12 gap-6">
                <button onClick={() => scroll('left', 'review')} className="p-4 bg-[#1A1A1A] border border-white/10 rounded-full text-white hover:bg-white/5 transition-all">
                  <ArrowLeft size={20}/>
                </button>
                <div className="flex gap-2">
                  <div className="w-6 h-1 bg-red-600 rounded-full"></div>
                  <div className="w-6 h-1 bg-gray-800 rounded-full"></div>
                  <div className="w-6 h-1 bg-gray-800 rounded-full"></div>
                </div>
                <button onClick={() => scroll('right', 'review')} className="p-4 bg-[#1A1A1A] border border-white/10 rounded-full text-white hover:bg-white/5 transition-all">
                  <ArrowRight size={20}/>
                </button>
              </div>
            </section>
          </div>
          
          <aside className="space-y-6">
            <div className="bg-[#141414] p-8 rounded-[1.2rem] border border-white/10 space-y-8 sticky top-32">
              <div>
                <p className="text-gray-500 text-[14px] font-medium flex items-center gap-2 mb-3"><Calendar size={18} /> Released Year</p>
                <p className="text-xl font-bold text-white">{data.releaseYear}</p>
              </div>

              <div>
                <p className="text-gray-500 text-[14px] font-medium flex items-center gap-2 mb-3">文 Available Languages</p>
                <div className="flex flex-wrap gap-2">
                  {data.languages?.map((lang: string) => (
                    <span key={lang} className="bg-[#0F0F0F] border border-white/10 px-4 py-2 rounded-lg text-sm font-medium">{lang}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-[14px] font-medium flex items-center gap-2 mb-3"><Star size={18} /> Ratings</p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-[#0F0F0F] border border-white/10 p-4 rounded-xl flex justify-between items-center">
                    <span className="font-bold uppercase text-xs">StreamVibe</span>
                    <div className="flex items-center gap-2">
                      <Star size={14} fill="#E50000" className="text-[#E50000]"/>
                      <span className="text-white font-bold">{data.rating || 4.5}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-[14px] font-medium flex items-center gap-2 mb-3"><LayoutGrid size={18} /> Genres</p>
                <div className="flex flex-wrap gap-2">
                  {data.genres?.map((genre: string) => (
                    <span key={genre} className="bg-[#0F0F0F] border border-white/10 px-4 py-2 rounded-lg text-sm">{genre}</span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <TrailBanner/>
      <Footer/>
    </>
  );
};

export default MovieView;