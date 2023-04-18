import { DBClient } from "../../database/client.ts";

export interface createUserOptions {
  db: DBClient;
  data: any;
}

export async function createUser(options: createUserOptions) {
  const { db, data } = options;
  return await db.users.create({ data });
}
