import { APP_NAME } from '@/lib/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="p-5 flex justify-center items-center text-sm text-muted-foreground">
        © {currentYear} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
