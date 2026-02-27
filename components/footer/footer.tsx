import { APP_NAME } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted">
      <Separator />
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-5 flex justify-center items-center text-xs text-muted-foreground">
        © {currentYear} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}

export { Footer };
