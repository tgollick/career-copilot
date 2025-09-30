import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Clerk publishable key is required"),
  CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),

  // Database
  DATABASE_URL: z.string().url("Database URL must be a valid URL"),

  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Deepseek API Key
  DEEPSEEK_API_KEY: z
    .string()
    .min(1, "Please enter a API key for Deepseek Module"),

  FASTAPI_URL: z.string().min(1, "Please provide a FastAPI url endpoint"),
});

// Validate environment variables
const parseEnv = () => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    FASTAPI_URL: process.env.FASTAPI_URL,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
};

// Export the validated environment variables
export const env = parseEnv();

// Type export for use in other files
export type Env = z.infer<typeof envSchema>;

// Helper function to check if we're in development
export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
