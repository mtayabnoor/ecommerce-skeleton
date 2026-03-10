import { getAdminCategories } from '@/lib/server/queries/admin';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServerTrashButton } from './server-trash-button';
import { createCategory } from '@/lib/server/actions/admin';

export default async function AdminCategories() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-2">
          Manage product categories and collections.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Create Category Form */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
            <CardDescription>Create a new category for your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="e.g. Electronics" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Optional details..."
                />
              </div>
              <Button type="submit" className="w-full">
                Create Category
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium text-center">Products</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        No categories found.
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr
                        key={category.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">{category.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {category.slug}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {category._count.products}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <ServerTrashButton id={category.id} type="category" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
