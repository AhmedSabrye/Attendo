import type { AssignedMatch } from "./FixAttendanceModal";
import { FiX } from "react-icons/fi";

interface UndoPanelProps {
  assignedMatches: AssignedMatch[];
  reversedData: AssignedMatch[];
  handleUndoMatch: (studentId: number) => void;
}

export default function UndoPanel({
  assignedMatches,
  reversedData,
  handleUndoMatch,
}: UndoPanelProps) {
  return (
    <div className="md:absolute -top-5 right-1/2 md:translate-x-1/2 max-h-48 md:-translate-y-full w-full md:w-80 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg shadow-lg p-4 z-20">
      <h3 className="font-medium mb-3 text-gray-800 border-b border-gray-300 pb-2">
        Recent Assignments ({assignedMatches.length})
      </h3>
      <div className="space-y-2">
        {reversedData.map((match, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white border border-green-200 rounded-lg p-3 shadow-sm"
          >
            <div className="flex-1 text-sm">
              <div className="font-medium text-green-800 mb-1">
                {match.student.studentName}
              </div>
              <div className="text-gray-600 text-xs mb-1">
                ← {match.unmatchedRecords.map((r) => r.studentName).join(", ")}
              </div>
              <div className="text-green-600 font-medium text-xs">
                {match.totalDuration} minutes
              </div>
            </div>
            <button
              onClick={() => handleUndoMatch(match.student.studentId)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 flex-shrink-0"
              title="Undo this assignment"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
