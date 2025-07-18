import type { EndpointBuilder } from "@reduxjs/toolkit/query/react";
import supabaseApi, { type AttendanceReport } from "../../utils/api";

export const reportEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  // ==================== REPORTS ENDPOINTS ====================
  getReportById: builder.query<AttendanceReport | null, { groupId: number; sessionId: number }>({
    queryFn: async ({ groupId, sessionId }) => {
      try {
        const data = await supabaseApi.reports.getReportById(groupId, sessionId);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: ["Report"],
  }),

  getAllReportsForGroup: builder.query<AttendanceReport[], { groupId: number; groupName: string }>({
    queryFn: async ({ groupId, groupName }) => {
      try {
        const data = await supabaseApi.reports.getAllReportsForGroup(groupId, groupName);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: ["Report"],
  }),

  getReportsForDateRange: builder.query<AttendanceReport[], { groupId: number; startDate: string; endDate: string }>({
    queryFn: async ({ groupId, startDate, endDate }) => {
      try {
        const data = await supabaseApi.reports.getReportsForDateRange(groupId, startDate, endDate);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: ["Report"],
  }),
});
