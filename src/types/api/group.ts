export interface Group {
  group_id: number;
  group_name: string;
  user_id: number;
  created_at: string;
  duplicated_idx: string[];
  Users?: { username: string };
}
