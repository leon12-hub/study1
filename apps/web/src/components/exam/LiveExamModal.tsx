/**
 * HighStudy Live Exam Testing Engine Modal
 * Interactive examination module with real-time countdown, question navigation,
 * automated evaluation, and detailed pedagogical solutions.
 */

import React, { useState, useEffect } from 'react';
import { Examination, ExamAttempt } from '@highstudy/shared-types';
import { Clock, CheckCircle2, AlertCircle, X, ChevronRight, ChevronLeft, Award } from 'lucide-react';

interface LiveExamModalProps {
  exam: Examination;
  onClose: () => void;
  onComplete: (attempt: ExamAttempt) => void;
}

export const LiveExamModal: React.FC<LiveExamModalProps> = ({ exam, onClose, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(exam.durationMinutes * 60);
  const [submittedAttempt, setSubmittedAttempt] = useState<ExamAttempt | null>(null);

  // Countdown timer
  useEffect(() => {
    if (submittedAttempt) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submittedAttempt]);

  const questions = exam.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-center">
          <div className="text-sm font-bold text-slate-900 dark:text-white">{exam.title}</div>
          <p className="text-xs text-slate-500">This assessment does not contain any questions yet. Restore sample data or add questions in faculty portal.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submittedAttempt) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          studentId: 'stud-01',
          studentName: 'Aarav Sharma',
          answers: selectedAnswers,
        }),
      });

      if (res.ok) {
        const attemptRecord: ExamAttempt = await res.json();
        setSubmittedAttempt(attemptRecord);
        onComplete(attemptRecord);
        return;
      }
    } catch (err) {
      console.warn('Backend exam submission fallback to local evaluation:', err);
    }

    // Local evaluation fallback
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    exam.questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (!selected) {
        unattemptedCount++;
        return;
      }
      const correctOpt = q.options.find((opt) => opt.isCorrect);
      if (correctOpt && correctOpt.id === selected) {
        score += q.marks;
        correctCount++;
      } else {
        score -= q.negativeMarks;
        incorrectCount++;
      }
    });

    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
    const percentage = (score / exam.totalMarks) * 100;

    const attempt: ExamAttempt = {
      id: `attempt-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      studentId: 'stud-01',
      studentName: 'Aarav Sharma',
      startedAt: new Date(Date.now() - (exam.durationMinutes * 60 - secondsRemaining) * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      score: Math.max(0, score),
      totalMarks: exam.totalMarks,
      percentage: Math.max(0, parseFloat(percentage.toFixed(1))),
      accuracy: parseFloat(accuracy.toFixed(1)),
      correctAnswersCount: correctCount,
      incorrectAnswersCount: incorrectCount,
      unattemptedCount: unattemptedCount,
      rank: 2,
      totalParticipants: 46,
      answers: Object.entries(selectedAnswers).map(([qId, optId]) => ({
        questionId: qId,
        selectedOptionId: optId,
        isCorrect: exam.questions.find((q) => q.id === qId)?.options.find((o) => o.id === optId)?.isCorrect || false,
        timeSpentSeconds: 45,
      })),
    };

    setSubmittedAttempt(attempt);
    onComplete(attempt);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{exam.title}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{exam.courseName}</span>
              <span aria-hidden="true">·</span>
              <span>{exam.totalQuestions} Questions</span>
              <span aria-hidden="true">·</span>
              <span>{exam.totalMarks} Marks</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!submittedAttempt && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-amber-700 dark:text-amber-300 font-mono text-xs font-semibold tabular-nums">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area */}
        {!submittedAttempt ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Question Progress Tracker */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
              {exam.questions.map((q, idx) => {
                const isAnswered = !!selectedAnswers[q.id];
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors shrink-0 tabular-nums ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isAnswered
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Current Question */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Question {currentQuestionIndex + 1} of {exam.questions.length} · Subject: {currentQuestion.subjectName}
                </span>
                <span className="font-mono tabular-nums">
                  +{currentQuestion.marks} Marks / -{currentQuestion.negativeMarks} Negative
                </span>
              </div>

              <div className="text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                {currentQuestion.questionText}
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left text-sm transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="leading-normal">{option.optionText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Result Summary & Pedagogical Review */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-6 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Assessment Evaluated!</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Instant automated marks breakdown &amp; diagnostic accuracy analysis
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                    {submittedAttempt.score} / {submittedAttempt.totalMarks}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Score Obtained</div>
                </div>
                <div>
                  <div className="text-xl font-black text-emerald-600 font-mono tabular-nums">
                    {submittedAttempt.accuracy}%
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Accuracy</div>
                </div>
                <div>
                  <div className="text-xl font-black text-blue-600 font-mono tabular-nums">
                    Rank #{submittedAttempt.rank}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Cohort Standing</div>
                </div>
              </div>
            </div>

            {/* Answer Solutions Analysis */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Detailed Solutions &amp; Concepts</h4>
              {exam.questions.map((q, idx) => {
                const userChoiceId = selectedAnswers[q.id];
                const correctOpt = q.options.find((o) => o.isCorrect);
                const isUserCorrect = userChoiceId === correctOpt?.id;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Q{idx + 1}. {q.questionText}
                      </span>
                      {isUserCorrect ? (
                        <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{q.marks})
                        </span>
                      ) : userChoiceId ? (
                        <span className="text-xs text-red-600 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" /> Incorrect (-{q.negativeMarks})
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Unattempted (0)</span>
                      )}
                    </div>

                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium pt-1">
                      Correct Answer: {correctOpt?.optionText}
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                      <strong className="text-slate-900 dark:text-white">Concept Explanation: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          {!submittedAttempt ? (
            <>
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-3">
                {currentQuestionIndex < exam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 rounded-lg hover:opacity-90"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                  >
                    Submit Assessment
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 rounded-lg"
              >
                Close &amp; Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
