import Link from 'next/link';
import { requireRole, Role } from '@/lib/roles';
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(Role.ADMIN);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r shadow-sm">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold text-foreground">
            Admin Panel
          </Link>
        </div>

        <nav className="mt-6">
          <div className="space-y-1 px-3">
            <Link
              href="/admin"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/admin/products?limit=5"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Package className="mr-3 h-4 w-4" />
              Products
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Package className="mr-3 h-4 w-4" />
              Categories
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ShoppingCart className="mr-3 h-4 w-4" />
              Orders
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Users className="mr-3 h-4 w-4" />
              Users
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
