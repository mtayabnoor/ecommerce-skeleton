import { ProductList } from '@/components/product/product-list';
import sampleData from '@/db/sample-data';

const HomePage = async () => {
  return (
    <>
      <ProductList data={sampleData} title="Featured Products" limit={4} />
    </>
  );
};

export default HomePage;
