'use client';

import { updateUserRole } from '@/lib/server/actions/user';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function UserRoleSelector({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: 'admin' | 'user';
}) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'admin' | 'user';
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
        toast.success('User role updated to ' + newRole);
      } catch (err) {
        toast.error('Failed to update user role');
      }
    });
  };

  return (
    <select
      disabled={isPending}
      value={currentRole}
      onChange={handleRoleChange}
      className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="user">user</option>
      <option value="admin">admin</option>
    </select>
  );
}
