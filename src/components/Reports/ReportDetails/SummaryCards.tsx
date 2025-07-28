import type { AttendanceReport } from "@/types/api";
import { HiCheckCircle, HiXCircle, HiUser } from "react-icons/hi";


function getSummaryCards(
  report: AttendanceReport,
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
interface SummaryCardsProps {
  report: AttendanceReport;
  attendedCount: number;
  absentCount: number;
  totalCount: number;
}

export default function SummaryCards({
  report,
  attendedCount,
  absentCount,
  totalCount,
}: SummaryCardsProps) {

  const summaryCards = getSummaryCards(
    report,
    attendedCount,
    absentCount,
    totalCount
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      {summaryCards.map(({ label, value, Icon, bgColor, textColor }) => (
        <div key={label} className={`text-center p-2 ${bgColor} rounded-lg`}>
          <div
            className={`flex items-center justify-center gap-1 ${textColor} mb-1`}
          >
            {Icon && <Icon className="text-md" />}
            <span className="font-semibold text-sm">{value}</span>
          </div>
          <p className="text-xs text-gray-600">{label}</p>
        </div>
      ))}
    </div>
  );
}
