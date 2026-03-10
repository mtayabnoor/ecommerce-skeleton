import { getAdminDashboardStats } from '@/lib/server/queries/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageSearch, Users, Tags, ShoppingBag } from 'lucide-react';

export default async function AdminDashboard() {
  const { userCount, productCount, categoryCount, orderCount } =
    await getAdminDashboardStats();

  const stats = [
    {
      title: 'Total Users',
      value: userCount,
      icon: Users,
    },
    {
      title: 'Total Products',
      value: productCount,
      icon: PackageSearch,
    },
    {
      title: 'Total Categories',
      value: categoryCount,
      icon: Tags,
    },
    {
      title: 'Total Orders',
      value: orderCount,
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the enterprise administration panel.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
