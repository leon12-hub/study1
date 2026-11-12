/**
 * Branches Controller
 * Handles physical branch listings, details, and capacity metrics
 */

import { Request, Response } from 'express';
import { db } from '@/src/db/index.ts';
import * as schema from '@/src/db/schema.ts';
import { eq } from 'drizzle-orm';

export class BranchesController {
  public static async getAllBranches(_req: Request, res: Response): Promise<void> {
    try {
      const records = await db.select().from(schema.branches).orderBy(schema.branches.createdAt);
      res.status(200).json(records);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch branches' });
    }
  }

  public static async getBranchById(req: Request, res: Response): Promise<void> {
    const { branchId } = req.params;
    try {
      const branchRecords = await db.select().from(schema.branches).where(eq(schema.branches.id, branchId)).limit(1);
      const branch = branchRecords[0];
      if (!branch) {
        res.status(404).json({ error: 'Branch not found' });
        return;
      }
      const branchBatches = await db.select().from(schema.batches).where(eq(schema.batches.branchId, branchId));
      res.status(200).json({ ...branch, batches: branchBatches });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch branch details' });
    }
  }
}
