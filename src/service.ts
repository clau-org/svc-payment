import {
  defineService,
  ServiceContext as DefaultServiceContext,
} from "../deps.ts";

import paymentCheckout from "./api/payment/checkout.ts";

const eventHandlers = [paymentCheckout];

export interface ServiceContext extends DefaultServiceContext { }

export default await defineService({ eventHandlers });
