/**
 * Branches Controller
 * Handles physical branch listings, details, and capacity metrics
 */

import { Request, Response } from 'express';
import { INITIAL_BRANCHES, INITIAL_BATCHES } from '@/src/data/mockDatabase';
import { Branch, Batch } from '@highstudy/shared-types';

export class BranchesController {
  public static getAllBranches(_req: Request, res: Response): void {
    res.status(200).json(INITIAL_BRANCHES);
  }

  public static getBranchById(req: Request, res: Response): void {
    const { branchId } = req.params;
    const branch = INITIAL_BRANCHES.find((b: Branch) => b.id === branchId);
    if (!branch) {
      res.status(404).json({ error: 'Branch not found' });
      return;
    }
    const branchBatches = INITIAL_BATCHES.filter((b: Batch) => b.branchId === branchId);
    res.status(200).json({ ...branch, batches: branchBatches });
  }
}
