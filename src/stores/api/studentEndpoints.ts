import type { EndpointBuilder } from "@reduxjs/toolkit/query/react";
import supabaseApi, { type Student } from "../../utils/api";
import type { OrderUpdate, ParsedStudent } from "../../components/modals/TemplateManager/TemplateManager";

export const studentEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  // ==================== STUDENT ENDPOINTS ====================
  getStudents: builder.query<Student[], number | undefined>({
    queryFn: async (groupId) => {
      try {
        const data = await supabaseApi.students.getStudents(groupId);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: ["Student"],
  }),

  getStudent: builder.query<Student | null, number>({
    queryFn: async (studentId) => {
      try {
        const data = await supabaseApi.students.getStudent(studentId);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    providesTags: (_result, _error, studentId) => [{ type: "Student", id: studentId }],
  }),

  createStudent: builder.mutation<Student, Omit<Student, "student_id" | "created_at" | "updated_at" | "Groups">>({
    queryFn: async (studentData) => {
      try {
        const data = await supabaseApi.students.createStudent(studentData);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: ["Student"],
  }),

  updateStudent: builder.mutation<Student, { studentId: number; updates: Partial<Omit<Student, "student_id" | "created_at" | "Groups">> }>({
    queryFn: async ({ studentId, updates }) => {
      try {
        const data = await supabaseApi.students.updateStudent(studentId, updates);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: (_result, _error, { studentId }) => [{ type: "Student", id: studentId }],
  }),

  toggleStudentStatus: builder.mutation<Student, number>({
    queryFn: async (studentId) => {
      try {
        const data = await supabaseApi.students.toggleStudentStatus(studentId);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: (_result, _error, studentId) => [{ type: "Student", id: studentId }],
  }),

  // Bulk sync students (template manager)
  syncStudents: builder.mutation<
    { added: number; reactivated: number; deactivated: number; reordered: number },
    {
      groupId: number;
      toAdd: ParsedStudent[];
      reactivateIds: number[];
      deactivateIds: number[];
      orderUpdates: OrderUpdate[];
    }
  >({
    queryFn: async (params) => {
      try {
        const data = await supabaseApi.students.syncStudents(params);
        return { data };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: ["Student"],
  }),

  deleteStudent: builder.mutation<void, number>({
    queryFn: async (studentId) => {
      try {
        await supabaseApi.students.deleteStudent(studentId);
        return { data: undefined };
      } catch (error) {
        return { error: { status: "FETCH_ERROR", error: String(error) } };
      }
    },
    invalidatesTags: ["Student", "Attendance"],
  }),
});
