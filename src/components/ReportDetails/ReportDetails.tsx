import {
  HiArrowLeft,
  HiCalendar,
  HiCheckCircle,
  HiXCircle,
  HiUser,
} from "react-icons/hi2";
import { Link, useParams } from "react-router";
import SummaryCards from "./SummaryCards";
import {
  useGetReportByIdQuery,
  useUpdateAttendanceMutation,
} from "../../../stores/api";
import AttendanceToggleModal from "../../modals/AttendanceToggleModal";
import { useState } from "react";
import { copyToClipboard } from "../../../utils/copyToClipboard";

function getSummaryCards(
  report: any,
  attendedCount: number,
  absentCount: number,
  totalCount: number
) {
  if (!report) return [];

  return [
    {
      label: "Total",
      value: totalCount.toString(),
      Icon: HiUser,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Attended",
      value: attendedCount.toString(),
      Icon: HiCheckCircle,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Absent",
      value: absentCount.toString(),
      Icon: HiXCircle,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      label: "Rate",
      value: `${((attendedCount / totalCount) * 100).toFixed(0)}%`,
      Icon: null,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
  ];
}

// Utility to format status to color classes
const statusClasses: Record<
  string,
  { row: string; text: string; bgInitial: string }
> = {
  attended: {
    row: "bg-green-50/30",
    text: "text-green-600",
    bgInitial: "bg-green-50",
  },
  partial: {
    row: "bg-yellow-50/30",
    text: "text-yellow-600",
    bgInitial: "bg-yellow-50",
  },
  absent: { row: "bg-red-50/30", text: "text-red-600", bgInitial: "bg-red-50" },
};

export default function ReportDetails() {
  const { groupId, reportId } = useParams();

  const numericGroupId = groupId ? Number(groupId) : undefined;
  const [order, setOrder] = useState<string>("alphabetical");
  const [isCopied, setIsCopied] = useState<boolean>(false);
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
  const attendedCount =
    report?.students?.filter((r: any) => r.attended).length ?? 0;
  const absentCount =
    report?.students?.filter((r: any) => !r.attended).length ?? 0;
  const totalCount = report?.students?.length ?? 0;

  const dateParam = report?.date ?? "";

  const orderedStudents = [...(report?.students ?? [])].sort(
    (a: any, b: any) => {
      if (order === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      return a.order_index - b.order_index;
    }
  );

  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [updateAttendance, { isLoading: isUpdating }] =
    useUpdateAttendanceMutation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 relative">
        <div className="flex flex-col md:flex-row  md:px-10 items-center  justify-between text-center gap-4">
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
            {report && (
              <SummaryCards
                summaryCards={getSummaryCards(
                  report,
                  attendedCount,
                  absentCount,
                  totalCount
                )}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-col">
            <button
              className={`bg-blue-500 text-white px-4 py-2 rounded-md transition-colors cursor-pointer text-sm w-full  duration-500 ${
                isCopied ? "bg-green-500" : ""
              }`}
              onClick={async () => {
                const success = await copyToClipboard(report);
                if (success) {
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                } else {
                  setIsCopied(false);
                }
              }}
            >
              {isCopied ? "Copied!" : "Copy to Google Sheets"}
            </button>
            <div className="flex items-center justify-around gap-2 w-full">
              <label
                htmlFor="order"
                className="text-sm text-gray-600 font-semibold min-w-fit"
              >
                Order by
              </label>
              <select
                id="order"
                className="w-full text-sm text-gray-600 bg-gray-100 rounded-md p-2"
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value);
                }}
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="template">Same order as sheet</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3">
        {isLoading && (
          <div className="text-center py-12 text-gray-500">Loading report…</div>
        )}
        {isError && (
          <div className="text-center py-12 text-red-500">
            Failed to load report.
          </div>
        )}

        {report && (
          <>
            {/* Attendance Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderedStudents.map((student: any) => {
                      const style = statusClasses[student.status];
                      return (
                        <tr
                          key={student.student_id}
                          className={`hover:bg-gray-50 cursor-pointer active:bg-gray-100 ${style.row}`}
                          onDoubleClick={() => setSelectedStudent(student)}
                        >
                          <td className="px-3 md:px-5 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div
                                className={`size-8 hidden md:flex  rounded-full  items-center justify-center  ${style.bgInitial} ${style.text}`}
                              >
                                <span className="font-semibold text-sm">
                                  {student.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-xs md:text-sm font-medium text-gray-900">
                                  {student.name
                                    .split(" ")
                                    .slice(0, 2)
                                    .join(" ")}
                                </div>
                                <div className="text-xs md:text-sm text-gray-500">
                                  ID: {student.student_id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 md:px-5 py-2 whitespace-nowrap text-center">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${style.bgInitial} ${style.text}`}
                            >
                              {student.status.charAt(0).toUpperCase() +
                                student.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-3 md:px-5 py-2">
                            <div className="text-sm text-gray-900 max-w-xs">
                              <div className="text-xs text-gray-600 mb-1">
                                Duration: {student.duration_minutes}m
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

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

      {selectedStudent && (
        <AttendanceToggleModal
          student={selectedStudent}
          loading={isUpdating}
          onClose={() => setSelectedStudent(null)}
          onConfirm={async () => {
            if (!numericGroupId) return;
            const makePresent = !selectedStudent.attended;
            const updates: any = { attended: makePresent };
            if (!makePresent) updates.duration_minutes = 0;

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
