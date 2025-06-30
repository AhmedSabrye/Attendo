import { useState } from "react";
import { FiFile, FiCheck, FiX } from "react-icons/fi";
import Header from "./Header";
import UploadArea from "./UploadArea";
import ValidationSummary from "./ValidationSummary";
// import { parseCsvFile, generateValidationReport } from "../../../utils/csvParser";
// import { downloadAsCsv } from "../../../utils/index";

// Dummy types
interface DummyFile {
  name: string;
  size: number;
  lastModifiedDate?: Date;
}

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

const dummyFile: DummyFile = {
  name: "attendance.csv",
  size: 2048,
  lastModifiedDate: new Date(),
};

const dummyValidationReport: ValidationReport = {
  isValid: false,
  summary: {
    totalRows: 20,
    validRecords: 18,
    recordsWithIds: 15,
    averageDuration: 45,
  },
  columnDetection: {
    nameColumn: "Name",
    durationColumn: "Duration",
  },
  errors: ["Missing ID in row 3", "Invalid duration format in row 7"],
  warnings: ["Name column contains extra spaces"],
  duplicateAnalysis: {
    hasDuplicates: true,
    duplicates: ["123", "456"],
    duplicateNames: ["John Doe", "Jane Smith"],
  },
};

function AttendanceSheetModal({ onCsvProcessed, onClose }: { onCsvProcessed: (csvData: any, date: string) => void; onClose: () => void }) {
  const [file, setFile] = useState<DummyFile | null>(dummyFile);
  const [csvData, setCsvData] = useState<any>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(dummyValidationReport);
  const [error, setError] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // This gives "YYYY-MM-DD"
  });

  // Dummy handleProcessCsv function
  const handleProcessCsv = () => {
    alert("Processing CSV (dummy)");
  };

  const handleDownloadSample = () => {
    alert("Download sample CSV (todo)");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile({
        name: selected.name,
        size: selected.size,
        lastModifiedDate: new Date(selected.lastModified),
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto max-h-[90vh] overflow-y-auto">
      <Header onClose={onClose} onDownloadSample={handleDownloadSample} />

      <div className="p-6">
        {!file && <UploadArea onFileSelect={handleFileChange} />}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <FiX className="text-red-600" />
              <span className="font-medium text-red-800">Error Processing File</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setFile(null);
                setCsvData(null);
                setValidationReport(null);
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* File Info */}
        {file && !error && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiFile className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024).toFixed(1)} KB • Modified {file.lastModifiedDate?.toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setCsvData(null);
                setValidationReport(null);
                setError(null);
              }}
              className="px-4 py-2 text-white bg-blue-600 border border-gray-300 rounded-lg hover:bg-blue-700"
            >
              Upload Different File
            </button>
          </div>
        )}

        {/* Validation Report */}
        {validationReport && (
          <div className="mb-6">
            {/* it's showing all the errors and warnings as preview for now */}
            <ValidationSummary report={validationReport} />
          </div>
        )}

        {/* Action Buttons */}
        {validationReport && (
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600" htmlFor="attendanceDate">
                  Attendance Date
                </label>
                <input
                  type="date"
                  id="attendanceDate"
                  className="ring-2 ring-emerald-500 text-2xl rounded-lg p-2"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!validationReport.isValid && <span className="text-sm text-red-600">Please fix errors before proceeding</span>}
              <button
                onClick={handleProcessCsv}
                // disabled={!validationReport.isValid}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiCheck size={16} />
                Process Attendance
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceSheetModal;
