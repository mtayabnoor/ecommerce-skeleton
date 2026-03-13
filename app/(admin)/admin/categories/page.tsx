import { Suspense } from 'react';
import { Download } from 'lucide-react';
import { getCategories } from '@/lib/server/queries/category';
import { CategoriesDataTable } from '@/components/categories-data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { ActionResponse } from '@/types';
import { toast } from 'sonner';
import { CategoriesFilters } from './categories-filter';

export const dynamic = 'force-dynamic';

interface AdminCategoriesPageProps {
  searchParams: Promise<{
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
    limit?: string;
  }>;
}

async function CategoriesList({
  searchParams,
}: {
  searchParams: AdminCategoriesPageProps['searchParams'];
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');
  const limit = parseInt(resolvedParams.limit || '20');
  const search = resolvedParams.search || '';
  const dateFrom = resolvedParams.dateFrom
    ? new Date(resolvedParams.dateFrom)
    : undefined;
  const dateTo = resolvedParams.dateTo ? new Date(resolvedParams.dateTo) : undefined;

  const result: ActionResponse<any> = await getCategories({
    page,
    limit,
    search,
    dateFrom,
    dateTo,
  });

  if (!result.success) {
    toast.error(result.message);
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-2">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1}-
          {Math.min(page * limit, result.data.pagination.total)} of{' '}
          {result.data.pagination.total} categories
        </p>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{result.data.pagination.total} total</Badge>
        </div>
      </div>

      <CategoriesDataTable
        data={result.data.categories.map((category: any) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          createdAt: new Date(category.createdAt).toLocaleDateString(),
        }))}
        isLoading={false}
        currentPage={page}
        pageCount={result.data.pagination.pages}
        limit={limit}
      />
    </div>
  );
}

export default async function AdminCategoriesPage(props: AdminCategoriesPageProps) {
  const searchParams = await props.searchParams;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage categories</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <CategoriesFilters />

      {/* Categories Table */}
      <div className="rounded-md border bg-card">
        <Suspense
          key={searchParams.page}
          fallback={
            <div className="p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading categories...</p>
            </div>
          }
        >
          <CategoriesList searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
