import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const Watch: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Error loading video", err);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie) return <div className="bg-black h-screen text-white p-10">Loading Player...</div>;

  return (
    <div className="h-screen w-screen bg-black flex flex-col">
      {/* Back Button Overlay */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-10 left-10 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white"
      >
        <ArrowLeft size={30} />
      </button>

      {/* THE PLAYER */}
      <video 
        className="w-full h-full object-contain"
        controls 
        autoPlay
        poster={movie.thumbnail}
      >
        <source src={movie.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Info Overlay (Optional) */}
      <div className="absolute bottom-10 left-10 text-white pointer-events-none">
        <h1 className="text-4xl font-black">{movie.title}</h1>
        <p className="text-gray-400">{movie.description}</p>
      </div>
    </div>
  );
};

export default Watch;