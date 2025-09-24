import { db } from "./index";
import { companies } from "../db/schema";

async function testConnection() {
  try {
    const result = await db.select().from(companies).limit(5);
    console.log("✅ Connected! Found companies:", result.length);
    console.log(result);
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
}

testConnection();
