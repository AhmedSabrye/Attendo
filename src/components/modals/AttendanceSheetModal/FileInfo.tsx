import { FiFile } from "react-icons/fi";
import { FaUndoAlt } from "react-icons/fa";

export default function FileInfo ({file,onReset}: {file: File,onReset: () => void}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FiFile className="text-gray-400" />
              <span className="font-medium text-gray-900">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              onClick={() => {
                onReset();
              }}
              className="text-red-600 hover:text-red-800"
            >
              <FaUndoAlt  size={30}  className="animate-spin-small" />
            </button>
          </div>
  );
};