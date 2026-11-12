/**
 * Examinations Controller
 * Handles test retrieval, test submission, scoring, and performance analysis
 */

import { Request, Response } from 'express';
import { INITIAL_EXAMINATION } from '@/src/data/mockDatabase';
import { ExamAttempt, Question, QuestionOption } from '@highstudy/shared-types';

export class ExamsController {
  public static getExams(_req: Request, res: Response): void {
    res.status(200).json([INITIAL_EXAMINATION]);
  }

  public static getExamById(req: Request, res: Response): void {
    const { examId } = req.params;
    if (INITIAL_EXAMINATION.id === examId) {
      res.status(200).json(INITIAL_EXAMINATION);
      return;
    }
    res.status(404).json({ error: 'Exam not found' });
  }

  public static submitExam(req: Request, res: Response): void {
    const { answers, studentId, studentName } = req.body;
    const questions = INITIAL_EXAMINATION.questions;

    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    questions.forEach((q: Question) => {
      const selected = answers?.[q.id];
      if (!selected) {
        unattemptedCount++;
        return;
      }
      const correctOpt = q.options.find((opt: QuestionOption) => opt.isCorrect);
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
    const percentage = (score / INITIAL_EXAMINATION.totalMarks) * 100;

    const attemptRecord: ExamAttempt = {
      id: `attempt-${Date.now()}`,
      examId: INITIAL_EXAMINATION.id,
      examTitle: INITIAL_EXAMINATION.title,
      studentId: studentId || 'stud-001',
      studentName: studentName || 'Aarav Sharma',
      startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
      submittedAt: new Date().toISOString(),
      score: Math.max(0, score),
      totalMarks: INITIAL_EXAMINATION.totalMarks,
      percentage: Math.max(0, parseFloat(percentage.toFixed(1))),
      accuracy: parseFloat(accuracy.toFixed(1)),
      correctAnswersCount: correctCount,
      incorrectAnswersCount: incorrectCount,
      unattemptedCount: unattemptedCount,
      rank: 4,
      totalParticipants: 46,
      answers: Object.entries(answers || {}).map(([qId, optId]) => ({
        questionId: qId,
        selectedOptionId: optId as string,
        isCorrect: questions.find((q: Question) => q.id === qId)?.options.find((o: QuestionOption) => o.id === optId)?.isCorrect || false,
        timeSpentSeconds: 45,
      })),
    };

    res.status(200).json(attemptRecord);
  }
}
