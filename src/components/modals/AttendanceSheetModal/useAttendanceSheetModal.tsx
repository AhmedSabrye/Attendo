import { useBulkUpdateAttendanceMutation, useGetGroupQuery, useGetStudentsQuery } from "@/stores/api";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function useAttendanceSheetModal() {
  const [bulkUpdateAttendance] = useBulkUpdateAttendanceMutation();
  const { groupId } = useParams();
  const { data: groupStudents } = useGetStudentsQuery(groupId ? Number(groupId) : undefined);
  const { data: groupData } = useGetGroupQuery(groupId ? Number(groupId) : 0, { skip: !groupId });
  const [file, setFile] = useState<File | null>(null);
  const activeGroupStudents = groupStudents?.filter((student) => student.is_active);

  return {
    bulkUpdateAttendance,
    activeGroupStudents,
    groupData,
    groupId,
    file,
    setFile,
  };
}
