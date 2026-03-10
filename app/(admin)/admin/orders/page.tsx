// File: app/admin/orders/page.tsx
import { Suspense } from 'react';
import { Download } from 'lucide-react';
import { getOrders } from '@/lib/server/queries/orders';
import { OrdersDataTable } from '@/components/orders-data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrdersFilters } from './orders-filters';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface AdminOrdersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
    limit?: string;
  }>;
}

async function OrdersList({
  searchParams,
}: {
  searchParams: AdminOrdersPageProps['searchParams'];
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');
  const limit = parseInt(resolvedParams.limit || '20');
  const search = resolvedParams.search || '';
  const status = resolvedParams.status === 'all' ? '' : resolvedParams.status || '';
  const dateFrom = resolvedParams.dateFrom
    ? new Date(resolvedParams.dateFrom)
    : undefined;
  const dateTo = resolvedParams.dateTo ? new Date(resolvedParams.dateTo) : undefined;

  const result = await getOrders({
    page,
    limit,
    search,
    status,
    dateFrom,
    dateTo,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1}-
          {Math.min(page * limit, result.pagination.total)} of {result.pagination.total}{' '}
          orders
        </p>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{result.pagination.total} total</Badge>
          <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400">
            {result.orders.filter((o) => o.status === 'PENDING').length} pending
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400">
            {result.orders.filter((o) => o.status === 'PROCESSING').length} processing
          </Badge>
        </div>
      </div>

      <OrdersDataTable
        data={result.orders.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customer: order.user?.name || order.email || 'Unknown',
          total: Number(order.total),
          status: order.status.toLowerCase().replace('_', ' ') as any,
          date: new Date(order.createdAt).toLocaleDateString(),
        }))}
        isLoading={false}
        currentPage={page}
        pageCount={result.pagination.pages}
        limit={limit}
      />
    </div>
  );
}

export default async function AdminOrdersPage(props: AdminOrdersPageProps) {
  const searchParams = await props.searchParams;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <OrdersFilters />

      {/* Orders Table */}
      <div className="rounded-md border bg-card">
        <Suspense
          key={searchParams.page}
          fallback={
            <div className="p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
            </div>
          }
        >
          <OrdersList searchParams={props.searchParams} />
        </Suspense>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-2 rounded bg-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">2,847</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-2 rounded bg-amber-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">42</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-2 rounded bg-purple-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold">128</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-2 rounded bg-emerald-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">2,651</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-2 rounded bg-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">{formatPrice(284750)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
