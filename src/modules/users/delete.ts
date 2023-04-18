import { DBClient } from "../../database/client.ts";

export interface deleteUserOptions {
  db: DBClient;
  uuid: string;
}

export async function deleteUser(options: deleteUserOptions) {
  const { db, uuid } = options;
  return await db.users.delete({ where: { uuid } });
}
