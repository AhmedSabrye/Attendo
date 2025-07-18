import { useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  useGetStudentsQuery,
  useUpdateAttendanceMutation,
  useGetAttendanceByGroupQuery,
  useGetAllReportsForGroupQuery,
} from "../../stores/api";
import type { Student } from "../../utils/api";

import OverviewLegend from "./OverviewLegend";
import OverviewPlaceholder from "./OverviewPlaceholder";
import StatsCards from "./StatsCards";
import AttendanceToggleModal from "../modals/AttendanceToggleModal";
import { HashLoader } from "react-spinners";
import OverviewTable from "./OverviewTable";

export interface SelectedStudent {
  attended: boolean;
  student: Student;
  sessionDate: string;
  sessionId: number;
}

export default function OverviewTab() {
  const { groupId } = useParams();
  const numericGroupId = groupId ? parseInt(groupId, 10) : undefined;
  // Fetch data
  const { data: allStudents, isLoading: studentsLoading } =
    useGetStudentsQuery(numericGroupId);
  const students = allStudents
    ?.filter((s) => s.is_active)
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));


    const {data: reports} = useGetAllReportsForGroupQuery({groupId: numericGroupId ?? 0, groupName: ""})
  const { data: attendance, isLoading: attendanceLoading } =
    useGetAttendanceByGroupQuery({ groupId: numericGroupId ?? 0 });
  const [updateAttendance, { isLoading: isUpdating }] =
    useUpdateAttendanceMutation();
  const [selectedStudent, setSelectedStudent] =
    useState<SelectedStudent | null>(null);

  function handleSelectingStudent(student: SelectedStudent) {
    setSelectedStudent(student);
  }

  const totalStudents = students?.length ?? 0;
  const totalSessions = reports?.length ?? 0;

  const isLoading = studentsLoading || attendanceLoading;

  return (
    <div className="mb-10">
      <div className="mb-6">
        <StatsCards
          loading={isLoading}
          totalStudents={totalStudents}
          totalSessions={totalSessions}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Students Attendance Matrix
              </h3>
            </div>
          </div>
        </div>

        {/* Attendance Matrix */}
        <div className="md:p-3">
          {totalStudents > 0 ? (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <OverviewTable
                attendance={attendance}
                totalSessions={totalSessions}
                students={students}
                groupId={groupId}
                reports={reports}
                handleSelectingStudent={handleSelectingStudent}
              />
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center min-h-45">
              <HashLoader color="#10b981" />
            </div>
          ) : (
            <OverviewPlaceholder />
          )}
        </div>

        {totalStudents > 0 && totalSessions > 0 && <OverviewLegend />}
      </div>
      {selectedStudent && (
        <AttendanceToggleModal
          student={{
            name: selectedStudent.student.name,
            attended: selectedStudent.attended,
          }}
          loading={isUpdating}
          onClose={() => setSelectedStudent(null)}
          onConfirm={async () => {
            if (!numericGroupId) return;
            const makePresent = !selectedStudent.attended;
            const updates: any = { attended: makePresent };
            if (!makePresent) updates.duration_minutes = 0;

            await updateAttendance({
              groupId: numericGroupId,
              studentId: selectedStudent.student.student_id,
              sessionId: selectedStudent.sessionId,
              updates,
            }).unwrap();
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}
