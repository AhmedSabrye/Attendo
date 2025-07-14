import { groupsApi } from "./groupsApi";
import { studentsApi } from "./studentsApi";
import { attendanceApi } from "./attendanceApi";
import type { AttendanceReport, SessionReport } from "../../types/api";
import { handleRpcCall } from "./helpers";

// ==================== REPORTS AND ANALYTICS ====================

export const reportsApi = {
  // Get all reports for a specific group (no date constraints)
  async getAllReportsForGroup(
    groupId: number,
    groupName: string
  ): Promise<AttendanceReport[]> {
    try {
      return await handleRpcCall<AttendanceReport[]>(
        "get_all_reports_for_group",
        {
          p_group_id: groupId,
          p_group_name: groupName,
        }
      );
    } catch (error) {
      console.error("Error fetching all reports for group:", error);
      throw error;
    }
  },

  // Get attendance reports for a date range using the Sessions table (single query)
  async getReportsForDateRange(
    groupId: number,
    startDate: string,
    endDate: string
  ): Promise<AttendanceReport[]> {
    try {
      return await handleRpcCall<AttendanceReport[]>(
        "get_reports_for_date_range",
        {
          p_group_id: groupId,
          p_start_date: startDate,
          p_end_date: endDate,
        }
      );
    } catch (error) {
      console.error("Error fetching reports for date range:", error);
      throw error;
    }
  },

  // Get specific report for a specific date and group
  async getReportById(
    groupId: number,
    sessionId: number
  ): Promise<AttendanceReport | null> {
    try {
      return await handleRpcCall<AttendanceReport>("get_report_by_id", {
        p_group_id: groupId,
        p_session_id: sessionId,
      });
    } catch (error) {
      console.error("Error fetching report for date:", error);
      throw error;
    }
  },

  // Generate simple session report for a specific group and date
  async generateSessionReport(
    groupId: number,
    date: string
  ): Promise<SessionReport | null> {
    try {
      // Fetch core data individually to avoid complex nested filters
      const [groupData, studentsData, attendance] = await Promise.all([
        groupsApi.getGroup(groupId),
        studentsApi.getStudents(groupId),
        attendanceApi.getAttendanceByDate(groupId, date),
      ]);

      if (!groupData) return null;

      // Only keep active students
      const activeStudents = studentsData.filter((s) => s.is_active);

      const totalStudents = activeStudents.length;
      const attendedCount = attendance.filter((a) => a.attended).length;
      const partialCount = attendance.filter(
        (a) => !a.attended && a.duration_minutes > 0
      ).length;
      const absentCount = totalStudents - attendance.length;

      const averageDuration =
        attendance.length > 0
          ? attendance.reduce((sum, a) => sum + a.duration_minutes, 0) /
            attendance.length
          : 0;

      return {
        session: {
          group: groupData,
          date,
          totalStudents,
        },
        attendance,
        statistics: {
          totalStudents,
          attendedCount,
          partialCount,
          absentCount,
          attendanceRate:
            totalStudents > 0
              ? Math.round((attendedCount / totalStudents) * 10000) / 100
              : 0,
          averageDuration: Math.round(averageDuration * 100) / 100,
        },
      };
    } catch (error) {
      console.error("Error generating session report:", error);
      throw error;
    }
  },
};
