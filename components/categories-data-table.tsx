// components/orders-data-table.tsx

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

interface CategoriesDataTableProps {
  data: CategoryItem[];
  isLoading?: boolean;
  pageCount: number;
  currentPage: number;
  limit?: number;
}

export function CategoriesDataTable({
  data,
  isLoading,
  pageCount,
  currentPage,
  limit = 10,
}: CategoriesDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const columns: ColumnDef<CategoryItem>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue('description')}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue('createdAt')}</span>
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
