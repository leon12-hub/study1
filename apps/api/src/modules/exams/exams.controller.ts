/**
 * Examinations Controller
 * Handles test retrieval, test submission, scoring, and performance analysis
 */

import { Request, Response } from 'express';
import { db } from '@/src/db/index.ts';
import * as schema from '@/src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { ExamAttempt } from '@highstudy/shared-types';

export class ExamsController {
  public static async getExams(_req: Request, res: Response): Promise<void> {
    try {
      const examsList = await db.select().from(schema.examinations);
      const questionsList = await db.select().from(schema.examQuestions);

      const detailed = examsList.map((ex: any) => ({
        ...ex,
        batchNames: (ex.batchNames as any) || [],
        questions: questionsList
          .filter((q: any) => q.examId === ex.id)
          .map((q: any) => ({
            ...q,
            options: (q.optionsJson as any) || [],
          })),
      }));

      res.status(200).json(detailed);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch exams' });
    }
  }

  public static async getExamById(req: Request, res: Response): Promise<void> {
    const { examId } = req.params;
    try {
      const records = await db.select().from(schema.examinations).where(eq(schema.examinations.id, examId)).limit(1);
      const exam = records[0];
      if (!exam) {
        res.status(404).json({ error: 'Exam not found' });
        return;
      }
      const questions = await db.select().from(schema.examQuestions).where(eq(schema.examQuestions.examId, examId));
      res.status(200).json({
        ...exam,
        batchNames: (exam.batchNames as any) || [],
        questions: questions.map((q: any) => ({
          ...q,
          options: (q.optionsJson as any) || [],
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch exam details' });
    }
  }

  public static async submitExam(req: Request, res: Response): Promise<void> {
    const { answers, studentId, studentName, examId } = req.body;
    try {
      const targetExamId = examId || 'exam-01';
      const questions = await db.select().from(schema.examQuestions).where(eq(schema.examQuestions.examId, targetExamId));
      const examRecords = await db.select().from(schema.examinations).where(eq(schema.examinations.id, targetExamId)).limit(1);
      const examRecord = examRecords[0];

      let score = 0;
      let correctCount = 0;
      let incorrectCount = 0;
      let unattemptedCount = 0;

      questions.forEach((q: any) => {
        const selected = answers?.[q.id];
        if (!selected) {
          unattemptedCount++;
          return;
        }
        const opts = (q.optionsJson as any[]) || [];
        const correctOpt = opts.find((opt) => opt.isCorrect);
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
      const totalMarks = examRecord ? examRecord.totalMarks : 16;
      const percentage = (Math.max(0, score) / totalMarks) * 100;

      const created = await db.insert(schema.examAttempts).values({
        id: `attempt-${Date.now()}`,
        examId: targetExamId,
        examTitle: examRecord?.title || 'Examination Test',
        studentId: studentId || 'stud-01',
        studentName: studentName || 'Aarav Sharma',
        startedAt: new Date(Date.now() - 40 * 60000).toISOString(),
        submittedAt: new Date().toISOString(),
        score: Math.max(0, score),
        totalMarks,
        percentage: Math.max(0, parseFloat(percentage.toFixed(1))),
        rank: 2,
        accuracy: parseFloat(accuracy.toFixed(1)),
        correctAnswersCount: correctCount,
        incorrectAnswersCount: incorrectCount,
        unattemptedCount,
        answersJson: answers || {},
      }).returning();

      res.status(201).json(created[0]);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to evaluate exam' });
    }
  }
}
