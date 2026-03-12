import { getUsers } from '@/lib/server/actions/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Suspense } from 'react';
import { UsersDataTable } from '@/components/users-data-table';
import { requireAdmin } from '@/lib/roles';

interface AdminUsersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
    limit?: string;
  }>;
}

async function UsersList({
  searchParams,
}: {
  searchParams: AdminUsersPageProps['searchParams'];
}) {
  await requireAdmin();

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');
  const limit = parseInt(resolvedParams.limit || '20');
  const search = resolvedParams.search || '';
  const status = resolvedParams.status === 'all' ? '' : resolvedParams.status || '';
  const dateFrom = resolvedParams.dateFrom
    ? new Date(resolvedParams.dateFrom)
    : undefined;
  const dateTo = resolvedParams.dateTo ? new Date(resolvedParams.dateTo) : undefined;

  const result = await getUsers({
    page,
    limit,
    search,
    status,
    dateFrom,
    dateTo,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-2">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1}-
          {Math.min(page * limit, result.pagination.total)} of {result.pagination.total}{' '}
          orders
        </p>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{result.pagination.total} total</Badge>
          <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400">
            {result.users.filter((o) => o.role === 'USER').length} users
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400">
            {result.users.filter((o) => o.role === 'ADMIN').length} admins
          </Badge>
        </div>
      </div>
      <UsersDataTable
        data={result.users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          date: new Date(user.createdAt).toLocaleDateString(),
        }))}
        isLoading={false}
        currentPage={page}
        pageCount={result.pagination.pages}
        limit={limit}
      />
    </div>
  );
}

export default async function AdminUsersPage(props: AdminUsersPageProps) {
  const searchParams = await props.searchParams;
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage users</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      {/* Users Table */}
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
          <UsersList searchParams={props.searchParams} />
        </Suspense>
      </div>
    </>
  );
}
