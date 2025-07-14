import { supabase } from "../../lib/supabaseClient";
import type { Attendance, BulkAttendanceUpdate } from "../../types/api";
import { handleRpcCall } from "./helpers";

// ==================== ATTENDANCE MANAGEMENT ====================

export const attendanceApi = {
  // Get attendance records (with optional filters) – joins Sessions to filter by date range
  async getAttendance(filters?: {
    groupId?: number;
    studentId?: number;
    dateFrom?: string;
    dateTo?: string;
    attended?: boolean;
  }): Promise<Attendance[]> {
    try {
      return await handleRpcCall<Attendance[]>("get_attendance", {
        p_group_id: filters?.groupId || null,
        p_student_id: filters?.studentId || null,
        p_date_from: filters?.dateFrom || null,
        p_date_to: filters?.dateTo || null,
        p_attended: filters?.attended || null,
      });
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  },

  // Get attendance for specific date and group
  async getAttendanceByDate(
    groupId: number,
    date: string
  ): Promise<Attendance[]> {
    try {
      return await handleRpcCall<Attendance[]>("get_attendance_by_date", {
        p_group_id: groupId,
        p_date: date,
      });
    } catch (error) {
      console.error("Error fetching attendance by date:", error);
      throw error;
    }
  },

  // Get attendance for specific group
  async getAttendanceByGroup(groupId: number): Promise<Attendance[]> {
    try {
      return await handleRpcCall<Attendance[]>("get_attendance_by_group", {
        p_group_id: groupId,
      });
    } catch (error) {
      console.error("Error fetching attendance by group:", error);
      throw error;
    }
  },


  async bulkUpdateAttendance(
    groupId: number,
    sessionDate: string,
    bulkData: BulkAttendanceUpdate[]
  ): Promise<{
    success: boolean;
    attendedCount: number;
    partialCount: number;
    absentCount: number;
    error?: any;
  }> {
    try {
      // Call the database function
      const { data } = await supabase.rpc("bulk_update_attendance", {
        p_group_id: groupId,
        p_session_date: sessionDate,
        p_bulk_data: bulkData,
      });

      // Parse the response from the database function
      const result = data as {
        success: boolean;
        attendedCount: number;
        partialCount: number;
        absentCount: number;
        sessionId?: number;
        error?: string;
      };

      return {
        success: true,
        attendedCount: result.attendedCount,
        partialCount: result.partialCount,
        absentCount: result.absentCount,
      };
    } catch (error) {
      console.error("Bulk attendance update failed:", error);
      return {
        success: false,
        attendedCount: 0,
        partialCount: 0,
        absentCount: 0,
        error,
      };
    }
  },
  // Update single attendance record
  async updateAttendance(
    studentId: number,
    sessionId: number,
    updates: Partial<Pick<Attendance, "duration_minutes" | "attended">>
  ): Promise<Attendance> {
    try {
      return await handleRpcCall<Attendance>("update_attendance", {
        p_student_id: studentId,
        p_session_id: sessionId,
        p_duration_minutes: updates.duration_minutes ?? null,
        p_attended: updates.attended ?? null,
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
      throw error;
    }
  },
};
