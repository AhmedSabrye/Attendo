import { HiTrash } from "react-icons/hi";
import { HiExclamationTriangle } from "react-icons/hi2";

interface DangerZoneProps {
  setShowDeleteConfirm: (show: boolean) => void;
  isDeleting: boolean;
}
export default function DangerZone({
  setShowDeleteConfirm,
  isDeleting,
}: DangerZoneProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <HiExclamationTriangle className="text-xl text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
          <p className="text-red-600 mt-1">Irreversible actions</p>
        </div>
      </div>

      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-red-900 mb-2">
              Delete Group
            </h4>
            <p className="text-red-700 text-sm">
              This action cannot be undone. This will permanently delete the
              group and all associated data including students and attendance
              records.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            <HiTrash className="text-sm" />
            Delete Group
          </button>
        </div>
      </div>
    </div>
  );
}
