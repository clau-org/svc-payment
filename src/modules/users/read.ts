import { DBClient } from "../../database/client.ts";

export interface readUserOptions {
  db: DBClient;
  page?: number;
  pageSize?: number;
}

export async function readUsers(options: readUserOptions) {
  const { db, page = 1, pageSize = 12 } = options;

  const skip = (page - 1) * pageSize;
  const users = await db.users.findMany({ skip, take: pageSize });

  const maxUsers = await db.users.count();
  const maxPage = Math.ceil(maxUsers / pageSize);

  return { users, maxPage };
}
