import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { groupEndpoints } from "./groupEndpoints";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Group"],
  endpoints: (builder) => ({
    ...groupEndpoints(builder),
  }),
});

export const {
  // Group hooks
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useUpdateGroupDuplicatedIndicesMutation,
  useDeleteGroupMutation,






} = attendanceApi;
