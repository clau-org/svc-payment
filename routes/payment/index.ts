import { defineEventHandler, z }  from "../../deps.ts";
import middlewareHello            from "../../middlewares/hello.ts";

import { orderSchema }  from "./schemas.ts"
import { payment }      from "./payment.ts"

export default defineEventHandler({ path: "/", schema: orderSchema, middlewares: [middlewareHello], handler: payment});
