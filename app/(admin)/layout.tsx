import Link from 'next/link';
import { requireAdmin } from '@/lib/roles';
import { AdminNav } from '@/components/admin-nav';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

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
              href="/admin/inventory"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Package className="mr-3 h-4 w-4" />
              Inventory
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Users className="mr-3 h-4 w-4" />
              Users
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {user.name || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/api/auth/signout">
                <LogOut className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b bg-card shadow-sm">
          <div className="px-6 py-4">
            <AdminNav />
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
