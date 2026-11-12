/**
 * Students Controller
 * Handles student profiles, admissions, batch rosters, and progress analytics
 */

import { Request, Response } from 'express';
import { db } from '@/src/db/index.ts';
import * as schema from '@/src/db/schema.ts';
import { desc } from 'drizzle-orm';

export class StudentsController {
  public static async getStudentProfile(_req: Request, res: Response): Promise<void> {
    try {
      const records = await db.select().from(schema.students).limit(1);
      res.status(200).json(records[0] || null);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch student profile' });
    }
  }

  public static async getStudentAttendance(_req: Request, res: Response): Promise<void> {
    try {
      const records = await db.select().from(schema.attendanceRecords).orderBy(desc(schema.attendanceRecords.date));
      res.status(200).json(records);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch attendance' });
    }
  }

  public static async getStudentFees(_req: Request, res: Response): Promise<void> {
    try {
      const students = await db.select().from(schema.students).limit(1);
      const student = students[0];
      const feeRecords = await db.select().from(schema.feePayments).orderBy(desc(schema.feePayments.paymentDate));

      res.status(200).json({
        summary: {
          totalFee: student ? student.totalFee : 0,
          paidFee: student ? student.paidFee : 0,
          pendingFee: student ? student.pendingFee : 0,
        },
        paymentHistory: feeRecords,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch fee ledger' });
    }
  }
}
