import { HiArrowLeft, HiCalendar, HiCheckCircle, HiXCircle, HiUser } from "react-icons/hi2";
import { Link } from "react-router";
import ReportSummary from "./ReportSummary";
import SummaryCards from "./SummaryCards";

const report = {
  id: 1,
  date: "2024-01-01",
  summary: { total: 100, matched: 90, unmatched: 10, conflicts: 0 },
};

const groupId = 2;

const attendanceList = [
  {
    studentId: 1,
    studentName: "John Doe",
    phone: "1234567890",
    status: "present",
    duration: 60,
    matchType: "exact",
  },
];


const attendanceRate = report.summary.total > 0 ? `${Math.round((report.summary.matched / report.summary.total) * 100)}%` : "N/A";

const summaryCards = [
  {
    label: "Total",
    value: report.summary.total.toString(),
    Icon: HiUser,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    label: "Present",
    value: report.summary.matched.toString(),
    Icon: HiCheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    label: "Absent",
    value: report.summary.unmatched.toString(),
    Icon: HiXCircle,
    bgColor: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    label: "Rate",
    value: attendanceRate,
    Icon: null,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
];

export default function ReportDetails() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link to={`/groups/${groupId}/reports`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <HiArrowLeft className="text-lg text-gray-600" />
          </Link>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-600">Attendance Report</h3>
            <p className="text-2xl font-semibold text-gray-900">{report.date}</p>
          </div>

          {/* Summary Stats */}
          <SummaryCards summaryCards={summaryCards} />
        </div>
      </div>

      {/* Report Summary */}
      {/* it is making so much noise, so i'm not using it for now */}
      {/* {report.summary && <ReportSummary report={report} />} */}

      {/* Detailed Attendance Table */}
      <div className="p-3">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceList
                  .sort((a, b) => {
                    // Sort by status (present first), then by name
                    if (a.status !== b.status) {
                      const statusOrder: { [key: string]: number } = { present: 0, partial: 1, absent: 2 };
                      return statusOrder[a.status] - statusOrder[b.status];
                    }
                    return a.studentName.localeCompare(b.studentName);
                  })
                  .map((attendance) => (
                    <tr
                      key={attendance.studentId}
                      className={`hover:bg-gray-50 ${
                        attendance.status === "present" ? "bg-green-50/30" : attendance.status === "partial" ? "bg-yellow-50/30" : "bg-red-50/30"
                      }`}
                    >
                      <td className="px-5 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-green-50 text-green-600`}>
                            <span
                              className={`font-semibold text-sm ${
                                attendance.status === "present"
                                  ? "text-green-600"
                                  : attendance.status === "partial"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {attendance.studentName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{attendance.studentName}</div>
                            <div className="text-sm text-gray-500">ID: {attendance.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{attendance.phone || "N/A"}</div>
                      </td>
                      <td className="px-5 py-2 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <HiCheckCircle className="text-xl text-green-600" />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600`}>
                            {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-2">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {attendance.duration && <div className="text-xs text-gray-600 mb-1">Duration: {attendance.duration}m</div>}
                          {attendance.matchType && <div className="text-xs text-blue-600 mb-1">Match: {attendance.matchType.replace("_", " ")}</div>}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiCalendar className="text-base" />
            <span>
              Report generated on {new Date(report.date).toLocaleDateString()}
              at {new Date(report.date).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
