import { APP_NAME } from '@/lib/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex justify-center items-center text-sm text-muted-foreground">
        © {currentYear} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
