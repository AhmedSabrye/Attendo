import React from "react";
import { FiUpload } from "react-icons/fi";

interface UploadAreaProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect }) => {
  return (
    <div className="mb-6">
      <div className="border-2 border-dashed rounded-lg p-8  text-center transition-colors border-gray-300 hover:border-gray-400">
        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your CSV file</h3>
          <p className="text-gray-600">Click the button to select a file.</p>
        </div>
        <input type="file" accept=".csv" className="hidden" id="csv-upload" onChange={onFileSelect} />
        <label
          htmlFor="csv-upload"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Choose File
        </label>
      </div>

      {/* Format Instructions */}
      {/* <div className="mt-4 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <FiInfo className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-2">Supported CSV Format:</p>
            <ul className="space-y-1">
              <li>• Must contain Name and Duration columns</li>
              <li>• Duration can be in minutes, "45 min", "1h 30m", etc.</li>
              <li>• Names with embedded 3-digit IDs will be automatically extracted</li>
              <li>• Additional columns (email, join time, etc.) will be preserved</li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default UploadArea;
