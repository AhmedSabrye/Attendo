import { HiCalendar, HiCheckCircle, HiXCircle, HiEye } from "react-icons/hi2";
import { Link } from "react-router";

const attendanceRecords = [
  { id: 1, date: "2024-01-01", summary: { unmatched: 1, conflicts: 0 }, templateVersion: 1 },
  { id: 2, date: "2024-01-02", summary: { unmatched: 0, conflicts: 1 }, templateVersion: 1 },
  { id: 3, date: "2024-01-03", summary: { unmatched: 0, conflicts: 0 }, templateVersion: 1 },
];

const group = {
  id: 2,
  template: {
    students: [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Alice Johnson" },
    ],
  },
};

export default function ReportsList() {
  // const [selectedReport, setSelectedReport] = useState(null);

  // const handleBackToList = () => {
  // setSelectedReport(null);
  // };

  // if (selectedReport) {
  //   return <AttendanceReportDetail report={selectedReport} group={group} onBack={handleBackToList} />;
  // }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Reports</h3>
      </div>

      <div className="p-2 max-h-[600px] overflow-y-auto">
        {attendanceRecords.length > 0 ? (
          <div className="space-y-3">
            {[...attendanceRecords]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record) => {
                return (
                  <Link
                    key={record.id}
                    to={`/groups/${group.id}/reports/${record.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <HiCalendar className="text-xl text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {record.summary.unmatched} unmatched, {record.summary.conflicts} conflicts
                        </p>
                        {record.summary && (
                          <p className="text-xs text-gray-500">
                            {record.summary.unmatched > 0 && `${record.summary.unmatched} unmatched • `}
                            {record.summary.conflicts > 0 && `${record.summary.conflicts} conflicts • `}
                            Template v{record.templateVersion || 1}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Attendance Rate */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">100%</p>
                        <p className="text-xs text-gray-500">Attendance</p>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-green-600">
                          <HiCheckCircle className="text-sm" />
                          <span className="text-sm font-medium">{record.summary.unmatched}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600">
                          <HiXCircle className="text-sm" />
                          <span className="text-sm font-medium">{record.summary.conflicts}</span>
                        </div>
                      </div>

                      {/* View Icon */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <HiEye className="text-lg text-gray-400" />
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <HiCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No attendance reports yet</p>
            <p className="text-sm text-gray-400">Use the "Take Attendance" button to process CSV files and generate reports</p>
          </div>
        )}
      </div>
    </div>
  );
}
