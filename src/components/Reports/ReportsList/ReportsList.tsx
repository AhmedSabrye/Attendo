import { HiCalendar } from "react-icons/hi2";
import { useParams } from "react-router";
import { useGetAllReportsForGroupQuery, useGetGroupsQuery } from "@/stores/api";
import { HashLoader } from "react-spinners";
import ReportsListItem from "./ReportsListItem";

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
                <ReportsListItem
                  key={report.session_id}
                  report={report}
                  groupId={groupId}
                />
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
