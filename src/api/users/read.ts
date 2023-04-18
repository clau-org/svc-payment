import {
  defineEventHandler,
  Handler,
  middlewareDbExist,
  schemaIds,
  schemaPage,
  z,
} from "../../../deps.ts";
import { ServiceContext } from "../../service.ts";
import { readUsers } from "../../modules/users/read.ts";

export const path = "/users/read";
export const schema = z.object({ ...schemaIds, ...schemaPage });

const validateExist = middlewareDbExist("users", { varKey: "user" });
export const middlewares = [validateExist];

export const handler: Handler = async (ctx) => {
  const { event, db, logger } = ctx as ServiceContext;
  const { user, page, pageSize } = event;

  if (user) {
    logger.log(`[${path}]`, "user read");
    return { data: { user } };
  }

  // If user not requested, get all users
  const { users, maxPage } = await readUsers({ db, page, pageSize });

  logger.log(`[${path}]`, "users read");

  return { data: { users, maxPage } };
};

export default defineEventHandler({ path, schema, middlewares, handler });
