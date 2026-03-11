export type CartItem = {
  productId: string;
  quantity: number;
  variantId: string | null;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
};

export type ActionResponse = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};
