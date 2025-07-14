import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { groupEndpoints } from "./groupEndpoints";
import { studentEndpoints } from "./studentEndpoints";
import { userEndpoints } from "./userEndpoints";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Group"],
  endpoints: (builder) => ({
    ...groupEndpoints(builder),
    ...studentEndpoints(builder),
    ...userEndpoints(builder),
  }),
});

export const {
    // User hooks
    useGetCurrentUserQuery,
    useUpdateUserMutation,

  // Group hooks
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useUpdateGroupDuplicatedIndicesMutation,
  useDeleteGroupMutation,


  // Student hooks
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useToggleStudentStatusMutation,
  useSyncStudentsMutation,
  useDeleteStudentMutation,




} = attendanceApi;
