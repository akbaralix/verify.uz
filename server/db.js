import { createClient } from "@supabase/supabase-js";

let cachedClient;

export async function connectToDatabase() {
  if (cachedClient) {
    return { client: cachedClient, db: cachedClient };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "SUPABASE_URL yoki SUPABASE_PUBLISHABLE_KEY environment variable topilmadi.",
    );
  }

  cachedClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return { client: cachedClient, db: cachedClient };
}
