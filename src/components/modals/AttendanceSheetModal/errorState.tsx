import { FiX } from "react-icons/fi";

export default function ErrorState({error,onReset}: {error: string,onReset: () => void}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <FiX className="text-red-600" />
              <span className="font-medium text-red-800">Error Processing File</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => {
                onReset();
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>  
  );
}