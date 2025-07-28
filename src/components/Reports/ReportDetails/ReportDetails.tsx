import {
  HiArrowLeft,
  HiCalendar
} from "react-icons/hi2";
import { Link, useParams } from "react-router";
import SummaryCards from "./SummaryCards";
import {
  useGetReportByIdQuery,
  useUpdateAttendanceMutation,
} from "@/stores/api";
import AttendanceToggleModal from "@/components/modals/AttendanceToggleModal";
import { useState } from "react";
import type { AttendanceReport } from "@/types/api";
import ReportDetailsTable from "./ReportDetailsTable";
import ReportDetailsActionButtons from "./ReportDetailsActionButtons";


export default function ReportDetails() {
  const { groupId, reportId } = useParams();

  const numericGroupId = groupId ? Number(groupId) : undefined;
  const [order, setOrder] = useState<string>("template");
  function handleOrderChange(order: string) {
    setOrder(order);
  }
  const {
    data: report,
    isLoading,
    isError,
    refetch,
  } = useGetReportByIdQuery(
    numericGroupId && reportId
      ? {
          groupId: numericGroupId,
          sessionId: Number(reportId),
        }
      : { groupId: 0, sessionId: 0 },
    { skip: !numericGroupId || !reportId }
  );
  const attendedCount = report?.students?.filter((r) => r.attended).length ?? 0;
  const absentCount = report?.students?.filter((r) => !r.attended).length ?? 0;
  const totalCount = report?.students?.length ?? 0;

  const dateParam = report?.date ?? "";

  const orderedStudents = [...(report?.students ?? [])].sort((a, b) => {
    if (order === "alphabetical") {
      return a.name.localeCompare(b.name);
    }
    return (a.order_index ?? 0) - (b.order_index ?? 0);
  });

  const [selectedStudent, setSelectedStudent] = useState<
    AttendanceReport["students"][number] | null
  >(null);
  const [updateAttendance, { isLoading: isUpdating }] =
    useUpdateAttendanceMutation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 relative flex flex-col md:flex-row  md:px-10 items-center  justify-between text-center gap-4">
        <Link
          to={`/groups/${groupId}/reports`}
          className="p-2  absolute left-2 top-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors z-10"
        >
          <HiArrowLeft className="text-lg text-gray-600" />
        </Link>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-600">
            Attendance Report
          </h3>
          <p className="text-2xl font-semibold text-gray-900">{dateParam}</p>
          {/* Summary Cards */}
          {report && (
            <SummaryCards
              report={report}
              attendedCount={attendedCount}
              absentCount={absentCount}
              totalCount={totalCount}
            />
          )}
        </div>

        {/* Action Buttons */}
        {report && (
          <ReportDetailsActionButtons
            report={report}
            order={order}
            handleOrderChange={handleOrderChange}
          />
        )}
      </div>

      {/* Report Content */}
      <div className="p-3">
        {isLoading && (
          <div className="text-center py-12 text-gray-500">Loading report…</div>
        )}
        {isError && (
          <div className="text-center py-12 text-red-500">
            Failed to load report.
          </div>
        )}

        {/* Report Main Content */}
        {report && (
          <>
            {/* Attendance Table */}
            <ReportDetailsTable
              orderedStudents={orderedStudents}
              setSelectedStudent={setSelectedStudent}
            />

            {/* Footer */}
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <HiCalendar className="text-base" />
                <span>
                  Report generated on {new Date(dateParam).toLocaleDateString()}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Attendance Toggle Modal */}
      {selectedStudent && (
        <AttendanceToggleModal
          student={selectedStudent}
          loading={isUpdating}
          onClose={() => setSelectedStudent(null)}
          onConfirm={async () => {
            if (!numericGroupId) return;
            const makePresent = !selectedStudent.attended;
            const updates = { attended: makePresent, duration_minutes: 0 };

            await updateAttendance({
              groupId: numericGroupId,
              studentId: selectedStudent.student_id,
              sessionId: Number(reportId),
              updates,
            }).unwrap();
            await refetch();
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}
