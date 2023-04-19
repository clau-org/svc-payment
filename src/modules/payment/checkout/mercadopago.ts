import { CheckoutRequest, CheckoutResponse, Item } from "./checkout.ts";
import { mercadopago } from "../../../../deps.ts";

export interface ItemMercadoPago {
  title: string;
  unit_price: number;
  picture_url?: string;
  quantity: number;
}

export const PAYMENT_PROVIDER_NAME = "mercadopago";

export async function requestCheckout(
  checkoutRequest: CheckoutRequest,
): Promise<CheckoutResponse> {
  // Extract and transform
  const {
    items: _items,
    provider: {
      key: access_token,
      redirects: back_urls,
      name,
    },
  } = checkoutRequest;

  // Setup provider
  mercadopago.configure({ access_token });

  // Transforms to items
  const items: ItemMercadoPago[] = _items.map(transformToItem);

  // Config payment provider request
  const config: any = { auto_return: "approved", items, back_urls };

  // Get data from provider response
  const { body: { id, init_point: url } } = await mercadopago.preferences
    .create(config);

  return { id, url, provider: { name } };
}

export const transformToItem = (item: Item): ItemMercadoPago => {
  const { name: title, price: unit_price, image: picture_url, quantity } = item;
  return { title, unit_price, picture_url, quantity };
};
