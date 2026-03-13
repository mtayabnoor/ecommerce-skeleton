'use client';

//import { updateOrderStatus } from '@/lib/server/actions/order';
import { useTransition } from 'react';
import { toast } from 'sonner';

const STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

export function OrderStatusSelector({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      try {
        //await updateOrderStatus(orderId, newStatus);
        toast.success('Order status updated to ' + newStatus);
      } catch (err) {
        toast.error('Failed to update order status');
      }
    });
  };

  return (
    <select
      disabled={isPending}
      value={currentStatus}
      onChange={handleStatusChange}
      className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
