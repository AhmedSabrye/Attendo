import { useState } from "react";
import { useParams } from "react-router";
import {
  useGetStudentsQuery,
  useUpdateAttendanceMutation,
  useGetAttendanceByGroupQuery,
  useGetAllReportsForGroupQuery,
} from "../../stores/api";
import type { Student } from "../../utils/api";

export interface SelectedStudent {
  attended: boolean;
  student: Student;
  sessionDate: string;
  sessionId: number;
}

export function useOverview() {
  const { groupId } = useParams();
  const numericGroupId = groupId ? parseInt(groupId, 10) : undefined;

  // Data fetching
  const { data: allStudents, isLoading: studentsLoading } =
    useGetStudentsQuery(numericGroupId);

  const { data: reports } = useGetAllReportsForGroupQuery({
    groupId: numericGroupId ?? 0,
    groupName: "",
  });

  const { data: attendance, isLoading: attendanceLoading } =
    useGetAttendanceByGroupQuery({ groupId: numericGroupId ?? 0 });

  const [updateAttendance, { isLoading: isUpdating }] =
    useUpdateAttendanceMutation();

  // State management
  const [selectedStudent, setSelectedStudent] =
    useState<SelectedStudent | null>(null);

  // Derived values
  const students = allStudents
    ?.filter((s) => s.is_active)
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const totalStudents = students?.length ?? 0;
  const totalSessions = reports?.length ?? 0;
  const isLoading = studentsLoading || attendanceLoading;

  // Event handlers
  const handleSelectingStudent = (student: SelectedStudent) => {
    setSelectedStudent(student);
  };

  const toggleStudentSessionStatus = async (
    selectedStudent: SelectedStudent
  ) => {
    if (!numericGroupId) return;

    const makePresent = !selectedStudent.attended;
    const updates: any = { attended: makePresent };

    if (!makePresent) {
      updates.duration_minutes = 0;
    }

    await updateAttendance({
      groupId: numericGroupId,
      studentId: selectedStudent.student.student_id,
      sessionId: selectedStudent.sessionId,
      updates,
    }).unwrap();

    setSelectedStudent(null);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  return {
    // Data
    students,
    attendance,
    reports,
    groupId,

    // Derived values
    totalStudents,
    totalSessions,
    isLoading,
    isUpdating,

    // State
    selectedStudent,

    // Event handlers
    handleSelectingStudent,
    toggleStudentSessionStatus,
    closeModal,
  };
}
