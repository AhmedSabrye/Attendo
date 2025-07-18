import type { AttendanceReport } from "@/types/api";

interface ReportDetailsTableProps {
  orderedStudents: AttendanceReport["students"];
  setSelectedStudent: (student: AttendanceReport["students"][number]) => void;
}
// Utility to format status to color classes
const statusClasses: Record<string, { row: string; text: string; bgInitial: string }> = {
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

export default function ReportDetailsTable({ orderedStudents, setSelectedStudent }: ReportDetailsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orderedStudents.map((student, index) => {
              const style = statusClasses[student.status];
              return (
                <tr
                  key={student.student_id}
                  className={`hover:bg-gray-50 cursor-pointer active:bg-gray-100 ${style.row}`}
                  onDoubleClick={() => setSelectedStudent(student)}
                >
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <span className="text-xs text-gray-500 font-medium">{index + 1}</span>
                  </td>
                  <td className="px-3 md:px-5 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 hidden md:flex  rounded-full  items-center justify-center  ${style.bgInitial} ${style.text}`}>
                        <span className="font-semibold text-sm">{student.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="text-xs md:text-sm font-medium text-gray-900">{student.name.split(" ").slice(0, 2).join(" ")}</div>
                        <div className="text-xs md:text-sm text-gray-500">ID: {student.student_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-5 py-2 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${style.bgInitial} ${style.text}`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 md:px-5 py-2">
                    <div className="text-sm text-gray-900 max-w-xs">
                      <div className="text-xs text-gray-600 mb-1">Duration: {student.duration_minutes}m</div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
