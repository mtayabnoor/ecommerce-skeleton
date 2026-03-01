import { getProductBySlug } from '@/lib/actions/product.actions';
import { Product } from '@/types';
import { notFound } from 'next/navigation';
import { ProductDetails } from '@/components/product-details/product-details';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const product: Product = await getProductBySlug(slug);

  if (!product) notFound();

  return <ProductDetails product={product} />;
}
