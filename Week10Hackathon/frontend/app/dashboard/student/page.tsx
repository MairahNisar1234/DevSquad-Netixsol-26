"use client";
import { useState } from 'react';
import DashboardLayout from '@/src/components/DashboardLayout';
import { Award, BookOpen, Upload, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function StudentDashboard() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('files', file);
    formData.append('prompt', "Please analyze my assignment and provide feedback.");

    try {
      // Replace with your actual JWT token logic (e.g., from localStorage or Cookies)
      const token = localStorage.getItem('token'); 

      const response = await axios.post('https://assignmentbackend-eight.vercel.app/grader/upload-batch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });

      console.log('Upload Success:', response.data);
      setMessage('Assignment uploaded and analyzed successfully!');
    } catch (error: any) {
      console.error('Upload Error:', error);
      setMessage(error.response?.data?.message || 'Failed to upload assignment.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout title="Student Dashboard" role="student">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="opacity-90">You have 2 new graded assignments to review.</p>
          </div>
          <Award className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20" size={120} />
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-200 mb-8 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-4">
            {uploading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Upload New Assignment</h3>
          <p className="text-sm text-slate-500 mb-4">PDF files only (Max 10MB)</p>
          
          <label className={`px-6 py-2 rounded-lg font-semibold cursor-pointer transition ${uploading ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
            {uploading ? 'Processing...' : 'Select PDF'}
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf" 
              disabled={uploading}
              onChange={handleFileUpload} 
            />
          </label>
          
          {message && (
            <p className={`mt-4 text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Submissions</h3>
        <div className="space-y-4">
          {[
            { name: 'Data Structures Quiz', date: 'Oct 24', score: '85/100', status: 'Graded' },
            { name: 'AI Ethics Essay', date: 'Oct 22', score: '92/100', status: 'Graded' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><BookOpen size={20} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <p className="text-xs text-slate-500">Submitted on {item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-indigo-600">{item.score}</span>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}