import { HiCalendar, HiCheckCircle, HiXCircle, HiEye } from "react-icons/hi2";
import { Link, useParams } from "react-router";
import {
  useGetAllReportsForGroupQuery,
  useGetGroupsQuery,
} from "../../stores/api";
import { HashLoader } from "react-spinners";

export default function ReportsList() {
  const { groupId } = useParams();
  const numericGroupId = groupId ? Number(groupId) : undefined;
  const { data: groups } = useGetGroupsQuery();
  const group = groups?.find((group) => group.group_id === numericGroupId);
  const {
    data: reports = [],
    isLoading,
    isError,
  } = useGetAllReportsForGroupQuery(
    {
      groupId: numericGroupId || 0,
      groupName: group?.group_name || "",
    },
    {
      skip: !numericGroupId,
    }
  );

  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Attendance Reports
        </h3>
      </div>

      <div className="p-2 max-h-[600px] overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center items-center min-h-45">
            <HashLoader color="#10b981" className="block mb-2" />
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-red-500">
            Failed to load reports.
          </div>
        )}

        {!isLoading && !isError && sortedReports.length > 0 && (
          <div className="space-y-3">
            {sortedReports.map((report) => {
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
                        <span className="text-sm font-medium">
                          {report.attended_count}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <HiXCircle className="text-sm" />
                        <span className="text-sm font-medium">
                          {report.absent_count}
                        </span>
                      </div>
                    </div>

                    {/* View Icon */}

                    <HiEye className="text-lg opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 absolute left-4  top-3 md:static " />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading && !isError && sortedReports.length === 0 && (
          <div className="text-center py-12">
            <HiCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No attendance reports yet</p>
            <p className="text-sm text-gray-400">
              Use the "Take Attendance" button to process CSV files and generate
              reports
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
