/**
 * Upload Study Material & VOD Modal
 * Allows faculty to upload chapter notes, video lecture URLs, and formula sheets
 */

import React, { useState } from 'react';
import { X, Upload, BookOpen } from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName?: string;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({ isOpen, onClose, teacherName }) => {
  const { subjects, chapters, batches, addStudyMaterial } = useHighStudy();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: subjects[0]?.id || '',
    chapterName: 'Rotational Dynamics',
    type: 'PDF_NOTE' as 'PDF_NOTE' | 'VIDEO_LECTURE' | 'FORMULA_SHEET' | 'PRACTICE_SET',
    fileUrl: 'https://cdn.highstudy.edu/materials/chapter-notes.pdf',
    durationMinutes: 60,
    fileSizeBytes: 4200000,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const selectedSubj = subjects.find((s) => s.id === formData.subjectId) || subjects[0];
    const selectedChap = chapters.find((c) => c.name === formData.chapterName) || chapters[0];

    addStudyMaterial({
      title: formData.title.trim(),
      description: formData.description.trim() || 'Comprehensive study resource with derivations and practice problems.',
      subjectId: selectedSubj?.id || '',
      subjectName: selectedSubj?.name || 'Curriculum Subject',
      chapterId: selectedChap?.id || '',
      chapterName: formData.chapterName || selectedChap?.name || 'General',
      batchIds: batches.map((b) => b.id),
      type: formData.type,
      fileUrl: formData.fileUrl,
      durationMinutes: formData.type === 'VIDEO_LECTURE' ? Number(formData.durationMinutes) : undefined,
      fileSizeBytes: formData.type !== 'VIDEO_LECTURE' ? Number(formData.fileSizeBytes) : undefined,
      uploaderTeacherName: teacherName || 'Academic Faculty',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Publish Study Material or VOD</h3>
              <p className="text-[11px] text-slate-500">Resource will instantly sync to all enrolled student portals</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">Document / Lecture Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rigid Body Equilibrium & Moment of Inertia Notes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Subject</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Resource Format</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="PDF_NOTE">PDF Master Notes</option>
                <option value="VIDEO_LECTURE">Recorded 4K Video Lecture</option>
                <option value="FORMULA_SHEET">High-Yield Formula Sheet</option>
                <option value="PRACTICE_SET">Chapter Practice Set</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Chapter Title</label>
              <input
                type="text"
                placeholder="e.g. Rotational Motion"
                value={formData.chapterName}
                onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">
                {formData.type === 'VIDEO_LECTURE' ? 'Video Duration (Minutes)' : 'File Size (Bytes)'}
              </label>
              <input
                type="number"
                value={formData.type === 'VIDEO_LECTURE' ? formData.durationMinutes : formData.fileSizeBytes}
                onChange={(e) =>
                  formData.type === 'VIDEO_LECTURE'
                    ? setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 60 })
                    : setFormData({ ...formData, fileSizeBytes: parseInt(e.target.value) || 2000000 })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Resource URL / CDN Link</label>
            <input
              type="text"
              placeholder="https://cdn.highstudy.edu/..."
              value={formData.fileUrl}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Pedagogical Summary &amp; Key Highlights</label>
            <textarea
              rows={2}
              placeholder="Explain derivations, key laws covered, and homework exercises included..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              Publish to Students
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
