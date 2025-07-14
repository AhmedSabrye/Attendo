import { supabase } from "../../lib/supabaseClient";

// ==================== HELPER FUNCTIONS ====================

export async function handleRpcCall<T>(functionName: string, params: Record<string, any> = {}): Promise<T> {
  const { data, error } = await supabase.rpc(functionName, params);

  if (error) {
    console.error(`RPC Error (${functionName}):`, error);
    throw error;
  }

  if (!data?.success) {
    console.error(`Function Error (${functionName}):`, data?.error);
    throw new Error(data?.error || "Unknown function error");
  }

  return data.data;
}
