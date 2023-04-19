import { CheckoutRequest, CheckoutResponse, Item } from "./checkout.ts";
import { stripe } from "../../../../deps.ts";

export interface ItemStripe {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      images?: string[];
    };
    unit_amount: number;
  };
  quantity: number;
}

export const PAYMENT_PROVIDER_NAME = "stripe";

export async function requestCheckout(
  checkoutRequest: CheckoutRequest,
): Promise<CheckoutResponse> {
  // Extract and transform
  const {
    items,
    provider: {
      key,
      redirects: {
        success: success_url,
        failure: cancel_url,
      },
      name,
    },
  } = checkoutRequest;

  // Setup provider
  const stripeClient = stripe(key);

  // Transforms to items
  const line_items: ItemStripe[] = items.map(transformToItem);

  // Config payment provider request
  const config = {
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url,
    cancel_url,
  };

  // Get data from provider response
  const { id, url } = await stripeClient.checkout.sessions.create(config);

  return { id, url, provider: { name } };
}

export const transformToItem = (item: Item): ItemStripe => {
  const { name, price, image, quantity } = item;
  const images = image ? [image] : undefined;
  return {
    price_data: {
      currency: "usd",
      product_data: { name, images },
      unit_amount: Math.floor(price * 100),
    },
    quantity,
  };
};
