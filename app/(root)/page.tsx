import { ProductList } from '@/components/product-list';
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { Product } from '@/types';
import { getProducts } from '@/lib/actions/product.actions';
import { Separator } from '@/components/ui/separator';

export default async function HomePage() {
  const products: Product[] = await getProducts();
  const featuredProducts = products.filter((product) => product.isFeatured);
  return (
    <>
      <ProductList
        data={products}
        title="Latest Products"
        limit={LATEST_PRODUCTS_LIMIT}
      />
      <Separator />
      <ProductList
        data={featuredProducts}
        title="New Arrivals"
        limit={LATEST_PRODUCTS_LIMIT}
      />
    </>
  );
}
