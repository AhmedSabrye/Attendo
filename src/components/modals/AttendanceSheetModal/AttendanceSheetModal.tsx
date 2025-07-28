import { useState } from "react";
import Header from "./Header";
import UploadArea from "./UploadArea";
import ValidationSummary from "./ValidationSummary";
import {
  parseAttendanceSheet,
  generateSessionAttendanceReport,
} from "@/utils/parse";
import { generateValidationReport } from "@/utils/generateValidationReport";
import type {
  AttendanceRecord,
  FinalComparisonRecord,
  ValidationReport,
} from "@/utils/parse";
import FixAttendanceModal from "./FixAttendanceModal/FixAttendanceModal";
import ActionButtons from "./ActionButtons";
import FileInfo from "./FileInfo";
import ErrorState from "./errorState";
import useAttendanceSheetModal from "./useAttendanceSheetModal";
import { toast } from "react-toastify";

function AttendanceSheetModal({ onClose }: { onClose: () => void }) {
  const {
    bulkUpdateAttendance,
    activeGroupStudents,
    groupData,
    file,
    setFile,
    groupId,
  } = useAttendanceSheetModal();

  const [validationReport, setValidationReport] =
    useState<ValidationReport | null>(null);
  const [comparison, setComparison] = useState<FinalComparisonRecord[]>([]);
  const [absentStudents, setAbsentStudents] = useState<FinalComparisonRecord[]>(
    []
  );
  const [notMatchedStudents, setNotMatchedStudents] = useState<
    AttendanceRecord[]
  >([]);
  const [error, setError] = useState(null);
  const [showFixModal, setShowFixModal] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // This gives "YYYY-MM-DD"
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      handleProcessCsv(selected);
    }
  };

  const handleProcessCsv = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    const parsed = parseAttendanceSheet(text);

    // Use group's stored duplicated indices or fall back to Redux store as backup
    const groupDuplicatedIdxs = groupData?.duplicated_idx;

    const generatedSessionReport = generateSessionAttendanceReport(
      parsed,
      activeGroupStudents ?? [],
      groupDuplicatedIdxs ?? [],
      groupData?.duration_threshold || 40
    );
    const validationReport = generateValidationReport(
      generatedSessionReport,
      activeGroupStudents ?? []
    );
    setValidationReport(validationReport);

    console.log("generatedSessionReport", generatedSessionReport);
    setComparison(generatedSessionReport.comparison);
    setAbsentStudents(generatedSessionReport.absentStudents);
    setNotMatchedStudents(generatedSessionReport.notMatchedStudents);
    if (
      generatedSessionReport.absentStudents.length > 0 ||
      generatedSessionReport.notMatchedStudents.length > 0
    ) {
      setShowFixModal(true);
    }
  };

  const handleBulkAttendanceSubmit = async () => {
    if (!groupId || !activeGroupStudents) return;

    //refactor , do we need to check the comparison again ?
    const bulkData = activeGroupStudents?.map((student) => {
      const comparisonedRecord = comparison.find(
        (c) => c.studentId === student.student_id
      );
      return {
        student_id: student.student_id,
        duration_minutes: comparisonedRecord?.duration || 0,
        attended:
          (comparisonedRecord?.duration || 0) >=
          (groupData?.duration_threshold || 40),
        attendance_alias:
          comparisonedRecord?.attendance_alias == student.attendance_alias
            ? null
            : comparisonedRecord?.attendance_alias,
      };
    });

    try {
      const result = await bulkUpdateAttendance({
        groupId: Number(groupId),
        attendanceDate: attendanceDate,
        bulkData,
      }).unwrap();

      if (result.success) {
        toast.success(
          `Updated: ${result.attendedCount} attended, ${result.partialCount} partial, ${result.absentCount} absent`
        );
        onClose();
      }
    } catch (error) {
      console.error("Failed to update bulk attendance:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg min-w-96 md:min-w-3xl max-w-6xl mx-auto max-h-[90vh] overflow-y-auto">
      <Header onClose={onClose} />

      <div className="p-6">
        {!file && <UploadArea onFileSelect={handleFileChange} />}

        {error && (
          <ErrorState
            error={error}
            onReset={() => {
              setError(null);
              setFile(null);
              setValidationReport(null);
            }}
          />
        )}

        {file && !error && (
          <FileInfo
            file={file}
            onReset={() => {
              setFile(null);
              setValidationReport(null);
              setError(null);
            }}
          />
        )}

        {validationReport && (
          <div className="mb-6">
            <ValidationSummary
              report={validationReport}
              absentStudents={absentStudents}
              notMatchedStudents={notMatchedStudents}
              onFixClick={() => setShowFixModal(true)}
            />
          </div>
        )}

        {validationReport && (
          <ActionButtons
            handleBulkAttendanceSubmit={handleBulkAttendanceSubmit}
            attendanceDate={attendanceDate}
            setAttendanceDate={setAttendanceDate}
          />
        )}
      </div>

      {showFixModal && (
        <FixAttendanceModal
          groupStudents={activeGroupStudents ?? []}
          notMatchedStudents={notMatchedStudents}
          comparison={comparison}
          setValidationReport={setValidationReport}
          onDone={(updatedComp, remainingAbsent, remainingUnmatched) => {
            setComparison(updatedComp);
            setAbsentStudents(remainingAbsent);
            setNotMatchedStudents(remainingUnmatched);
            setShowFixModal(false);
          }}
          onClose={() => setShowFixModal(false)}
          durationThreshold={groupData?.duration_threshold || 40}
        />
      )}
    </div>
  );
}

export default AttendanceSheetModal;
