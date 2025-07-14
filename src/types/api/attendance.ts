export interface Attendance {
  session_id: number;
  group_id: number;
  session_date?: string;
  student_id: number;
  duration_minutes: number;
  attended?: boolean;
  Sessions?: { session_date: string };
  Groups?: { group_name: string };
  Students?: { name: string };
}

export interface BulkAttendanceUpdate {
  student_id: number;
  duration_minutes: number;
  attended: boolean;
  attendance_alias?: string | null;
}
