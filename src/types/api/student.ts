export interface Student {
  student_id: number;
  group_id: number;
  name: string;
  attendance_alias?: string | null;
  phone_last_3?: string;
  is_active: boolean;
  order_index?: number;
  created_at: string;
  updated_at: string;
  Groups?: { group_name: string };
  isMatched?: boolean;
  isAbsent?: boolean;
}
