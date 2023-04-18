import {
  defineEventHandler,
  Handler,
  middlewareDbExist,
  schemaIds,
  z,
} from "../../../deps.ts";
import { ServiceContext } from "../../service.ts";
import { deleteUser } from "../../modules/users/delete.ts";

export const path = "/users/delete";
export const schema = z.object({ ...schemaIds });

const validateExist = middlewareDbExist("users", { varKey: "user" });
export const middlewares = [validateExist];

export const handler: Handler = async (ctx) => {
  const { event, db, logger } = ctx as ServiceContext;
  let { user } = event;

  if (!user) return { data: { user } };

  user = await deleteUser({ db, uuid: user.uuid });

  logger.log(`${path}`, "user deleted");

  return { data: { user } };
};

export default defineEventHandler({ path, schema, middlewares, handler });
