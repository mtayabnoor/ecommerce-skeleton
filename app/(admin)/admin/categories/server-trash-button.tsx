'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteCategory, deleteProduct } from '@/lib/server/actions/admin';
import { toast } from 'sonner';

export function ServerTrashButton({
  id,
  type,
}: {
  id: string;
  type: 'category' | 'product';
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    startTransition(async () => {
      try {
        if (type === 'category') {
          await deleteCategory(id);
        } else {
          await deleteProduct(id);
        }
        toast.success(`${type} deleted successfully.`);
      } catch (e) {
        toast.error(`Failed to delete ${type}`);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
