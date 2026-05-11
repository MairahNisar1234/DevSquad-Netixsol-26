"use client";

import { useEffect, useState } from 'react';

import axios from 'axios';

import DashboardLayout from '@/src/components/DashboardLayout';

import {
  ChevronDown,
  ChevronUp,
  FileText,
  CalendarDays,
  BadgeCheck,
} from 'lucide-react';

interface Submission {
  _id: string;
  assignmentTitle: string;
  studentName: string;
  rollNumber: string;
  score: number;
  remarks: string;
  markingMode: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [submissions, setSubmissions] =
    useState<Submission[]>([]);

  const [loading, setLoading] =
    useState(true);

  /**
   * 🔥 Track expanded remarks
   */
  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token =
        localStorage.getItem('token');

      const response = await axios.get(
        'https://assignmentbackend-eight.vercel.app/grader/history',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSubmissions(response.data);
    } catch (error) {
      console.error(
        'Failed to load history',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Grading History"
      role="teacher"
    >
      <div className="space-y-6">
        {/* HEADER CARD */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">
                Assignment History
              </h2>

              <p className="text-indigo-100 mt-2">
                View all previously graded
                submissions
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-4 w-fit">
              <p className="text-sm text-indigo-100">
                Total Records
              </p>

              <h3 className="text-3xl font-black">
                {submissions.length}
              </h3>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 shadow-sm border border-slate-200 text-center">
            <div className="animate-pulse text-slate-500">
              Loading grading history...
            </div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 shadow-sm border border-slate-200 text-center">
            <FileText
              size={50}
              className="mx-auto text-slate-300 mb-4"
            />

            <h3 className="text-xl font-bold text-slate-700">
              No History Found
            </h3>

            <p className="text-slate-500 mt-2">
              Graded assignments will appear
              here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {submissions.map(
              (submission) => {
                const expanded =
                  expandedId ===
                  submission._id;

                return (
                  <div
                    key={submission._id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                    {/* TOP */}
                    <div className="p-5 md:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                        {/* LEFT */}
                        <div className="space-y-4 flex-1 min-w-0">
                          <div>
                            <h3 className="text-xl font-black text-slate-800 break-words">
                              {
                                submission.assignmentTitle
                              }
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-sm font-semibold">
                                {
                                  submission.studentName
                                }
                              </span>

                              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl text-sm">
                                {
                                  submission.rollNumber
                                }
                              </span>

                              <span
                                className={`px-3 py-1 rounded-xl text-sm font-bold ${
                                  submission.markingMode ===
                                  'strict'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-indigo-100 text-indigo-600'
                                }`}
                              >
                                {
                                  submission.markingMode
                                }
                              </span>
                            </div>
                          </div>

                          {/* DATE */}
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays
                              size={16}
                            />

                            {new Date(
                              submission.createdAt,
                            ).toLocaleString()}
                          </div>
                        </div>

                        {/* SCORE */}
                        <div className="flex flex-col items-start lg:items-end gap-3">
                          <div
                            className={`
                            px-6 py-4 rounded-2xl text-center min-w-[120px]
                            
                            ${
                              submission.score >=
                              70
                                ? 'bg-green-50'
                                : submission.score >=
                                  50
                                ? 'bg-yellow-50'
                                : 'bg-red-50'
                            }
                          `}
                          >
                            <p className="text-sm text-slate-500">
                              Score
                            </p>

                            <h2
                              className={`text-3xl font-black ${
                                submission.score >=
                                70
                                  ? 'text-green-600'
                                  : submission.score >=
                                    50
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {submission.score}
                            </h2>

                            <p className="text-xs text-slate-500">
                              out of 100
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                            <BadgeCheck
                              size={16}
                            />
                            Evaluated
                          </div>
                        </div>
                      </div>

                      {/* REMARKS */}
                      <div className="mt-6 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                        <button
                          onClick={() =>
                            setExpandedId(
                              expanded
                                ? null
                                : submission._id,
                            )
                          }
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-100 transition"
                        >
                          <div>
                            <h4 className="font-bold text-slate-700">
                              AI Remarks
                            </h4>

                            <p className="text-sm text-slate-500">
                              Click to view
                              feedback
                            </p>
                          </div>

                          {expanded ? (
                            <ChevronUp
                              size={20}
                              className="text-slate-500"
                            />
                          ) : (
                            <ChevronDown
                              size={20}
                              className="text-slate-500"
                            />
                          )}
                        </button>

                        {expanded && (
                          <div className="px-5 pb-5 border-t border-slate-200">
                            <p className="text-slate-700 leading-relaxed pt-4 break-words">
                              {
                                submission.remarks
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}