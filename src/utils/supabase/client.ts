import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton instance
let supabaseClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  // Return existing instance if already created
  if (supabaseClient) {
    return supabaseClient;
  }

  // Create new instance (only happens once)
  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabaseClient;
}

// Optional: Export function to get existing instance (for debugging)
export function getClientInstance(): SupabaseClient | null {
  return supabaseClient;
}

// Optional: Reset function for testing/cleanup
export function resetClient(): void {
  supabaseClient = null;
} 