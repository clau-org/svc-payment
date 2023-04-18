import { defineMiddleware } from "../deps.ts";
import { ServiceContext } from "../service.ts";

export default defineMiddleware(async (ctx, next) => {
  const { logger } = ctx as ServiceContext;
  logger.log("Hello middleware");
  await next();
});
