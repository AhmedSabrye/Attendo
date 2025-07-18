import type { EndpointBuilder } from "@reduxjs/toolkit/query/react";
import supabaseApi, { type Attendance, type BulkAttendanceUpdate } from "../../utils/api";

export const attendanceEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  // ==================== ATTENDANCE ENDPOINTS ====================
  getAttendance: builder.query<
    Attendance[],
    | {
        groupId?: number;
        studentId?: number;
        dateFrom?: string;
        dateTo?: string;
        attended?: boolean;
      }
    | undefined
  >({
    queryFn: async (filters) => {
      try {
        const data = await supabaseApi.attendance.getAttendance(filters);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: ["Attendance"],
  }),

  getAttendanceByGroup: builder.query<Attendance[], { groupId: number }>({
    queryFn: async ({ groupId }) => {
      try {
        const data = await supabaseApi.attendance.getAttendanceByGroup(groupId);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: ["Attendance"],
  }),

  getAttendanceByDate: builder.query<Attendance[], { groupId: number; date: string }>({
    queryFn: async ({ groupId, date }) => {
      try {
        const data = await supabaseApi.attendance.getAttendanceByDate(groupId, date);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: ["Attendance"],
  }),


  bulkUpdateAttendance: builder.mutation<
    {
      success: boolean;
      attendedCount: number;
      partialCount: number;
      absentCount: number;
      error?: any;
    },
    {
      groupId: number;
      attendanceDate: string;
      bulkData: BulkAttendanceUpdate[];
    }
  >({
    queryFn: async ({ groupId, attendanceDate, bulkData }) => {
      try {
        const data = await supabaseApi.attendance.bulkUpdateAttendance(groupId, attendanceDate, bulkData);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: ["Attendance", "Report", "Student"],
  }),

  updateAttendance: builder.mutation<
    Attendance,
    {
      groupId: number;
      studentId: number;
      sessionId: number;
      updates: Partial<Pick<Attendance, "duration_minutes" | "attended">>;
    }
  >({
    queryFn: async ({ studentId, sessionId, updates }) => {
      try {
        const data = await supabaseApi.attendance.updateAttendance(studentId, sessionId, updates);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: ["Attendance"],
  }),
});
