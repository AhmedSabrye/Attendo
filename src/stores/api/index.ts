import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { userEndpoints } from "./userEndpoints";
import { groupEndpoints } from "./groupEndpoints";
import { studentEndpoints } from "./studentEndpoints";
import { attendanceEndpoints } from "./attendanceEndpoints";
import { reportEndpoints } from "./reportEndpoints";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User", "Group", "Student", "Attendance", "Report"],
  endpoints: (builder) => ({
    // Combine all endpoints from different modules
    ...userEndpoints(builder),
    ...groupEndpoints(builder),
    ...studentEndpoints(builder),
    ...attendanceEndpoints(builder),
    ...reportEndpoints(builder),
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
  useUpdateGroupDurationThresholdMutation,
  // Student hooks
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useToggleStudentStatusMutation,
  useSyncStudentsMutation,
  useDeleteStudentMutation,

  // Attendance hooks
  useGetAttendanceQuery,
  useGetAttendanceByGroupQuery,
  useGetAttendanceByDateQuery,
  useBulkUpdateAttendanceMutation,
  useUpdateAttendanceMutation,

  // Reports hooks
  useGetReportByIdQuery,
  useGetAllReportsForGroupQuery,
  useGetReportsForDateRangeQuery,
} = attendanceApi;
