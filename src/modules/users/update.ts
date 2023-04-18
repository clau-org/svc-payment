import { DBClient } from "../../database/client.ts";

export interface updateUserOptions {
  db: DBClient;
  uuid: string;
  data?: any;
}

export async function updateUser(options: updateUserOptions) {
  const { db, data, uuid } = options;
  return await db.users.update({ where: { uuid }, data });
}
