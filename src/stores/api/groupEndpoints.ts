import type { EndpointBuilder } from "@reduxjs/toolkit/query/react";
import supabaseApi, { type Group } from "../../utils/api";

export const groupEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  // ==================== GROUP ENDPOINTS ====================
  getGroups: builder.query<Group[], void>({
    queryFn: async () => {
      try {
        const data = await supabaseApi.groups.getGroups();
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: ["Group"],
  }),

  getGroup: builder.query<Group | null, number>({
    queryFn: async (groupId) => {
      try {
        const data = await supabaseApi.groups.getGroup(groupId);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: (_result, _error, groupId) => [{ type: "Group", id: groupId }],
  }),

  createGroup: builder.mutation<Group, { userId: number; groupName: string }>({
    queryFn: async ({ userId, groupName }) => {
      try {
        const data = await supabaseApi.groups.createGroup(userId, groupName);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: ["Group"],
  }),

  updateGroup: builder.mutation<Group, { groupId: number; updates: Partial<Pick<Group, "group_name">> }>({
    queryFn: async ({ groupId, updates }) => {
      try {
        const data = await supabaseApi.groups.updateGroup(groupId, updates);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: (_result, _error, { groupId }) => [{ type: "Group", id: groupId }],
  }),

  updateGroupDuplicatedIndices: builder.mutation<Group, { groupId: number; duplicatedIdx: string[] }>({
    queryFn: async ({ groupId, duplicatedIdx }) => {
      try {
        const data = await supabaseApi.groups.updateGroupDuplicatedIndices(groupId, duplicatedIdx);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: (_result, _error, { groupId }) => [{ type: "Group", id: groupId }],
  }),

  deleteGroup: builder.mutation<void, number>({
    queryFn: async (groupId) => {
      try {
        await supabaseApi.groups.deleteGroup(groupId);
        return { data: undefined };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: ["Group", "Student", "Attendance"],
  }),

  updateGroupDurationThreshold: builder.mutation<Group, { groupId: number; durationThreshold: number }>({
    queryFn: async ({ groupId, durationThreshold }) => {
      try {
        const data = await supabaseApi.groups.updateGroupDurationThreshold(groupId, durationThreshold);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags : ["Group"]
  }),
});
