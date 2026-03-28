import React, { useState } from 'react';
import axios from 'axios';
import { 
  Film, Image as ImageIcon, Sparkles, Star, Calendar, 
  BarChart3, Users, UserCheck, Music 
} from 'lucide-react';

const AddMovie: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    genre: '',
    releaseYear: 2026,
    duration: '',
    category: 'Movie',
    releaseDate: '', 
    rating: 0,
    viewCount: '',
    // --- NEW CREW FIELDS ---
    castNames: '', // Input as "Actor 1, Actor 2"
    directorName: '',
    directorCountry: 'India',
    musicName: ''
  });

  const handleUpload = (type: 'image' | 'video') => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      { cloudName: 'dru7ig67d', uploadPreset: 'viewstream', resourceType: type },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          setFormData(prev => ({ ...prev, [type === 'video' ? 'videoUrl' : 'thumbnail']: result.info.secure_url }));
        }
      }
    );
    widget.open();
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const finalData = {
      ...formData,
      genre: formData.genre.split(',').map(g => g.trim()).filter(g => g !== ""),
      cast: formData.castNames.split(',').map(name => ({
        name: name.trim(),
        image: `https://ui-avatars.com/api/?name=${name.trim()}&background=random&color=fff`
      })).filter(actor => actor.name !== ""),
      director: {
        name: formData.directorName,
        country: formData.directorCountry,
        image: `https://ui-avatars.com/api/?name=${formData.directorName}&background=000&color=fff`
      },
      music: {
        name: formData.musicName,
        country: formData.directorCountry,
        image: `https://ui-avatars.com/api/?name=${formData.musicName}&background=333&color=fff`
      }
    };

    try {
      await axios.post(`${API_URL}/api/movies/add`, finalData);
      
      alert("Movie published with Cast & Crew! 🎬");
      
      setFormData({ 
        title: '', description: '', thumbnail: '', videoUrl: '', 
        genre: '', releaseYear: 2026, duration: '', category: 'Movie',
        releaseDate: '', rating: 0, viewCount: '',
        castNames: '', directorName: '', directorCountry: 'India', musicName: ''
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Upload failed. Check console for details.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
          <Sparkles className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight">CREATE CONTENT</h1>
          <p className="text-gray-500 font-medium">Add movies with full cast and crew details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: BASIC INFO */}
        <div className="lg:col-span-2 space-y-6 bg-[#141414] p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Movie Title</label>
            <input required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all" 
              placeholder="e.g. Kantara" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Description</label>
            <textarea required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl h-32 resize-none outline-none focus:border-red-600 transition-all" 
              placeholder="Briefly describe the story..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          {/* NEW CAST & CREW SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 flex items-center gap-2">
                <Users size={12}/> Cast Members (Comma Separated)
              </label>
              <input required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all" 
                placeholder="Rishab Shetty, Sapthami Gowda, Kishore" value={formData.castNames} onChange={e => setFormData({...formData, castNames: e.target.value})} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <UserCheck size={12}/> Director
              </label>
              <input required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all" 
                placeholder="Name" value={formData.directorName} onChange={e => setFormData({...formData, directorName: e.target.value})} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <Music size={12}/> Music Composer
              </label>
              <input required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all" 
                placeholder="Name" value={formData.musicName} onChange={e => setFormData({...formData, musicName: e.target.value})} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS & UPLOADS */}
        <div className="space-y-6">
          <div className="bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Rating</label>
                <div className="relative">
                  <Star className="absolute left-4 top-4 text-gray-500" size={18} />
                  <input required type="number" step="0.1" className="bg-[#0A0A0A] border border-white/5 p-4 pl-12 rounded-2xl outline-none w-full focus:border-red-600 transition-all" 
                    value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Views</label>
                <div className="relative">
                  <BarChart3 className="absolute left-4 top-4 text-gray-500" size={18} />
                  <input required className="bg-[#0A0A0A] border border-white/5 p-4 pl-12 rounded-2xl outline-none w-full focus:border-red-600 transition-all" 
                    placeholder="20K" value={formData.viewCount} onChange={e => setFormData({...formData, viewCount: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Genres</label>
              <input required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all" 
                placeholder="Action, Drama" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
            </div>

            <div className="space-y-3">
              <button type="button" onClick={() => handleUpload('image')} className={`w-full p-4 rounded-2xl border flex items-center gap-3 transition-all ${formData.thumbnail ? 'border-green-500/50 bg-green-500/5 text-green-500' : 'border-white/5 bg-[#0A0A0A] text-gray-400'}`}>
                <ImageIcon size={18} /> {formData.thumbnail ? 'Thumbnail Linked' : 'Upload Poster'}
              </button>
              <button type="button" onClick={() => handleUpload('video')} className={`w-full p-4 rounded-2xl border flex items-center gap-3 transition-all ${formData.videoUrl ? 'border-green-500/50 bg-green-500/5 text-green-500' : 'border-white/5 bg-[#0A0A0A] text-gray-400'}`}>
                <Film size={18} /> {formData.videoUrl ? 'Video Linked' : 'Upload Movie File'}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-black py-5 rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95">
              {loading ? "PUBLISHING..." : "CONFIRM & PUBLISH"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;