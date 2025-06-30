import React from "react";
import { FiDownload, FiX } from "react-icons/fi";

interface HeaderProps {
  onClose: () => void;
  onDownloadSample: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClose, onDownloadSample }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">CSV Processor</h2>
        <p className="text-sm text-gray-600">Upload and validate attendance data</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onDownloadSample}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
        >
          <FiDownload size={16} />
          Download Sample
        </button>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
          <FiX size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;
