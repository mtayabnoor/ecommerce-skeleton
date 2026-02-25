'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ Only set state once, safely after mount
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      className="cursor-pointer"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun
        className={`h-5 w-5 transition-all ${theme === 'dark' ? 'scale-0' : 'scale-100'}`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${theme === 'dark' ? 'scale-100' : 'scale-0'}`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
