import { FiCheck, FiAlertTriangle } from "react-icons/fi";

interface ValidationReport {
  isValid: boolean;
  summary: {
    totalRows: number;
    validRecords: number;
    recordsWithIds: number;
    averageDuration: number;
  };
  columnDetection?: {
    nameColumn?: string;
    durationColumn?: string;
  };
  errors: string[];
  warnings: string[];
  duplicateAnalysis?: {
    hasDuplicates: boolean;
    duplicates: string[];
    duplicateNames: string[];
  };
}
export default function ValidationSummary({ report }: { report: ValidationReport }) {
  return (
    <div className="bg-white border rounded-lg p-4 ">
      <div className="flex items-center gap-2 mb-3">
        {report.isValid ? <FiCheck className="text-green-600" /> : <FiAlertTriangle className="text-red-600" />}
        <h3 className={`font-medium ${report.isValid ? "text-green-600" : "text-red-600"}`}>
          {report.isValid ? "CSV File Valid" : "CSV File Issues Found"}
        </h3>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm text-blue-600 font-medium">Total Rows</div>
          <div className="text-lg font-bold text-blue-900">{report.summary.totalRows}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-sm text-green-600 font-medium">Valid Records</div>
          <div className="text-lg font-bold text-green-900">{report.summary.validRecords}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="text-sm text-yellow-600 font-medium">With IDs</div>
          <div className="text-lg font-bold text-yellow-900">{report.summary.recordsWithIds}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-sm text-purple-600 font-medium">Avg Duration</div>
          <div className="text-lg font-bold text-purple-900">{report.summary.averageDuration}m</div>
        </div>
      </div>

      {/* Column Detection */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Column Detection</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Name Column:</span>
              <span className="ml-2 font-medium text-green-600">{report.columnDetection?.nameColumn || "Not detected"}</span>
            </div>
            <div>
              <span className="text-gray-600">Duration Column:</span>
              <span className="ml-2 font-medium text-green-600">{report.columnDetection?.durationColumn || "Not detected"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {report.errors.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-red-700 mb-2">Errors</h4>
          <div className="bg-red-50 rounded-lg p-3">
            <ul className="text-sm text-red-600 space-y-1">
              {report.errors.map((error: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Warnings */}
      {report.warnings.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-yellow-700 mb-2">Warnings</h4>
          <div className="bg-yellow-50 rounded-lg p-3">
            <ul className="text-sm text-yellow-600 space-y-1">
              {report.warnings.map((warning: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Duplicate Analysis */}
      {report.duplicateAnalysis?.hasDuplicates && (
        <div className="mb-4">
          <h4 className="font-medium text-orange-700 mb-2">Duplicate Analysis</h4>
          <div className="bg-orange-50 rounded-lg p-3">
            {report.duplicateAnalysis.duplicates.length > 0 && (
              <p className="text-sm text-orange-600 mb-1">Duplicate IDs found: {report.duplicateAnalysis.duplicates.join(", ")}</p>
            )}
            {report.duplicateAnalysis.duplicateNames.length > 0 && (
              <p className="text-sm text-orange-600">Duplicate names detected - may require manual review</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
