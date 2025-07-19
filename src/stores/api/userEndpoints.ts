import type { EndpointBuilder } from "@reduxjs/toolkit/query/react";
import supabaseApi, { type User } from "../../utils/api";

export const userEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  // ==================== USER ENDPOINTS ====================
  getCurrentUser: builder.query<User | null, any>({
    queryFn: async (authUser) => {
      try {
        const data = await supabaseApi.user.getCurrentUser(authUser);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: ["User"],
  }),

  updateUser: builder.mutation<
    User,
    { userId: number; updates: Partial<Pick<User, "username" | "email">> }
  >({
    queryFn: async ({ userId, updates }) => {
      try {
        const data = await supabaseApi.user.updateUser(userId, updates);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: ["User"],
  }),
});
