import { FiCheck } from "react-icons/fi";

interface ActionButtonsProps {
  handleBulkAttendanceSubmit: () => void;
  attendanceDate: string;
  setAttendanceDate: (date: string) => void;
}
 export default function ActionButtons ({handleBulkAttendanceSubmit,attendanceDate,setAttendanceDate}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Date:</span>
              <input
                type="date"
                className="border border-gray-300 rounded px-3 py-1 text-sm"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAttendanceSubmit()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <FiCheck size={16} />
                Process Attendance
              </button>
            </div>
          </div>
  );
};