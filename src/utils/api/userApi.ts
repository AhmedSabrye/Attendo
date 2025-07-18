import type { User } from "../../types/api";
import { handleRpcCall } from "./helpers";

// ==================== USER MANAGEMENT ====================

export const userApi = {
  // Get or create current user
  async getCurrentUser(authUser: any): Promise<User | null> {
    if (!authUser) return null;
    try {
      return await handleRpcCall<User>("get_or_create_user", {
        p_auth_user_id: authUser.id, // Supabase automatically handles UUID conversion
        p_username: authUser.email?.split("@")[0] ?? "User",
        p_email: authUser.email,
      });
    } catch (error) {
      console.error("Error fetching/creating user:", error);
      throw error;
    }
  },

  // Update user profile
  async updateUser(
    userId: number,
    updates: Partial<Pick<User, "username" | "email">>
  ): Promise<User> {
    try {
      return await handleRpcCall<User>("update_user_profile", {
        p_user_id: userId,
        p_username: updates.username || null,
        p_email: updates.email || null,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};
