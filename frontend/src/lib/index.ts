import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../../env";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
