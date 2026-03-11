// components/users-data-table.tsx

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
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
