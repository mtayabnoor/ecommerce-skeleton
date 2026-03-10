// components/products-data-table.tsx

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
}

interface ProductsDataTableProps {
  data: ProductItem[];
  isLoading?: boolean;
  pageCount: number;
  currentPage: number;
  limit?: number;
  onEdit?: (product: ProductItem) => void;
  onDelete?: (productId: string) => void;
}

export function ProductsDataTable({
  data,
  isLoading,
  pageCount,
  currentPage,
  limit = 10, // default to 20
  onEdit,
  onDelete,
}: ProductsDataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const columns: ColumnDef<ProductItem>[] = [
    {
      accessorKey: 'name',
      header: 'Product Name',
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
    },
    {
      accessorKey: 'price',
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => {
        const price = row.getValue('price') as number;
        return <div className="text-right font-medium">${price.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: 'stock',
      header: () => <div className="text-right">Stock</div>,
      cell: ({ row }) => {
        const stock = row.getValue('stock') as number;
        return <div className="text-right font-medium">{stock}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const value = row.getValue('status') as string;
        const statusMap: Record<
          string,
          'default' | 'secondary' | 'destructive' | 'outline'
        > = {
          active: 'default',
          inactive: 'secondary',
          discontinued: 'destructive',
        };
        const variant = statusMap[value] || 'outline';
        return (
          <Badge variant={variant} className="capitalize">
            {value}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit?.(row.original)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete?.(row.original.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
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
    // +1 because table uses 0-based pageIndex, but URL expects 1-based "page"
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
