import { ProductCard } from './product-card';
import { Product } from '@/types';

function ProductList({
  data,
  title,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) {
  const products = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-12">
            No products found
          </p>
        ) : (
          products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export { ProductList };
