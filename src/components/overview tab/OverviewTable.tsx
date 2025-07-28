import {
  type Attendance,
  type AttendanceReport,
  type Student,
} from "@/utils/api";
import { useMemo } from "react";
import { HiCheck, HiXMark } from "react-icons/hi2";
import type { SelectedStudent } from "./Overview";

interface OverviewTable {
  attendance: Attendance[] | undefined;
  totalSessions: number;
  students: Student[] | undefined;
  groupId: string | undefined;
  reports: AttendanceReport[] | undefined;
  handleSelectingStudent: (student: SelectedStudent) => void;
}

export default function OverviewTable({
  attendance,
  totalSessions,
  students,
  reports,
  handleSelectingStudent,
}: OverviewTable) {
  // Build quick lookup: studentId -> { date -> record }
  const attendanceMap = useMemo(() => {
    const map = new Map<number, Record<string, Attendance>>();
    (attendance ?? []).forEach((rec) => {
      if (!map.has(rec.student_id)) {
        map.set(rec.student_id, {});
      }
      map.get(rec.student_id)![rec.session_date!] = rec;
    });
    return map;
  }, [attendance]);
  const sortedReports = [...(reports ?? [])]?.reverse();

  return (
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200  bg-white z-30 sticky top-0">
          <th className="text-center py-3 px-2 font-medium text-gray-900 bg-white min-w-[40px] text-xs">
            #
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-900  sticky left-0 top-0 z-30 bg-white min-w-[100px] max-w-[120px]">
            Student
          </th>
          {totalSessions > 0 && (
            <th className="text-center py-3 px-2 font-medium  text-gray-900 min-w-[80px] bg-white text-xs">
              Rate
            </th>
          )}
          {sortedReports?.map((report, index) => (
            <th className="text-center py-3 px-2 font-medium  text-gray-900 min-w-[80px] text-xs">
              <div className="flex flex-col items-center">
                <span className=" text-gray-600">
                  {new Date(report.date!).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className=" text-gray-500">Session {index + 1}</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {students!.map((student: Student, index: number) => {
          // Compute rate
          const studentRecords = attendanceMap.get(student.student_id) ?? {};
          const attendedCount = Object.values(studentRecords).filter(
            (rec) => getStatus(rec).status === "attended"
          ).length;
          const attendanceRate =
            totalSessions > 0
              ? Math.round((attendedCount / totalSessions) * 100)
              : 0;

          return (
            <tr key={student.student_id} className="hover:bg-gray-50">
              {/* Number Column */}
              <td className="text-center py-4 px-2 bg-white z-10 text-xs text-gray-500 font-medium">
                {index + 1}
              </td>
              {/* Student Info */}
              <td className=" min-w-[100px] max-w-[150px] py-4 px-4 sticky left-0 bg-white z-10  ">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full  items-center justify-center flex-shrink-0 hidden sm:flex">
                    <span className="font-semibold  text-emerald-600 text-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-xs  text-gray-900 truncate">
                      {student.name.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {student.student_id}
                    </p>
                  </div>
                </div>
              </td>

              {/* Attendance Rate */}
              {totalSessions > 0 && (
                <td className="py-4  px-2 bg-white z-10 text-center flex flex-col items-center">
                  <span
                    className={`text-sm font-medium ${
                      attendanceRate >= 80
                        ? "text-green-600"
                        : attendanceRate >= 70
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {attendanceRate}%
                  </span>
                  <div className="w-10 h-1 md:h-2 md:w-15 bg-gray-200 rounded-full mt-1">
                    <div
                      className={`h-full rounded-full ${
                        attendanceRate >= 80
                          ? "bg-green-500"
                          : attendanceRate >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${attendanceRate}%` }}
                    />
                  </div>
                </td>
              )}

              {/* Attendance Status for the student for each session */}
              {sortedReports?.map((report) => {
                const record = attendanceMap.get(student.student_id)?.[
                  report.date!
                ];
                const status = getStatus(record);

                // problem just look at it and see what you got.
                return (
                  <td
                    className="py-4 px-2 text-center cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                    onDoubleClick={() => {
                      if (report.date) {
                        handleSelectingStudent({
                          attended: record?.attended ?? false,
                          student: student,
                          sessionId: report.session_id,
                          sessionDate: report.date,
                        });
                      }
                    }}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        config(status.status, status.duration).bg
                      } ${config(status.status, status.duration).text}`}
                    >
                      {config(status.status, status.duration).icon}
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const config = (thing: "attended" | "partial" | "absent", duration: number) => {
  switch (thing) {
    case "attended":
      return {
        bg: "bg-green-50",
        text: "text-green-600",
        icon: <HiCheck className="text-sm" />,
      };
    case "partial":
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        icon: <span className="text-xs font-bold">{duration}</span>,
      };
    case "absent":
      return {
        bg: "bg-red-50",
        text: "text-red-600",
        icon: <HiXMark className="text-sm" />,
      };
  }
};

// Helpers

const getAttendanceStatus = (
  durationMinutes: number
): "attended" | "partial" | "absent" => {
  if (durationMinutes > 0) return "partial";
  return "absent";
};
const getStatus = (
  record?: Attendance
): { status: "attended" | "partial" | "absent"; duration: number } => {
  if (!record) return { status: "absent", duration: 0 };
  if (record.attended)
    return { status: "attended", duration: record.duration_minutes };
  return {
    status: getAttendanceStatus(record.duration_minutes),
    duration: record.duration_minutes,
  };
};
