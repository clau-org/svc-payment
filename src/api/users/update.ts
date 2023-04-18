import {
  defineEventHandler,
  Handler,
  middlewareDbExist,
  schemaIds,
  z,
} from "../../../deps.ts";
import { ServiceContext } from "../../service.ts";
import { schema as schemaCreate } from "./create.ts";
import { updateUser } from "../../modules/users/update.ts";

export const path = "/users/update";
export const schema = z.object({ ...schemaIds }).merge(schemaCreate.partial());

const validateExist = middlewareDbExist("users", { varKey: "user" });

export const middlewares = [validateExist];

export const handler: Handler = async (ctx) => {
  const { event, db, logger } = ctx as ServiceContext;
  let { user, id, uuid, ...userData } = event;

  if (!user) return { data: { user } };

  user = await updateUser({ db, uuid: user.uuid, data: userData });

  logger.log(`[${path}]`, "users updated");

  return { data: { user } };
};

export default defineEventHandler({ path, schema, middlewares, handler });
