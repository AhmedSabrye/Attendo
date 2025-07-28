import { useMemo, useState, useRef } from "react";
import { FiX } from "react-icons/fi";
import type { AttendanceRecord } from "@/utils/parse";
import { generateValidationReport } from "@/utils/generateValidationReport";
import type { Student } from "@/utils/api";
import type { FinalComparisonRecord, ValidationReport } from "@/utils/parse";
import { distance } from "fastest-levenshtein";
import ActionButtonsFixAttendanceModal from "./ActionButtons";
import UndoPanel from "./UndoPanel";
import UnmatchedRecordsSection from "./UnmatchedRecordsSection";
import AbsentStudentsSection from "./AbsentStudentsSection";
import SearchAndSmartMatchCrontrols from "./SearchAndSmartMatchCrontrols";
import { toast } from "react-toastify";

interface FixAttendanceModalProps {
  notMatchedStudents: AttendanceRecord[];
  comparison: FinalComparisonRecord[];
  onDone: (
    updatedComparison: FinalComparisonRecord[],
    remainingAbsent: FinalComparisonRecord[],
    remainingUnmatched: AttendanceRecord[]
  ) => void;
  onClose: () => void;
  setValidationReport: (report: ValidationReport) => void;
  groupStudents: Student[];
  durationThreshold: number;
}

export interface AssignedMatch {
  student: FinalComparisonRecord;
  unmatchedRecords: AttendanceRecord[];
  totalDuration: number;
}

