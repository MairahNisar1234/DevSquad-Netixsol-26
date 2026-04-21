"use client";
import React, { useState } from 'react';
import { Users, Clock, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RestaurantFloorPage() {
  const [selectedTable, setSelectedTable] = useState<any>(null);

  const tables = [
    { id: 'T1', capacity: 2, status: 'occupied', customer: 'Mairah', time: '45m', total: 45.00 },
    { id: 'T2', capacity: 2, status: 'available', customer: null, time: null, total: 0 },
    { id: 'T3', capacity: 4, status: 'occupied', customer: 'Guest', time: '12m', total: 82.50 },
    { id: 'T4', capacity: 4, status: 'dirty', customer: null, time: '5m', total: 0 },
    { id: 'T5', capacity: 6, status: 'reserved', customer: 'Family Event', time: '19:00', total: 0 },
    { id: 'T6', capacity: 2, status: 'occupied', customer: 'John D.', time: '30m', total: 22.00 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-screen lg:h-[calc(100vh-120px)] p-4 sm:p-0">
      
      {/* --- LEFT: TABLE GRID (THE RESTAURANT FLOOR) --- */}
      <div className="flex-[2] bg-[#1F1D2B] rounded-3xl p-4 sm:p-8 border border-gray-800 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Main Dining Room</h2>
            <p className="text-gray-500 text-sm">Click a table to view details</p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4">
             <Legend item="Available" color="bg-gray-700" />
             <Legend item="Occupied" color="bg-[#EA7C69]" />
             <Legend item="Dirty" color="bg-yellow-500" />
          </div>
        </div>

        {/* The Floor Plan Grid - Responsive Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
          {tables.map((table) => (
            <button 
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`
                relative h-28 sm:h-32 rounded-3xl transition-all flex flex-col items-center justify-center border-2 active:scale-95
                ${table.status === 'occupied' ? 'bg-[#EA7C69]/10 border-[#EA7C69] text-[#EA7C69]' : ''}
                ${table.status === 'available' ? 'bg-[#252836] border-gray-700 text-gray-400 hover:border-gray-500' : ''}
                ${table.status === 'dirty' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : ''}
                ${table.status === 'reserved' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : ''}
                ${selectedTable?.id === table.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1F1D2B]' : ''}
              `}
            >
              <span className="text-xs font-bold absolute top-3 left-4">{table.id}</span>
              <Users size={20} className="mb-1 sm:size-6" />
              <span className="text-xs sm:text-sm font-bold">{table.capacity} Seats</span>
              {table.status === 'occupied' && (
                <span className="mt-1 text-[9px] sm:text-[10px] bg-[#EA7C69] text-white px-2 py-0.5 rounded-full">
                  {table.time}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* --- RIGHT: TABLE DETAIL SIDEBAR --- */}
      <div className="flex-1 space-y-6 mb-20 lg:mb-0">
        {selectedTable ? (
          <div className="bg-[#1F1D2B] rounded-3xl p-6 border border-gray-800 h-full animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">Table {selectedTable.id} Details</h3>
                <button onClick={() => setSelectedTable(null)} className="lg:hidden text-gray-500">
                    <AlertCircle size={20} />
                </button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <DetailRow label="Current Status" value={selectedTable.status} capitalize />
              <DetailRow label="Customer" value={selectedTable.customer || 'No active guest'} />
              <DetailRow label="Time Seated" value={selectedTable.time || '--'} />
              
              <div className="pt-4 sm:pt-6 border-t border-gray-800">
                <p className="text-gray-500 text-xs sm:text-sm mb-1">Current Total</p>
                <p className="text-2xl sm:text-3xl font-black text-[#EA7C69]">${selectedTable.total.toFixed(2)}</p>
              </div>

              <div className="space-y-3 pt-4 sm:pt-6">
                <button className="w-full py-3 sm:py-4 bg-[#EA7C69] text-white rounded-2xl font-bold hover:bg-[#EA7C69]/90 transition-all active:scale-95">
                  Manage Order
                </button>
                <button 
                  onClick={() => setSelectedTable(null)}
                  className="w-full py-3 sm:py-4 bg-gray-800 text-gray-400 rounded-2xl font-bold hover:bg-gray-700 transition-all active:scale-95"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1F1D2B] rounded-3xl p-10 border border-gray-800 h-full flex flex-col items-center justify-center text-center opacity-50 hidden lg:flex">
            <Utensils size={48} className="text-gray-700 mb-4" />
            <p className="text-gray-500">Select a table from the floor plan to view its status.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Legend({ item, color }: { item: string, color: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 font-medium">
      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${color}`} />
      {item}
    </div>
  );
}

function DetailRow({ label, value, capitalize = false }: any) {
  return (
    <div>
      <p className="text-gray-500 text-[10px] sm:text-xs uppercase font-bold tracking-widest">{label}</p>
      <p className={`text-white text-sm sm:text-base font-medium mt-1 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}