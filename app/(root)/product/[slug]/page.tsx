import { getProductBySlug } from '@/lib/actions/product.actions';
import { Product } from '@/types';
import { notFound } from 'next/navigation';
import { ProductDetails2 } from '@/components/product/product-details-2';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const product: Product = await getProductBySlug(slug);

  if (!product) notFound();

  return <ProductDetails2 product={product} />;
}
