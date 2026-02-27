import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { Menu } from './menu';

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background transition-colors">
      <div className="max-w-7xl lg:mx-auto px-5 md:px-10 w-full h-14 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={40}
              height={40}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-xl tracking-tight">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
}

export { Header };
