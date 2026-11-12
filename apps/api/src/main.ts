/**
 * HighStudy Modular Backend API
 * Serves all REST endpoints for Web & Mobile applications
 */

import express, { Request, Response } from 'express';
import { AuthController } from './modules/auth/auth.controller.ts';
import { BranchesController } from './modules/branches/branches.controller.ts';
import { StudentsController } from './modules/students/students.controller.ts';
import { ExamsController } from './modules/exams/exams.controller.ts';
import { AiController } from './modules/ai/ai.controller.ts';
import {
  INITIAL_BATCHES,
  INITIAL_COURSES,
  INITIAL_SUBJECTS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ACTIVITY_LOGS,
} from '@/src/data/mockDatabase';

export function configureApiRoutes(app: express.Express): void {
  // Health & Information
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'UP',
      service: 'HighStudy Central Institute API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Auth & RBAC
  app.post('/api/auth/login', AuthController.login);
  app.get('/api/auth/profile', AuthController.getProfile);

  // Branches
  app.get('/api/branches', BranchesController.getAllBranches);
  app.get('/api/branches/:branchId', BranchesController.getBranchById);

  // Courses, Subjects & Batches
  app.get('/api/courses', (_req: Request, res: Response) => res.json(INITIAL_COURSES));
  app.get('/api/subjects', (_req: Request, res: Response) => res.json(INITIAL_SUBJECTS));
  app.get('/api/batches', (_req: Request, res: Response) => res.json(INITIAL_BATCHES));

  // Students & Academics
  app.get('/api/students/me', StudentsController.getStudentProfile);
  app.get('/api/students/attendance', StudentsController.getStudentAttendance);
  app.get('/api/students/fees', StudentsController.getStudentFees);

  // Learning Materials & Assignments
  app.get('/api/materials', (_req: Request, res: Response) => res.json(INITIAL_STUDY_MATERIALS));
  app.get('/api/assignments', (_req: Request, res: Response) => res.json(INITIAL_ASSIGNMENTS));

  // Examinations
  app.get('/api/exams', ExamsController.getExams);
  app.get('/api/exams/:examId', ExamsController.getExamById);
  app.post('/api/exams/submit', ExamsController.submitExam);

  // Announcements & Activity Logs
  app.get('/api/announcements', (_req: Request, res: Response) => res.json(INITIAL_ANNOUNCEMENTS));
  app.get('/api/audit-logs', (_req: Request, res: Response) => res.json(INITIAL_ACTIVITY_LOGS));

  // AI Learning Assistant
  app.post('/api/ai/ask', AiController.askTutor);
}
