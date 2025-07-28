import { Link } from "react-router";
import { HiCalendar, HiCheckCircle, HiXCircle, HiEye } from "react-icons/hi2";
import type { AttendanceReport } from "@/types/api";

interface ReportsListItemProps {
  report: AttendanceReport;
  groupId: string | undefined;
}

export default function ReportsListItem({ report, groupId }: ReportsListItemProps) {
  return (
    <Link
      key={report.session_id}
      to={`/groups/${groupId}/reports/${report.session_id}`}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group relative"
    >
      <div className="flex items-center gap-4">
        <div className="size-6 md:size-12 bg-emerald-100 rounded-xl flex items-center justify-center">
          <HiCalendar className="text-xs md:text-xl text-emerald-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {
              new Date(report.date)
                .toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                .split(",")[0]
            }
          </p>
          <p className="font-medium text-gray-900">
            {
              new Date(report.date)
                .toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                .split(",")[1]
            }
          </p>
        </div>
      </div>

      <div className="flex items-center flex-col md:flex-row gap-4">
        {/* Attendance Rate */}
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            {report.attendance_rate}%
          </p>
          <p className="text-xs text-gray-500">Attendance</p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-emerald-600">
            <HiCheckCircle className="text-sm" />
            <span className="text-sm font-medium">{report.attended_count}</span>
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <HiXCircle className="text-sm" />
            <span className="text-sm font-medium">{report.absent_count}</span>
          </div>
        </div>

        {/* View Icon */}

        <HiEye className="text-lg opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 absolute left-4  top-3 md:static " />
      </div>
    </Link>
  );
}
