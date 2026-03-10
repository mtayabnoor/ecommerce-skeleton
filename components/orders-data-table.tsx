// components/orders-data-table.tsx

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface OrderItem {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface OrdersDataTableProps {
  data: OrderItem[];
  isLoading?: boolean;
  pageCount: number;
  currentPage: number;
  limit?: number;
}

export function OrdersDataTable({
  data,
  isLoading,
  pageCount,
  currentPage,
  limit = 10, // default to 20
}: OrdersDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const columns: ColumnDef<OrderItem>[] = [
    {
      accessorKey: 'orderNumber',
      header: 'Order Number',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('orderNumber')}</span>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue('date')}</span>
      ),
    },
    {
      accessorKey: 'total',
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue('total'))}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const value = row.getValue('status') as string;
        const statusMap: Record<
          string,
          {
            variant: 'default' | 'secondary' | 'destructive' | 'outline';
            className?: string;
          }
        > = {
          pending: { variant: 'secondary' },
          processing: { variant: 'default', className: 'bg-blue-500 hover:bg-blue-600' },
          shipped: { variant: 'default', className: 'bg-purple-500 hover:bg-purple-600' },
          delivered: {
            variant: 'default',
            className: 'bg-emerald-500 hover:bg-emerald-600',
          },
          cancelled: { variant: 'destructive' },
        };

        const config = statusMap[value] || { variant: 'outline' };

        return (
          <Badge
            variant={config.variant}
            className={`capitalize ${config.className || ''}`}
          >
            {value}
          </Badge>
        );
      },
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
