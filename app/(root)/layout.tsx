import { Header } from '@/components/header';
import { Footer } from '@/components/footer/footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto max-w-7xl mx-auto px-5 md:px-10 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
