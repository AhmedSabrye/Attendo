import type { Student } from "../../types/api";
import { handleRpcCall } from "./helpers";
import type {
  OrderUpdate,
  ParsedStudent,
} from "@/components/modals/TemplateManager/TemplateManager";

// ==================== STUDENTS MANAGEMENT ====================

export const studentsApi = {
  // Get all students (optionally filtered by group)
  async getStudents(groupId?: number): Promise<Student[]> {
    try {
      return await handleRpcCall<Student[]>("get_students", {
        p_group_id: groupId || null,
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  // Get single student by ID
  async getStudent(studentId: number): Promise<Student | null> {
    try {
      return await handleRpcCall<Student>("get_student_by_id", {
        p_student_id: studentId,
      });
    } catch (error) {
      console.error("Error fetching student:", error);
      throw error;
    }
  },

  // Create new student
  async createStudent(
    studentData: Omit<
      Student,
      "student_id" | "created_at" | "updated_at" | "Groups"
    >
  ): Promise<Student> {
    try {
      return await handleRpcCall<Student>("create_student", {
        p_group_id: studentData.group_id,
        p_name: studentData.name,
        p_phone_last_3: studentData.phone_last_3,
        p_attendance_alias: studentData.attendance_alias || null,
        p_is_active: studentData.is_active,
        p_order_index: studentData.order_index || null,
      });
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },

  // Update student
  async updateStudent(
    studentId: number,
    updates: Partial<Omit<Student, "student_id" | "created_at" | "Groups">>
  ): Promise<Student> {
    try {
      return await handleRpcCall<Student>("update_student", {
        p_student_id: studentId,
        p_name: updates.name || null,
        p_phone_last_3: updates.phone_last_3 || null,
        p_attendance_alias: updates.attendance_alias || null,
        p_is_active: updates.is_active || null,
        p_order_index: updates.order_index || null,
      });
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  },

  // Toggle student active status
  async toggleStudentStatus(studentId: number): Promise<Student> {
    try {
      return await handleRpcCall<Student>("toggle_student_status", {
        p_student_id: studentId,
      });
    } catch (error) {
      console.error("Error toggling student status:", error);
      throw error;
    }
  },

  // Delete student (cascades to attendance)
  async deleteStudent(studentId: number): Promise<void> {
    try {
      await handleRpcCall<void>("delete_student", { p_student_id: studentId });
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  },

  // ==================== BULK SYNC FROM TEMPLATE ====================
  /**
   * Sync students of a group to match the provided template diff.
   * All work is done in **max 3 queries** (insert + two updates).
   *
   * @returns counts of affected rows
   */
  async syncStudents(params: {
    groupId: number;
    toAdd: ParsedStudent[];
    reactivateIds: number[];
    deactivateIds: number[];
    orderUpdates: OrderUpdate[];
  }): Promise<{
    added: number;
    reactivated: number;
    deactivated: number;
    reordered: number;
  }> {
    try {
      return await handleRpcCall<{
        added: number;
        reactivated: number;
        deactivated: number;
        reordered: number;
      }>("sync_students", {
        p_group_id: params.groupId,
        p_to_add: params.toAdd,
        p_reactivate_ids: params.reactivateIds,
        p_deactivate_ids: params.deactivateIds,
        p_order_updates: params.orderUpdates,
      });
    } catch (error) {
      console.error("Error syncing students:", error);
      throw error;
    }
  },
};
