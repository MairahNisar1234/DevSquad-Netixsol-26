import React, { useState } from 'react';
import axios from 'axios';
import { 
  Tv, Image as ImageIcon, Star, Calendar, 
  BarChart3, Users, UserCheck, Music, ListOrdered, Camera
} from 'lucide-react';

const AddShow: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '', 
    genre: '',
    releaseYear: 2026,
    seasons: '', 
    category: 'Show',
    releaseDate: '', 
    rating: 0,
    viewCount: '', 
    castNames: '', 
    castImages: [] as string[], 
    directorName: '',
    directorCountry: 'India',
    musicName: ''
  });

  const handleUpload = (type: 'image' | 'video' | 'cast') => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      { cloudName: 'dru7ig67d', uploadPreset: 'viewstream', resourceType: type === 'video' ? 'video' : 'image' },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          if (type === 'cast') {
            setFormData(prev => ({ ...prev, castImages: [...prev.castImages, result.info.secure_url] }));
          } else {
            setFormData(prev => ({ ...prev, [type === 'video' ? 'videoUrl' : 'thumbnail']: result.info.secure_url }));
          }
        }
      }
    );
    widget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Grab your live Vercel URL from .env
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const castArray = formData.castNames.split(',').map((name, index) => ({
      name: name.trim(),
      image: formData.castImages[index] || `https://ui-avatars.com/api/?name=${name.trim()}&background=random&color=fff`
    })).filter(actor => actor.name !== "");

    const finalData = {
      ...formData,
      viewCount: Number(formData.viewCount),
      seasons: Number(formData.seasons),
      genre: formData.genre.split(',').map(g => g.trim()).filter(g => g !== ""),
      cast: castArray,
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
      await axios.post(`${API_URL}/api/shows`, finalData);
      
      alert("TV Show Published! 📺");

      setFormData({
        title: '', description: '', thumbnail: '', videoUrl: '', 
        genre: '', releaseYear: 2026, seasons: '', category: 'Show',
        releaseDate: '', rating: 0, viewCount: '', 
        castNames: '', castImages: [], // Reset images for new entry
        directorName: '', directorCountry: 'India', musicName: ''
      });
      
    } catch (err: any) {
      console.error("Show upload failed:", err);
      alert(err.response?.data?.message || "Show upload failed. Check the live backend logs.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
          <Tv className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">ADD NEW SHOW</h1>
          <p className="text-gray-500 font-medium">Create a series entry for the StreamVibe library.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-6 bg-[#141414] p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Series Title</label>
            <input required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all text-white" 
              placeholder="e.g. Stranger Things" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Series Description</label>
            <textarea required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl h-32 resize-none outline-none focus:border-red-600 transition-all text-white" 
              placeholder="What is this show about?" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="pt-4 border-t border-white/5 space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 flex items-center gap-2">
              <Users size={12}/> Leading Cast & Photos
            </label>
            <div className="flex gap-4">
              <input required className="flex-1 bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 text-white" 
                placeholder="Name 1, Name 2..." value={formData.castNames} onChange={e => setFormData({...formData, castNames: e.target.value})} />
              <button type="button" onClick={() => handleUpload('cast')} className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors text-gray-400 flex items-center gap-2 text-xs font-bold">
                <Camera size={16}/> {formData.castImages.length} Photos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <UserCheck size={12}/> Showrunner / Director
              </label>
              <input required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all text-white" 
                placeholder="Name" value={formData.directorName} onChange={e => setFormData({...formData, directorName: e.target.value})} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <Music size={12}/> Soundtrack Artist
              </label>
              <input required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all text-white" 
                placeholder="Name" value={formData.musicName} onChange={e => setFormData({...formData, musicName: e.target.value})} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REFINED SIDE INFO LIST */}
        <div className="space-y-6">
          <div className="bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-6">
            
            {/* Release Date */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Release Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input required type="date" className="bg-[#0A0A0A] border border-white/5 p-4 pl-12 rounded-2xl outline-none w-full focus:border-red-600 text-white text-xs h-[56px]" 
                  value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
              </div>
            </div>

            {/* Views */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Initial Views</label>
              <div className="relative">
                <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input required className="bg-[#0A0A0A] border border-white/5 p-4 pl-12 rounded-2xl outline-none w-full focus:border-red-600 text-white h-[56px]" 
                  placeholder="e.g. 2500" value={formData.viewCount} onChange={e => setFormData({...formData, viewCount: e.target.value})} />
              </div>
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">IMDb Rating</label>
              <div className="relative">
                <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input required type="number" step="0.1" className="bg-[#0A0A0A] border border-white/5 p-4 pl-12 rounded-2xl outline-none w-full focus:border-red-600 text-white h-[56px]" 
                  value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
              </div>
            </div>

            {/* Seasons */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Seasons Count</label>
              <div className="relative">
                <ListOrdered className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input required type="number" className="bg-[#0A0A0A] border border-white/5 p-4 pl-12 rounded-2xl outline-none w-full focus:border-red-600 text-white h-[56px]" 
                  placeholder="1" value={formData.seasons} onChange={e => setFormData({...formData, seasons: e.target.value})} />
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Genres</label>
              <input required className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl outline-none focus:border-red-600 transition-all text-white h-[56px]" 
                placeholder="Action, Thriller" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
            </div>

            {/* Upload Buttons */}
            <div className="space-y-3 pt-2">
              <button type="button" onClick={() => handleUpload('image')} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${formData.thumbnail ? 'border-green-500/50 bg-green-500/5 text-green-500' : 'border-white/5 bg-[#0A0A0A] text-gray-400'}`}>
                <div className="flex items-center gap-3"><ImageIcon size={18} /> <span className="text-xs font-bold">Poster</span></div>
                {formData.thumbnail && <span className="text-[10px] bg-green-500/20 px-2 py-1 rounded">Linked</span>}
              </button>
              <button type="button" onClick={() => handleUpload('video')} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${formData.videoUrl ? 'border-green-500/50 bg-green-500/5 text-green-500' : 'border-white/5 bg-[#0A0A0A] text-gray-400'}`}>
                <div className="flex items-center gap-3"><Tv size={18} /> <span className="text-xs font-bold">Pilot</span></div>
                {formData.videoUrl && <span className="text-[10px] bg-green-500/20 px-2 py-1 rounded">Linked</span>}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-black py-5 rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95 mt-2">
              {loading ? "SAVING..." : "PUBLISH SHOW"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddShow;