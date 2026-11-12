/**
 * Auth Controller & Service Layer
 * Handles login, token generation, user profiles, and session validation
 */

import { Request, Response } from 'express';
import { INITIAL_USERS } from '@/src/data/mockDatabase';
import { User, AuthSession } from '@highstudy/shared-types';

export class AuthController {
  public static login(req: Request, res: Response): void {
    const { email, role } = req.body;

    if (!email && !role) {
      res.status(400).json({ error: 'Email or role required for authentication' });
      return;
    }

    let user: User | undefined;
    if (role) {
      user = INITIAL_USERS.find((u: User) => u.role === role);
    } else {
      user = INITIAL_USERS.find((u: User) => u.email.toLowerCase() === (email as string).toLowerCase());
    }

    if (!user) {
      res.status(404).json({ error: 'User record not found in HighStudy directory' });
      return;
    }

    const session: AuthSession = {
      user,
      token: `hs_jwt_${user.id}_${Date.now()}`,
      refreshToken: `hs_refresh_${user.id}_${Date.now()}`,
    };

    res.status(200).json(session);
  }

  public static getProfile(req: Request, res: Response): void {
    const userId = req.query.userId as string;
    const user = INITIAL_USERS.find((u: User) => u.id === userId) || INITIAL_USERS[0];
    res.status(200).json(user);
  }
}
