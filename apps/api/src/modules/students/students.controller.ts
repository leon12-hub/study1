/**
 * Students Controller
 * Handles student profiles, admissions, batch rosters, and progress analytics
 */

import { Request, Response } from 'express';
import { CURRENT_STUDENT, INITIAL_ATTENDANCE, INITIAL_FEE_PAYMENTS } from '@/src/data/mockDatabase';

export class StudentsController {
  public static getStudentProfile(_req: Request, res: Response): void {
    res.status(200).json(CURRENT_STUDENT);
  }

  public static getStudentAttendance(_req: Request, res: Response): void {
    res.status(200).json(INITIAL_ATTENDANCE);
  }

  public static getStudentFees(_req: Request, res: Response): void {
    res.status(200).json({
      summary: {
        totalFee: CURRENT_STUDENT.totalFee,
        paidFee: CURRENT_STUDENT.paidFee,
        pendingFee: CURRENT_STUDENT.pendingFee,
      },
      paymentHistory: INITIAL_FEE_PAYMENTS,
    });
  }
}