function FixAttendanceModal({
  notMatchedStudents,
  comparison,
  onDone,
  onClose,
  setValidationReport,
  groupStudents,
  durationThreshold,
}: FixAttendanceModalProps) {
  const [localComparison, setLocalComparison] = useState<
    FinalComparisonRecord[]
  >([...comparison]);

  const localAbsent = useMemo(() => {
    return localComparison.filter((c) => c.isAbsent);
  }, [localComparison]);

  const [localUnmatched, setLocalUnmatched] = useState<AttendanceRecord[]>(
    [...notMatchedStudents].sort((a, b) =>
      (a.studentName ?? "").localeCompare(b.studentName ?? "")
    )
  );

  // New state to track assigned matches for undo functionality
  const [assignedMatches, setAssignedMatches] = useState<AssignedMatch[]>([]);
  const similarNames = useRef<Set<string>>(new Set());
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );

  // State for toggling search and smart match
  const [searchEnabled, setSearchEnabled] = useState(() => {
    const searchEnabled = localStorage.getItem("searchEnabled");
    return searchEnabled === "true" ? true : false;
  });
  const [smartMatchEnabled, setSmartMatchEnabled] = useState(() => {
    const smartMatchEnabled = localStorage.getItem("smartMatchEnabled");
    return smartMatchEnabled === "true" ? true : false;
  });

  function handleSelectStudent(studentId: number, studentName: string) {
    setSelectedStudentId(studentId);

    if (smartMatchEnabled) {
      // Calculate distances and track similar names
      const similarNamesSet = new Set<string>();
      const sortedUnmatched = [...localUnmatched].sort((a, b) => {
        // Calculate distances
        const aDistance = distance(
          a.studentName.split(" ")[0] ?? "",
          studentName.split(" ")[0] ?? ""
        );
        const bDistance = distance(
          b.studentName.split(" ")[0] ?? "",
          studentName.split(" ")[0] ?? ""
        );
        const aIsClose = aDistance < 3;
        const bIsClose = bDistance < 3;
        // Track similar names for highlighting
        if (aIsClose) {
          similarNamesSet.add(a.studentName ?? "");
        }
        if (bIsClose) {
          similarNamesSet.add(b.studentName ?? "");
        }
        // First priority: put close matches (distance < 3) first
        if (aIsClose && !bIsClose) return -1;
        if (!aIsClose && bIsClose) return 1;
        // Second priority: alphabetical sorting
        return (a.studentName ?? "").localeCompare(b.studentName ?? "");
      });
      setLocalUnmatched(sortedUnmatched);
      similarNames.current = similarNamesSet;
    } else {
      // No smart match: just sort alphabetically, no highlights
      setLocalUnmatched((prev) =>
        [...prev].sort((a, b) =>
          (a.studentName ?? "").localeCompare(b.studentName ?? "")
        )
      );
      similarNames.current = new Set();
    }
  }

  const [selectedUnmatchedIdxs, setSelectedUnmatchedIdxs] = useState<
    Set<number>
  >(new Set());

  // Helper: total duration of selected unmatched rows
  const totalSelectedDuration = Array.from(selectedUnmatchedIdxs).reduce(
    (sum, idx) => sum + (localUnmatched[idx]?.duration || 0),
    0
  );

  const handleToggleUnmatched = (idx: number) => {
    setSelectedUnmatchedIdxs((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleAssign = () => {
    if (selectedStudentId == null || selectedUnmatchedIdxs.size === 0) return;

    const student = localAbsent.find((s) => s.studentId === selectedStudentId);
    if (!student) return;

    // Get selected unmatched records
    const selectedRecords = Array.from(selectedUnmatchedIdxs).map(
      (idx) => localUnmatched[idx]
    );
    student.attendance_alias = selectedRecords[0].studentName;
    const totalDuration = selectedRecords.reduce(
      (sum, rec) => sum + (rec?.duration || 0),
      0
    );
    // Store this assignment for undo functionality
    setAssignedMatches((prev) => [
      ...prev,
      {
        student,
        unmatchedRecords: selectedRecords,
        totalDuration,
      },
    ]);

    // Add / update comparison record for this student
    setLocalComparison((prev) => {
      const existingIdx = prev.findIndex(
        (c) => c.studentId === student.studentId
      );
      const duration = totalDuration + (prev[existingIdx]?.duration || 0);
      const newEntry: FinalComparisonRecord = {
        studentName: student.studentName ?? "",
        studentId: student.studentId,
        phoneId: student.phoneId ?? null,
        duration,
        attendance_alias:
          student.attendance_alias ?? selectedRecords[0].studentName,
        isAbsent: durationThreshold ? duration < durationThreshold : false,
        isMatched: true,
      };
      if (existingIdx !== -1) {
        const copy = structuredClone(prev);
        copy[existingIdx] = newEntry;
        return copy;
      }
      return [...prev, newEntry];
    });

    // Remove the student from absent list
    // setLocalAbsent((prev) =>
    //   prev.filter((s) => s.studentId !== student.studentId)
    // );

    // Remove selected unmatched rows
    setLocalUnmatched((prev) =>
      prev.filter((_, idx) => !selectedUnmatchedIdxs.has(idx))
    );

    // Reset selections
    setSelectedStudentId(null);
    setSelectedUnmatchedIdxs(new Set());

    // Clear search inputs after assign
    similarNames.current = new Set();
  };

  const handleUndoMatch = (studentId: number) => {
    const matchToUndo = assignedMatches.find(
      (assignedMatch) => assignedMatch.student.studentId === studentId
    );
    if (!matchToUndo) return;

    // Add unmatched records back
    setLocalUnmatched((prev) =>
      [...prev, ...matchToUndo.unmatchedRecords].sort((a, b) =>
        (a.studentName ?? "").localeCompare(b.studentName ?? "")
      )
    );

    // Update comparison - subtract this student's duration or remove entirely
    setLocalComparison((prev) => {
      const existingIdx = prev.findIndex(
        (c) => c.studentId === matchToUndo.student.studentId
      );
      if (existingIdx !== -1) {
        const existing = prev[existingIdx];
        const newDuration = existing.duration - matchToUndo.totalDuration;

        // Update with reduced duration
        const copy = structuredClone(prev);
        copy[existingIdx] = {
          ...existing,
          duration: newDuration < 0 ? 0 : newDuration,
          isAbsent: newDuration < durationThreshold,
        };
        return copy;
      }
      return prev;
    });

    // Remove from assigned matches
    setAssignedMatches((prev) =>
      prev.filter(
        (assignedMatch) => assignedMatch.student.studentId !== studentId
      )
    );
  };

  const handleFinish = () => {
    if (selectedStudentId != null || selectedUnmatchedIdxs.size !== 0) {
      toast.error("Assign or unselect an unmatched records", {
        toastId: "fix-attendance-modal",
      });
      return;
    }
    onDone(localComparison, localAbsent, localUnmatched);
    const report = generateValidationReport(
      {
        comparison: localComparison,
        notMatchedStudents: localUnmatched,
        absentStudents: localAbsent,
      },
      groupStudents
    );
    setValidationReport(report);
  };
  const reversedData = useMemo(() => {
    return [...assignedMatches].reverse(); // safe copy + reverse
  }, [assignedMatches]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 ">
      <div className="bg-white w-full max-w-5xl max-h-screen md:max-h-[90vh] md:min-h-[635px] md:mt-45 overflow-y-auto md:overflow-y-visible rounded-lg shadow-lg p-6 relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          Fix Unmatched & Absent Students
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls for search and smart match */}
          <SearchAndSmartMatchCrontrols
            searchEnabled={searchEnabled}
            setSearchEnabled={setSearchEnabled}
            smartMatchEnabled={smartMatchEnabled}
            setSmartMatchEnabled={setSmartMatchEnabled}
          />

          {/* Absent Students */}
          <AbsentStudentsSection
            localAbsent={localAbsent}
            searchEnabled={searchEnabled}
            handleSelectStudent={handleSelectStudent}
            selectedStudentId={selectedStudentId}
            durationThreshold={durationThreshold}
          />

          {/* Unmatched Records */}
          <UnmatchedRecordsSection
            localUnmatched={localUnmatched}
            searchEnabled={searchEnabled}
            smartMatchEnabled={smartMatchEnabled}
            similarNames={similarNames}
            handleToggleUnmatched={handleToggleUnmatched}
            selectedUnmatchedIdxs={selectedUnmatchedIdxs}
          />
        </div>

        {/* Asigned Duration Indicator */}
        <p className="mt-4 text-sm min-h-6 text-emerald-600">
          {selectedStudentId != null &&
            selectedUnmatchedIdxs.size > 0 &&
            `Assigning ${totalSelectedDuration} minutes to ${
              (
                localAbsent.find((s) => s.studentId === selectedStudentId) || {
                  studentName: "",
                }
              ).studentName
            }`}
        </p>

        {/* Assigned Matches Display - to undo matches */}
        {assignedMatches.length > 0 && (
          <UndoPanel
            assignedMatches={assignedMatches}
            reversedData={reversedData}
            handleUndoMatch={handleUndoMatch}
          />
        )}

        {/* Actions */}
        <ActionButtonsFixAttendanceModal
          onClose={onClose}
          handleAssign={handleAssign}
          handleFinish={handleFinish}
          selectedStudentId={selectedStudentId}
          selectedUnmatchedIdxs={selectedUnmatchedIdxs}
        />
      </div>
    </div>
  );
}

export default FixAttendanceModal;
