import { ProductList } from '@/components/product/product-list';
import { getProducts } from '@/lib/actions/product.actions';
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { Product } from '@/types';

const HomePage = async () => {
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
};

export default HomePage;
