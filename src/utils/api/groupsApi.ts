import type { Group } from "../../types/api";
import { handleRpcCall } from "./helpers";

// ==================== GROUPS MANAGEMENT ====================

export const groupsApi = {
  // Get all groups for current user
  async getGroups(): Promise<Group[]> {
    try {
      return await handleRpcCall<Group[]>("get_user_groups");
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  },

  // Get single group by ID
  async getGroup(groupId: number): Promise<Group | null> {
    try {
      return await handleRpcCall<Group>("get_group_by_id", {
        p_group_id: groupId,
      });
    } catch (error) {
      console.error("Error fetching group:", error);
      throw error;
    }
  },

  // Create new group
  async createGroup(userId: number, groupName: string): Promise<Group> {
    try {
      return await handleRpcCall<Group>("create_group", {
        p_user_id: userId,
        p_group_name: groupName,
      });
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  },

  // Update group
  async updateGroup(
    groupId: number,
    updates: Partial<Pick<Group, "group_name">>
  ): Promise<Group> {
    try {
      return await handleRpcCall<Group>("update_group", {
        p_group_id: groupId,
        p_group_name: updates.group_name || null,
      });
    } catch (error) {
      console.error("Error updating group:", error);
      throw error;
    }
  },

  // Update group duplicated indices
  async updateGroupDuplicatedIndices(
    groupId: number,
    duplicatedIdx: string[]
  ): Promise<Group> {
    try {
      return await handleRpcCall<Group>("update_group", {
        p_group_id: groupId,
        p_duplicated_idx: duplicatedIdx,
      });
    } catch (error) {
      console.error("Error updating group duplicated indices:", error);
      throw error;
    }
  },

  // Delete group (cascades to students and attendance)
  async deleteGroup(groupId: number): Promise<void> {
    try {
      await handleRpcCall<void>("delete_group", { p_group_id: groupId });
    } catch (error) {
      console.error("Error deleting group:", error);
      throw error;
    }
  },
};
