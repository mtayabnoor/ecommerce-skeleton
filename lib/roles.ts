// lib/roles.ts
import { auth } from './auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export const PERMISSIONS = {
  // Product permissions
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  // Order permissions
  ORDER_CREATE: 'order:create',
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',
  ORDER_READ_ALL: 'order:read_all',

  // User permissions
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_READ_ALL: 'user:read_all',

  // Category permissions
  CATEGORY_CREATE: 'category:create',
  CATEGORY_READ: 'category:read',
  CATEGORY_UPDATE: 'category:update',
  CATEGORY_DELETE: 'category:delete',
  CATEGORY_READ_ALL: 'category:read_all',

  // Admin permissions
  ADMIN_ACCESS: 'admin:access',
  ANALYTICS_READ: 'analytics:read',
  SETTINGS_UPDATE: 'settings:update',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.USER]: [
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
  ],
  [Role.ADMIN]: [
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_DELETE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,
    PERMISSIONS.ORDER_READ_ALL,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_READ_ALL,
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.CATEGORY_CREATE,
    PERMISSIONS.CATEGORY_READ,
    PERMISSIONS.CATEGORY_UPDATE,
    PERMISSIONS.CATEGORY_DELETE,
    PERMISSIONS.CATEGORY_READ_ALL,
  ],
};

// --- CORE AUTH ---

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user;
};

// Helper to fetch permissions only once per request
const getUserPermissions = async (): Promise<Permission[]> => {
  const user = await getCurrentUser();
  return user ? ROLE_PERMISSIONS[user.role as Role] || [] : [];
};

// --- BOOLEAN CHECKERS ---

export const hasRole = async (requiredRole: Role) => {
  const user = await getCurrentUser();
  return user?.role === requiredRole;
};

export const hasPermission = async (permission: Permission) => {
  const perms = await getUserPermissions();
  return perms.includes(permission);
};

export const hasAllPermissions = async (permissions: Permission[]) => {
  const perms = await getUserPermissions();
  return permissions.every((p) => perms.includes(p));
};

export const hasAnyPermission = async (permissions: Permission[]) => {
  const perms = await getUserPermissions();
  return permissions.some((p) => perms.includes(p));
};

export const isResourceOwner = (resourceUserId: string, currentUserId: string) =>
  resourceUserId === currentUserId;

// --- ROUTE GUARDS ---

export const requireAuth = async (callbackUrl?: string) => {
  const user = await getCurrentUser();
  if (!user)
    redirect('/auth/signin' + (callbackUrl ? `?callbackUrl=${callbackUrl}` : ''));
  return user;
};

export const requireRole = async (requiredRole: Role) => {
  const user = await requireAuth();
  if (user.role !== requiredRole) {
    redirect('/');
  }
  return user;
};

export const requirePermission = async (permission: Permission) => {
  const user = await requireAuth();
  const perms = ROLE_PERMISSIONS[user.role as Role] || [];

  if (!perms.includes(permission)) {
    redirect('/');
  }
  return user;
};
