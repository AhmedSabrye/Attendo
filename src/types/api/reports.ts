import type { Student } from "./student";
import type { Attendance } from "./attendance";
import type { Group } from "./group";

export interface AttendanceReport {
  date: string;
  group_id: number;
  group_name: string;
  total_students: number;
  attended_count: number;
  partial_count: number;
  absent_count: number;
  attendance_rate: number;
  session_id: number;
  students: Array<{
    student_id: number;
    name: string;
    duration_minutes: number;
    attended: boolean;
    status: "attended" | "partial" | "absent";
    order_index?: number;
  }>;
}

export interface StudentAttendanceHistory {
  student: Student;
  attendance_records: Attendance[];
  stats: {
    total_sessions: number;
    attended_sessions: number;
    partial_sessions: number;
    absent_sessions: number;
    attendance_rate: number;
    avg_duration: number;
  };
}

export interface SessionReport {
  session: {
    group: Group;
    date: string;
    totalStudents: number;
  };
  attendance: Attendance[];
  statistics: {
    totalStudents: number;
    attendedCount: number;
    partialCount: number;
    absentCount: number;
    attendanceRate: number;
    averageDuration: number;
  };
}
