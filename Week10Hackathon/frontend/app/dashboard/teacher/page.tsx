"use client";

import DashboardLayout from '@/src/components/DashboardLayout';
import {
  Sparkles,
  CheckCircle2,
  Upload,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import { useState } from 'react';
import axios from 'axios';

export default function TeacherDashboard() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [assignmentTitle, setAssignmentTitle] =
    useState('');

  const [requirements, setRequirements] =
    useState('');

  const [markingMode, setMarkingMode] =
    useState<'strict' | 'loose'>('loose');

  const [isUploading, setIsUploading] =
    useState(false);

  const [results, setResults] = useState<any[]>(
    [],
  );

  const [uploadStatus, setUploadStatus] =
    useState<{
      type: 'success' | 'error';
      msg: string;
    } | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      setSelectedFiles(
        Array.from(e.target.files),
      );

      setUploadStatus(null);
    }
  };

  const handleBatchUpload = async () => {
    if (
      selectedFiles.length === 0 ||
      !assignmentTitle.trim() ||
      !requirements.trim()
    ) {
      setUploadStatus({
        type: 'error',
        msg: 'Please fill all fields.',
      });

      return;
    }

    setIsUploading(true);

    setUploadStatus(null);

    const formData = new FormData();

    selectedFiles.forEach((file) =>
      formData.append('files', file),
    );

    const structuredPrompt = `
ASSIGNMENT TITLE:
${assignmentTitle}

REQUIREMENTS:
${requirements}

MODE:
${markingMode}
`;

    formData.append(
      'prompt',
      structuredPrompt,
    );

    formData.append(
      'assignmentTitle',
      assignmentTitle,
    );

    formData.append(
      'markingMode',
      markingMode,
    );

    try {
      const token =
        localStorage.getItem('token');

      const response = await axios.post(
        'https://assignmentbackend-eight.vercel.app/grader/upload-batch',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',

            Authorization: `Bearer ${token}`,
          },
        },
      );

      const normalized =
        response.data.map((r: any) => ({
          fileName: r.fileName,

          studentName:
            r.data?.studentName || 'Unknown',

          rollNumber:
            r.data?.rollNumber || 'Unknown',

          score: r.data?.score || 0,

          remarks:
            r.data?.remarks ||
            'No remarks provided',

          status: r.status,
        }));

      setResults(normalized);

      setUploadStatus({
        type: 'success',
        msg: `Successfully processed ${selectedFiles.length} assignments!`,
      });

      setSelectedFiles([]);

      setAssignmentTitle('');

      setRequirements('');
    } catch (error: any) {
      setUploadStatus({
        type: 'error',

        msg:
          error.response?.data?.message ||
          'Failed to process batch upload.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      role="teacher"
    >
      <div className="space-y-6">
        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-80">
              Total Graded
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {results.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Marking Mode
            </p>

            <h2 className="text-2xl font-bold mt-2 capitalize text-slate-800">
              {markingMode}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Uploaded Files
            </p>

            <h2 className="text-2xl font-bold mt-2 text-slate-800">
              {selectedFiles.length}
            </h2>
          </div>
        </div>

        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* HEADER */}
              <div className="p-6 border-b bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Sparkles className="text-indigo-600" />
                  </div>

                  <div>
                    <h2 className="font-bold text-xl text-slate-800">
                      AI Batch Grader
                    </h2>

                    <p className="text-sm text-slate-500">
                      Upload assignments and evaluate automatically
                    </p>
                  </div>
                </div>

                {/* MODE */}
                <div className="flex bg-slate-100 rounded-xl p-1 w-full md:w-fit">
                  <button
                    onClick={() =>
                      setMarkingMode('loose')
                    }
                    className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition ${
                      markingMode === 'loose'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    Loose
                  </button>

                  <button
                    onClick={() =>
                      setMarkingMode('strict')
                    }
                    className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition ${
                      markingMode === 'strict'
                        ? 'bg-white text-rose-600 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    Strict
                  </button>
                </div>
              </div>

              {/* FORM */}
              <div className="p-6 sm:p-8 space-y-5">
                {/* TITLE */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Assignment Title
                  </label>

                  <input
                    value={assignmentTitle}
                    onChange={(e) =>
                      setAssignmentTitle(
                        e.target.value,
                      )
                    }
                    placeholder="e.g. Python Calculator Lab"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* REQUIREMENTS */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Assignment Requirements
                  </label>

                  <textarea
                    value={requirements}
                    onChange={(e) =>
                      setRequirements(
                        e.target.value,
                      )
                    }
                    placeholder={`Example:
- Create a calculator function
- Support add and subtract
- Return values properly
- Handle invalid operations`}
                    rows={6}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 outline-none resize-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* FILE UPLOAD */}
                <div className="relative border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center hover:border-indigo-400 transition bg-slate-50">
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                      <Upload className="text-indigo-600" />
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg">
                      Upload PDF Assignments
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Drag and drop or click to browse
                    </p>

                    {selectedFiles.length > 0 && (
                      <div className="mt-5 flex flex-wrap justify-center gap-2">
                        {selectedFiles.map(
                          (file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-white border rounded-full px-3 py-2 text-sm"
                            >
                              <FileText
                                size={14}
                                className="text-indigo-600"
                              />

                              <span className="max-w-[140px] truncate">
                                {
                                  file.name
                                }
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={handleBatchUpload}
                  disabled={isUploading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl font-bold hover:opacity-95 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2
                        className="animate-spin"
                        size={18}
                      />
                      Grading Assignments...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Run Batch Analysis
                    </>
                  )}
                </button>

                {/* STATUS */}
                {uploadStatus && (
                  <div
                    className={`rounded-2xl p-4 flex items-center gap-3 ${
                      uploadStatus.type ===
                      'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    <AlertCircle size={18} />

                    <p className="text-sm font-medium">
                      {uploadStatus.msg}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-5">
            <div className="bg-white border rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">
                Quick Tips
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="p-4 rounded-2xl bg-slate-50">
                  Use clear assignment requirements for more accurate grading.
                </div>

                <div className="p-4 rounded-2xl bg-slate-50">
                  Strict mode gives harsher scores for incorrect answers.
                </div>

                <div className="p-4 rounded-2xl bg-slate-50">
                  Upload only PDF files for best results.
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-lg">
              <p className="text-sm text-slate-300">
                AI Evaluation Engine
              </p>

              <h3 className="text-2xl font-bold mt-2">
                Smart Assignment Review
              </h3>

              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Automatically evaluates submissions using AI-based relevance,
                accuracy, and requirement matching.
              </p>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">
                Evaluation Results
              </h3>
            </div>

            {/* MOBILE CARDS */}
            <div className="block lg:hidden p-4 space-y-4">
              {results.map((res, i) => (
                <div
                  key={i}
                  className="border rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {res.studentName}
                      </h4>

                      <p className="text-sm text-slate-500">
                        {res.rollNumber}
                      </p>
                    </div>

                    <span
                      className={`font-bold text-lg ${
                        res.score >= 50
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {res.score}/100
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs uppercase text-slate-400 font-semibold mb-1">
                      Remarks
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {res.remarks}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 size={16} />
                    {res.status}
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr className="text-left text-sm text-slate-500">
                    <th className="px-6 py-4">
                      Student
                    </th>

                    <th className="px-6 py-4">
                      Roll Number
                    </th>

                    <th className="px-6 py-4">
                      Score
                    </th>

                    <th className="px-6 py-4">
                      Remarks
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((res, i) => (
                    <tr
                      key={i}
                      className="border-t"
                    >
                      <td className="px-6 py-5 font-medium text-slate-800">
                        {res.studentName}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {res.rollNumber}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`font-bold text-lg ${
                            res.score >= 50
                              ? 'text-green-600'
                              : 'text-red-500'
                          }`}
                        >
                          {res.score}/100
                        </span>
                      </td>

                      <td className="px-6 py-5 max-w-md text-slate-600">
                        <div className="line-clamp-3 leading-relaxed">
                          {res.remarks}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {res.status ===
                        'Success' ? (
                          <div className="flex items-center gap-2 text-green-600 font-medium">
                            <CheckCircle2
                              size={18}
                            />
                            Success
                          </div>
                        ) : (
                          <span className="text-red-500 font-medium">
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}