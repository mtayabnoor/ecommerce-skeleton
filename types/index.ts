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

export type ActionResponse<T = unknown> =
  | {
      success: true;
      message: string;
      data?: T;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
