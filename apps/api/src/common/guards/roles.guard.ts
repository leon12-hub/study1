/**
 * HighStudy RBAC Authorization Guard & Middleware
 * Enforces role restrictions and branch isolation
 */

import { UserRole } from '@highstudy/shared-types';

export interface AuthenticatedUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  branchId?: string;
}

export function hasRequiredRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  if (userRole === 'SUPER_ADMIN') {
    return true; // Super admin possesses blanket authority across all endpoints
  }
  return allowedRoles.includes(userRole);
}

export function validateBranchAccess(
  userRole: UserRole,
  userBranchId: string | undefined,
  targetBranchId: string
): boolean {
  // Super Admin and Institute Admin can access all branch resources
  if (userRole === 'SUPER_ADMIN' || userRole === 'INSTITUTE_ADMIN') {
    return true;
  }
  // Branch Admin, Teacher, Student, Parent are strictly locked to their assigned branch
  return userBranchId === targetBranchId;
}
