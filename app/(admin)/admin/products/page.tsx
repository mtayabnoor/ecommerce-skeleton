// File: app/admin/products/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getProducts } from '@/lib/server/queries/product';
import { ProductsDataTable } from '@/components/products-data-table';
import { Button } from '@/components/ui/button';
import { ProductsFilters } from './products-filters';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

interface AdminProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
    limit?: string;
  }>;
}

async function ProductsList({
  searchParams,
}: {
  searchParams: AdminProductsPageProps['searchParams'];
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');
  const limit = parseInt(resolvedParams.limit || '20');
  const search = resolvedParams.search === 'all' ? '' : resolvedParams.search || '';
  const category = resolvedParams.category === 'all' ? '' : resolvedParams.category || '';
  const status = resolvedParams.status === 'all' ? '' : resolvedParams.status || '';

  const result = await getProducts({
    page,
    limit,
    search,
    category,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1}-
          {Math.min(page * limit, result.pagination.total)} of {result.pagination.total}{' '}
          products
        </p>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{result.pagination.total} total</Badge>
          <Badge variant="secondary">
            {result.products.filter((p) => p.status === 'PUBLISHED').length} published
          </Badge>
          <Badge variant="destructive">
            {result.products.filter((p) => p.status === 'DRAFT').length} draft
          </Badge>
        </div>
      </div>

      <ProductsDataTable
        data={result.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.sku || '',
          price: Number(p.price),
          stock: 0,
          status: p.status === 'PUBLISHED' ? 'active' : 'inactive',
        }))}
        isLoading={false}
        currentPage={page}
        pageCount={result.pagination.pages}
        limit={limit}
      />
    </div>
  );
}

export default async function AdminProductsPage(props: AdminProductsPageProps) {
  const searchParams = await props.searchParams;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <ProductsFilters />

      {/* Products Table */}
      <div className="rounded-md border bg-card">
        <Suspense
          key={searchParams.page}
          fallback={
            <div className="p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading products...</p>
            </div>
          }
        >
          <ProductsList searchParams={props.searchParams} />
        </Suspense>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-2 rounded bg-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-2 rounded bg-emerald-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Published</p>
              <p className="text-2xl font-bold">1,089</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-2 rounded bg-amber-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold">23</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground p-6">
          <div className="flex items-center">
            <div className="mr-3 h-8 w-2 rounded bg-destructive" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
