import { HiCheck } from "react-icons/hi2";
import OverviewLegend from "./OverviewLegend";
import OverviewPlaceholder from "./OverviewPlaceholder";
import StatsCards from "./StatsCards";

const students = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
];

const sortedReports = [
  { id: 1, date: "2024-01-01" },
  { id: 2, date: "2024-01-02" },
  { id: 3, date: "2024-01-03" },
];

export default function OverviewTab() {
  return (
    <>
      <div className="mb-6">
        <StatsCards />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Students Attendance Matrix</h3>
            </div>
          </div>
        </div>

        {/* Attendance Matrix */}
        <div className="p-3">
          {students.length > 0 ? (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 sticky left-0 bg-white z-10 min-w-[200px]">Student</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-900 min-w-[80px] sticky left-52 bg-white z-10">Rate</th>
                    {sortedReports.map((report, index) => (
                      <th key={report.id} className="text-center py-3 px-2 font-medium text-gray-900 min-w-[80px]">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-600">
                            {new Date(report.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-xs text-gray-500">Session {index + 1}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => {
                    const attendanceRate = 80;

                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        {/* Student Info */}
                        <td className="py-4 px-4 sticky left-0 bg-white z-10 ">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="font-semibold text-emerald-600 text-sm">{student.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{student.name}</p>
                              <p className="text-xs text-gray-500">ID: {student.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Attendance Rate */}
                        <td className="py-4 px-2 sticky left-52 bg-white z-10 text-center">
                          <div className="flex flex-col items-center">
                            <span
                              className={`text-sm font-medium ${
                                attendanceRate >= 80 ? "text-green-600" : attendanceRate >= 70 ? "text-yellow-600" : "text-red-600"
                              }`}
                            >
                              {attendanceRate}%
                            </span>
                            <div className="w-15 h-2 bg-gray-200 rounded-full mt-1">
                              <div
                                className={`h-full rounded-full ${
                                  attendanceRate >= 80 ? "bg-green-500" : attendanceRate >= 70 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${attendanceRate}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Attendance Status for the student for each session */}
                        {sortedReports.map((report) => {
                          return (
                            <td key={report.id} className="py-4 px-2 text-center">
                              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600`}>
                                <HiCheck className="text-sm" />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <OverviewPlaceholder />
          )}
        </div>

        {students.length > 0 && sortedReports.length > 0 && <OverviewLegend />}
      </div>
    </>
  );
}
