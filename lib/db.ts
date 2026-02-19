import { neon } from "@neondatabase/serverless";
import { AppError } from "@/lib/errors";

let client: ReturnType<typeof neon> | null = null;

function getClient() {
  if (client) {
    return client;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  client = neon(process.env.DATABASE_URL);
  return client;
}

export function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  return getClient()(strings, ...values);
}

export async function withTransaction<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Database operation failed", "DB_ERROR", 500);
  }
}
