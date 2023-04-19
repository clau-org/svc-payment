import { defineEventHandler, Handler, z } from "../../../deps.ts";
import { ServiceContext } from "../../service.ts";
import {
  PAYMENT_MERCADOPAGO_NAME,
  PAYMENT_STRIPE_NAME,
  requestCheckout,
} from "../../modules/payment/checkout/checkout.ts";

export const schemaItem = z.object({
  name: z.string(),
  price: z.number().positive(),
  image: z.string().url().optional(),
  quantity: z.number().positive(),
});

export const schemaPaymentProvider = z.object({
  name: z.union([
    z.literal(PAYMENT_MERCADOPAGO_NAME),
    z.literal(PAYMENT_STRIPE_NAME),
  ]),
  key: z.string().optional(),
  redirects: z.object({
    success: z.string(),
    failure: z.string(),
    pending: z.string().optional(),
  }),
});

export const schemaCheckoutRequest = z.object({
  items: z.array(schemaItem).min(1),
  provider: schemaPaymentProvider,
});

export const path = "/payment/checkout";
export const schema = schemaCheckoutRequest;

export const handler: Handler = async (ctx) => {
  const { event: checkoutRequest } = ctx as ServiceContext;
  const { provider } = checkoutRequest;

  const data = await requestCheckout(provider.name, checkoutRequest);

  return { data };
};

export default defineEventHandler({ path, schema, handler });
