import { HiExclamationTriangle, HiTrash } from "react-icons/hi2";
import { HashLoader } from "react-spinners";

export default function DeleteConfirmationModal({
  displayedName,
  setShowDeleteConfirm,
  handleDeleteGroup,
  isDeleting,
}: {
  displayedName: string;
  setShowDeleteConfirm: (show: boolean) => void;
  handleDeleteGroup: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-2 mb-4">
          <HiExclamationTriangle className="text-red-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Deletion
          </h3>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <br />{" "}
          <span className="font-bold ">{displayedName}</span> <br />{" "}
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteGroup}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <HashLoader color="white" size={16} />
            ) : (
              <>
                <HiTrash className="text-sm" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
