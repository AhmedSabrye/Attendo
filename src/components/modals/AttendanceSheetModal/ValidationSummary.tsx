import { BsPersonRaisedHand } from "react-icons/bs";
import { FiUsers, FiClock, FiAlertTriangle } from "react-icons/fi";
import { MdOutlinePersonOff } from "react-icons/md";
import type { ValidationReport } from "@/utils/parse";

interface ValidationSummaryProps {
  report: ValidationReport;
  absentStudents: any[];
  notMatchedStudents: any[];
  onFixClick: () => void;
}

export default function ValidationSummary({ report, absentStudents, notMatchedStudents, onFixClick }: ValidationSummaryProps) {
  const hasErrors = absentStudents.length > 0 || notMatchedStudents.length > 0;
  const totalUnmatched = absentStudents.length + notMatchedStudents.length;

  return (
    <div className="bg-white border rounded-lg p-4">
      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <SummaryCard
          title="Total Students"
          value={report.summary.totalStudents}
          icon={<FiUsers className="text-blue-600" size={30} />}
          textColor="text-blue-600"
          bgColor="bg-blue-50"
          textColor2="text-blue-600"
        />
        <SummaryCard
          title="Attended"
          value={report.summary.attendedStudents}
          icon={<BsPersonRaisedHand className="text-green-600" size={30} />}
          textColor="text-green-600"
          bgColor="bg-green-50"
          textColor2="text-green-600"
        />
        <SummaryCard
          title="Absent"
          value={report.summary.absentStudents}
          icon={<MdOutlinePersonOff className="text-red-600" size={30} />}
          textColor="text-red-600"
          bgColor="bg-red-50"
          textColor2="text-red-600"
        />
        <SummaryCard
          title="Avg Duration"
          value={report.summary.averageDuration}
          icon={<FiClock className="text-purple-600" size={30} />}
          textColor="text-purple-600"
          bgColor="bg-purple-50"
          textColor2="text-purple-600"
        />
      </div>

      {/* Warnings Alert */}
      {hasErrors && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-orange-600" size={16} />
            <span className="text-sm font-medium text-orange-800">
              {totalUnmatched} unmatched student{totalUnmatched !== 1 ? "s" : ""}
            </span>
          </div>
          <button onClick={onFixClick} className="px-12 animate-pulse py-1 bg-orange-600 text-white text-lg rounded-xl  hover:bg-orange-700">
            Fix
          </button>
        </div>
      )}
    </div>
  );
}

const SummaryCard = ({
  title,
  value,
  icon,
  textColor,
  bgColor,
  textColor2,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  textColor: string;
  bgColor: string;
  textColor2: string;
}) => {
  return (
    <div className={`rounded-lg p-3 flex items-center gap-2 ${bgColor}`}>
      {icon}
      <div>
        <h3 className={`text-xs  font-medium ${textColor2}`}>{title}</h3>
        <h4 className={`text-lg font-bold ${textColor}`}>{value}</h4>
      </div>
    </div>
  );
};
