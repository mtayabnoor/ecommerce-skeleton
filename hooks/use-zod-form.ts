import { useState } from 'react';
import { ZodSchema } from 'zod';
import { formatZodErrors } from '@/lib/utils';
import { ActionResponse } from '@/types';

type SubmitHandler<T> = (data: T) => Promise<ActionResponse>;

export function useZodForm<T>(schema: ZodSchema<T>, onSubmit: SubmitHandler<T>) {
  const [errors, setErrors] = useState<ActionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrors(null);

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData) as Record<string, unknown>;

    const result = schema.safeParse(rawData);

    if (!result.success) {
      const formatted = formatZodErrors(result.error);
      setErrors(formatted);
      return;
    }

    try {
      setLoading(true);

      const response = await onSubmit(result.data);

      if (!response.success) {
        setErrors(response);
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    handleSubmit,
    loading,
    errors,
    setErrors,
  };
}
