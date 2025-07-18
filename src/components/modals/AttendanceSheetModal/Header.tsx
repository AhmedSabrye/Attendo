import React from "react";
import { FiX } from "react-icons/fi";

interface HeaderProps {
  onClose: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">CSV Processor</h2>
        <p className="text-sm text-gray-600">Upload and validate attendance data</p>
      </div>
      <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
        <FiX size={20} />
      </button>
    </div>
  );
};

export default Header;
