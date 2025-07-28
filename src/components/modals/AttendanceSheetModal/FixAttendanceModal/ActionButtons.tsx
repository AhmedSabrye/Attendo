import { FiCheck } from "react-icons/fi";

interface ActionButtonsFixAttendanceModalProps {
  onClose: () => void;
  handleAssign: () => void;
  handleFinish: () => void;
  selectedStudentId: number | null;
  selectedUnmatchedIdxs: Set<number>;
}

export default function ActionButtonsFixAttendanceModal({
  onClose,
  handleAssign,
  handleFinish,
  selectedStudentId,
  selectedUnmatchedIdxs,
}: ActionButtonsFixAttendanceModalProps) {
  return (
    <div className="mt-auto flex flex-col md:flex-row md:justify-between gap-4">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        Cancel
      </button>
      <div className="flex flex-col gap-2 md:flex-row">
        <button
          onClick={handleAssign}
          disabled={
            selectedStudentId == null || selectedUnmatchedIdxs.size === 0
          }
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
        >
          <FiCheck size={16} /> Assign & Next
        </button>

        <button
          onClick={handleFinish}
          className={`px-4 py-2 bg-green-600 disabled:opacity-50 ${
            selectedStudentId != null && selectedUnmatchedIdxs.size !== 0
              ? "opacity-50"
              : ""
          } text-white rounded-lg hover:bg-green-700`}
        >
          Done
        </button>
      </div>
    </div>
  );
}
