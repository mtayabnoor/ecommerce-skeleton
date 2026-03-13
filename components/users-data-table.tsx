// components/users-data-table.tsx

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { UserRoleSelector } from '@/components/user-role-selector';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  date: string;
}

interface UserDataTableProps {
  data: UserItem[];
  isLoading?: boolean;
  pageCount: number;
  currentPage: number;
  limit?: number;
}

export function UsersDataTable({
  data,
  isLoading,
  pageCount,
  currentPage,
  limit = 10, // default to 20
}: UserDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const columns: ColumnDef<UserItem>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue('role')}</span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Created At',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue('date')}</span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <UserRoleSelector userId={row.original.id} currentRole={row.original.role} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/users/${row.original.id}`)}
          >
            <Trash2 className="h-2 w-2" />
          </Button>
        </div>
      ),
    },
  ];

  const handlePaginationChange = (updater: any) => {
    // Tanstack passes a functional updater or new state
    const newState =
      typeof updater === 'function'
        ? updater({ pageIndex: currentPage - 1, pageSize: limit })
        : updater;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (newState.pageIndex + 1).toString());
    if (newState.pageSize !== limit) {
      params.set('limit', newState.pageSize.toString());
      // Reset to page 1 when changing page size
      params.set('page', '1');
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      pageCount={pageCount}
      pagination={{ pageIndex: currentPage - 1, pageSize: limit }}
      onPaginationChange={handlePaginationChange}
    />
  );
}
