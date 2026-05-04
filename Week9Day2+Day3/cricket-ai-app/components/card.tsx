// components/chat/PlayerCard.tsx
import React from 'react';
import { User, MapPin, Calendar, Activity } from 'lucide-react';

interface Player {
  full_name: string;
  role: string;
  country: string;
  dob: string;
  batting_style: string;
  bowling_style: string;
  is_active: string;
}

export const PlayerCard = ({ player }: { player: Player }) => {
  return (
    <div className="my-4 max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all hover:shadow-lg">
      {/* Header with Role Badge */}
      <div className="bg-emerald-600 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{player.full_name}</h3>
          <span className="rounded-full bg-emerald-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {player.role}
          </span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-px bg-slate-100 p-4">
        <div className="bg-white p-3">
          <p className="flex items-center gap-1 text-[10px] uppercase text-slate-400">
            <MapPin size={12} /> Country
          </p>
          <p className="text-sm font-semibold text-slate-800">{player.country}</p>
        </div>
        <div className="bg-white p-3">
          <p className="flex items-center gap-1 text-[10px] uppercase text-slate-400">
            <Calendar size={12} /> Born
          </p>
          <p className="text-sm font-semibold text-slate-800">{player.dob}</p>
        </div>
        <div className="bg-white p-3">
          <p className="flex items-center gap-1 text-[10px] uppercase text-slate-400">
            <Activity size={12} /> Batting
          </p>
          <p className="text-xs text-slate-700">{player.batting_style || 'N/A'}</p>
        </div>
        <div className="bg-white p-3">
          <p className="flex items-center gap-1 text-[10px] uppercase text-slate-400">
            <Activity size={12} /> Bowling
          </p>
          <p className="text-xs text-slate-700">{player.bowling_style || 'N/A'}</p>
        </div>
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-center border-t border-slate-50 bg-slate-50 py-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${player.is_active === 'True' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">
            {player.is_active === 'True' ? 'Currently Active' : 'Retired'}
          </span>
        </div>
      </div>
    </div>
  );
};