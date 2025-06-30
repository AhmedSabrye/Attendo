import { FiCheck, FiX, FiInfo } from "react-icons/fi";

interface TemplateManagerProps {
  onClose: () => void;
  proceed: () => void;
}

const TemplateManager = ({ onClose, proceed }: TemplateManagerProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg max-h-[90vh] min-w-3xl overflow-y-auto mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Template Manager</h2>
          <p className="text-sm text-gray-600">Group Name</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        
          {/* Template Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student Template</label>
            <textarea
              // value={templateText}
              // onChange={(e) => handleTemplateInput(e.target.value)}
              placeholder="paste your template here"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          {/* Process Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={proceed}
                // disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <FiCheck size={16} />
                Create & Proceed
              </button>
            </div>
        </div>
      </div>
  );
};

export default TemplateManager;
