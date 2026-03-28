import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Film, Search, ExternalLink } from 'lucide-react';

const ManageMovies: React.FC = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Define the Backend URL from your .env
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchMovies = async () => {
    try {
      // 2. Use the dynamic API_URL
      const res = await axios.get(`${API_URL}/api/movies`);
      setMovies(res.data);
    } catch (err) { 
      console.error("Fetch failed:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchMovies(); 
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanent removal: Are you sure?")) {
      try {
        // 3. Use the dynamic API_URL for deletion
        await axios.delete(`${API_URL}/api/movies/${id}`);
        setMovies(movies.filter((m: any) => m._id !== id));
      } catch (err) { 
        alert("Delete failed. Check if the backend is live."); 
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40 space-y-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">Scanning Database...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">Catalog Manage</h1>
          <p className="text-gray-500 font-medium">Review, edit, or remove content from the library.</p>
        </div>
        <div className="bg-[#141414] px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3 text-xs font-black text-gray-400">
           <Film size={14} className="text-red-600"/>
           TOTAL ASSETS: <span className="text-white text-lg ml-1">{movies.length}</span>
        </div>
      </div>

      <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="p-6">Feature</th>
                <th className="p-6">Release</th>
                <th className="p-6">Genre</th>
                <th className="p-6 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {movies.map((movie: any) => (
                <tr key={movie._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative group/thumb">
                        <img 
                          src={movie.thumbnail} 
                          alt={movie.title}
                          className="w-24 h-14 object-cover rounded-xl shadow-lg border border-white/10 group-hover/thumb:scale-105 transition-transform" 
                        />
                      </div>
                      <span className="font-bold text-lg text-white">{movie.title}</span>
                    </div>
                  </td>
                  <td className="p-6 font-medium text-gray-400 font-mono italic">{movie.releaseYear}</td>
                  <td className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {movie.genre?.slice(0, 2).map((g: string) => (
                        <span key={g} className="text-[9px] px-2 py-1 bg-white/5 rounded-md border border-white/5 uppercase font-black text-gray-400">{g}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="p-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 hover:text-white transition-all border border-white/5">
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(movie._id)} 
                        className="p-3 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-600/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {movies.length === 0 && (
          <div className="p-20 text-center text-gray-600 font-bold uppercase tracking-widest text-sm">
            No assets found in the cloud.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMovies;