import { getFeaturedProducts, getNewProducts } from '@/lib/server/queries/product';
import { Metadata } from 'next';
import { ProductCarousel } from '@/components/product-carousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Users, TrendingUp, Star } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/product-grid-skeleton';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Home',
};

async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No featured products available.</p>
      </div>
    );
  }

  return <ProductCarousel products={products as any} />;
}

async function NewProducts() {
  const products = await getNewProducts();

  if (!products.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No new products available.</p>
      </div>
    );
  }

  // Use a slightly larger slice for curating the carousel sliding effect
  return <ProductCarousel products={products.slice(0, 8) as any} />;
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        {/* Subtle top glow utilizing semantic background variables */}
        <div className="absolute inset-0 bg-linear-to-b from-muted/50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to Our
              {/* Gold gradient text effect designed to work on dark/light themes */}
              <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-yellow-500 via-amber-400 to-yellow-500 drop-shadow-sm">
                Amazing Store
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
              Discover incredible products at unbeatable prices. From the latest trends to
              timeless classics, we have everything you need to elevate your lifestyle.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="px-8 rounded-full shadow-lg">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 rounded-full border-muted-foreground/30 hover:bg-muted"
              >
                <Link href="/category/featured">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border/40">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">10K+</h3>
              <p className="text-muted-foreground mt-1">Happy Customers</p>
            </div>
            <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border/40">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">500+</h3>
              <p className="text-muted-foreground mt-1">Products Available</p>
            </div>
            <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border/40">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Star className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">4.9/5</h3>
              <p className="text-muted-foreground mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Products
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Hand-picked selections from our best-selling items, curated just for you.
            </p>
          </div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <FeaturedProducts />
          </Suspense>
          <div className="mt-14 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-muted/30 py-20 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              New Arrivals
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Fresh finds and latest additions. Be the first to grab our newest trends.
            </p>
          </div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <NewProducts />
          </Suspense>
          <div className="mt-14 text-center">
            <Button asChild size="lg" className="rounded-full shadow-md">
              <Link href="/products?sort=newest">
                Shop New Arrivals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-card py-20 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-muted/50 rounded-3xl p-8 sm:p-12 border border-border shadow-sm">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Stay Updated
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Subscribe to our newsletter for exclusive deals, early access to sales, and
              new product alerts.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full sm:w-80 rounded-full border border-input bg-background px-6 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8 shadow-md">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
