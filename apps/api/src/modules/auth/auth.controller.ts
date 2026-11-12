/**
 * Auth Controller & Service Layer
 * Handles login, token generation, user profiles, and session validation
 */

import { Request, Response } from 'express';
import { db } from '@/src/db/index.ts';
import * as schema from '@/src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { AuthSession } from '@highstudy/shared-types';

export class AuthController {
  public static async login(req: Request, res: Response): Promise<void> {
    const { email, role } = req.body;

    if (!email && !role) {
      res.status(400).json({ error: 'Email or role required for authentication' });
      return;
    }

    try {
      let user;
      if (role) {
        const records = await db.select().from(schema.users).where(eq(schema.users.role, role)).limit(1);
        user = records[0];
      } else if (email) {
        const records = await db.select().from(schema.users).where(eq(schema.users.email, (email as string).toLowerCase())).limit(1);
        user = records[0];
      }

      if (!user) {
        res.status(404).json({ error: 'User record not found in HighStudy directory' });
        return;
      }

      const session: AuthSession = {
        user: user as any,
        token: `hs_jwt_${user.id}_${Date.now()}`,
        refreshToken: `hs_refresh_${user.id}_${Date.now()}`,
      };

      res.status(200).json(session);
    } catch (err: any) {
      res.status(500).json({ error: 'Database authentication failed' });
    }
  }

  public static async getProfile(req: Request, res: Response): Promise<void> {
    const userId = req.query.userId as string;
    try {
      if (userId) {
        const records = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
        if (records[0]) {
          res.status(200).json(records[0]);
          return;
        }
      }
      const records = await db.select().from(schema.users).limit(1);
      res.status(200).json(records[0] || null);
    } catch (err: any) {
      res.status(500).json({ error: 'Database query failed' });
    }
  }
}
