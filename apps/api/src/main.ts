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
import { db } from '../../../src/db/index.ts';
import * as schema from '../../../src/db/schema.ts';
import { desc } from 'drizzle-orm';

export function configureApiRoutes(app: express.Express): void {
  // Health & Information
  app.get('/api/health', async (_req: Request, res: Response) => {
    try {
      const inst = await db.select().from(schema.institutes).limit(1);
      res.json({
        status: 'UP',
        service: 'HighStudy Central Institute API',
        database: 'Cloud SQL Connected',
        institute: inst[0]?.name || 'HighStudy Apex Academy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
    } catch {
      res.json({ status: 'UP', service: 'HighStudy Central Institute API', version: '1.0.0' });
    }
  });

  // Auth & RBAC
  app.post('/api/auth/login', AuthController.login);
  app.get('/api/auth/profile', AuthController.getProfile);

  // Branches
  app.get('/api/branches', BranchesController.getAllBranches);
  app.get('/api/branches/:branchId', BranchesController.getBranchById);

  // Courses, Subjects & Batches
  app.get('/api/courses', async (_req: Request, res: Response) => {
    const list = await db.select().from(schema.courses);
    res.json(list);
  });
  app.get('/api/subjects', async (_req: Request, res: Response) => {
    const list = await db.select().from(schema.subjects);
    res.json(list);
  });
  app.get('/api/batches', async (_req: Request, res: Response) => {
    const list = await db.select().from(schema.batches);
    res.json(list);
  });

  // Students & Academics
  app.get('/api/students/me', StudentsController.getStudentProfile);
  app.get('/api/students/attendance', StudentsController.getStudentAttendance);
  app.get('/api/students/fees', StudentsController.getStudentFees);

  // Learning Materials & Assignments
  app.get('/api/materials', async (_req: Request, res: Response) => {
    const list = await db.select().from(schema.studyMaterials).orderBy(desc(schema.studyMaterials.uploadedAt));
    res.json(list);
  });
  app.get('/api/assignments', async (_req: Request, res: Response) => {
    const list = await db.select().from(schema.assignments).orderBy(desc(schema.assignments.createdAt));
    res.json(list);
  });

  // Examinations
  app.get('/api/exams', ExamsController.getExams);
  app.get('/api/exams/:examId', ExamsController.getExamById);
  app.post('/api/exams/submit', ExamsController.submitExam);

  // Announcements & Activity Logs
  app.get('/api/announcements', async (_req: Request, res: Response) => {
    const list = await db.select().from(schema.announcements).orderBy(desc(schema.announcements.publishedAt));
    res.json(list);
  });
  app.get('/api/audit-logs', async (_req: Request, res: Response) => {
    const list = await db.select().from(schema.activityLogs).orderBy(desc(schema.activityLogs.timestamp));
    res.json(list);
  });

  // AI Learning Assistant
  app.post('/api/ai/ask', AiController.askTutor);
}
