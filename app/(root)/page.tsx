import { ProductList } from '@/components/product/product-list';
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { Product } from '@/types';
import { getProducts } from '@/lib/actions/product.actions';

export default async function HomePage() {
  const products: Product[] = await getProducts();
  return (
    <>
      <ProductList
        data={products}
        title="Latest Products"
        limit={LATEST_PRODUCTS_LIMIT}
      />
    </>
  );
}
