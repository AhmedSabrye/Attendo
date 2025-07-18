import { HiX } from "react-icons/hi";

interface AttendanceToggleModalProps {
  student: { name: string; attended?: boolean };
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function AttendanceToggleModal({ student, loading = false, onConfirm, onClose }: AttendanceToggleModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 relative">
        {/* Close icon */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
          <HiX className="text-lg" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">{student.attended ? "Mark as absent?" : "Mark as present?"}</h2>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
}
