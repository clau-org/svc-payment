import {
  defineEventHandler,
  Handler,
  middlewareDbUnique,
  z,
} from "../../../deps.ts";
import { ServiceContext } from "../../service.ts";
import { createUser } from "../../modules/users/create.ts";

export const path = "/users/create";

export const schema = z.object({
  email: z.string().email(),
  name: z.string().nullish(),
  phone: z.string().nullish(),
}).strict();

const validateUnique = middlewareDbUnique("users", "email");

export const middlewares = [validateUnique];

export const handler: Handler = async (ctx) => {
  const { event, db, logger } = ctx as ServiceContext;

  const user = await createUser({ data: event, db });

  logger.log(`[${path}]`, "user created");

  return { data: { user } };
};

export default defineEventHandler({ path, schema, middlewares, handler });
