import { defineDatabaseClient } from "../../deps.ts";
import { PrismaClient } from "./generated/client/deno/edge.ts";

export class DBClient extends PrismaClient {}

export default await defineDatabaseClient<PrismaClient>({ PrismaClient });
