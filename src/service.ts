import {
  defineService,
  ServiceContext as DefaultServiceContext,
} from "../deps.ts";
import { DBClient, default as dbClient } from "./database/client.ts";

import usersCreate from "./api/users/create.ts";
import usersRead from "./api/users/read.ts";
import usersUpdate from "./api/users/update.ts";
import usersDelete from "./api/users/delete.ts";

const eventHandlers = [
  usersCreate,
  usersRead,
  usersUpdate,
  usersDelete,
];
export interface ServiceContext extends DefaultServiceContext {
  db: DBClient;
}

export default await defineService({ dbClient, eventHandlers });
