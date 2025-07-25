import { useMemo, useState, useRef } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import type { AttendanceRecord } from "@/utils/parse";
import { generateValidationReport } from "@/utils/generateValidationReport";
import type { Student } from "@/utils/api";
import type { FinalComparisonRecord, ValidationReport } from "@/utils/parse";
import { distance } from "fastest-levenshtein";
import SearchInput from "./searchInput";

interface FixAttendanceModalProps {
  absentStudents: FinalComparisonRecord[];
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

interface AssignedMatch {
  student: FinalComparisonRecord;
  unmatchedRecords: AttendanceRecord[];
  totalDuration: number;
}

function FixAttendanceModal({
  // absentStudents,
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

  // New state for search inputs
  const [absentSearch, setAbsentSearch] = useState("");
  const [unmatchedSearch, setUnmatchedSearch] = useState("");
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
    setAbsentSearch("");
    setUnmatchedSearch("");
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
  console.log(assignedMatches);
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
          <div className="col-span-2 flex flex-wrap gap-6 mb-4 items-center">
            <label className="flex items-center gap-2 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full shadow-sm transition border border-gray-200 hover:bg-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={searchEnabled}
                onChange={(e) => {
                  setSearchEnabled(e.target.checked);
                  localStorage.setItem(
                    "searchEnabled",
                    e.target.checked.toString()
                  );
                }}
                className="w-4 h-4 accent-blue-600 rounded focus:ring-2 focus:ring-blue-400 transition"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              />
              <span className="select-none">Enable Search</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full shadow-sm transition border border-gray-200 hover:bg-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={smartMatchEnabled}
                onChange={(e) => {
                  setSmartMatchEnabled(e.target.checked);
                  localStorage.setItem(
                    "smartMatchEnabled",
                    e.target.checked.toString()
                  );
                }}
                className="w-4 h-4 accent-green-600 rounded focus:ring-2 focus:ring-green-400 transition"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              />
              <span className="select-none">Smart Match</span>
            </label>
          </div>
          {/* Absent Students */}
          <div>
            <h3 className="font-medium mb-2">
              Absent Students ({localAbsent.length})
            </h3>
            {/* Search input for absent students */}
            {searchEnabled && (
              <SearchInput
                search={absentSearch}
                setSearch={setAbsentSearch}
                placeholder="Search absent..."
              />
            )}
            <div className="border rounded-lg divide-y max-h-32 md:max-h-72 overflow-y-auto">
              {[...localAbsent]
                .filter(
                  (student) =>
                    absentSearch.trim() === "" ||
                    (student.studentName ?? "")
                      .toLowerCase()
                      .includes(absentSearch.toLowerCase())
                )
                .sort((a, b) =>
                  (a.studentName ?? "").localeCompare(b.studentName ?? "")
                )
                .map((student) => (
                  <label
                    key={student.studentId}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="absentStudent"
                      value={student.studentId}
                      checked={selectedStudentId === student.studentId}
                      onChange={() =>
                        handleSelectStudent(
                          student.studentId,
                          student.studentName ?? ""
                        )
                      }
                    />
                    <span>{student.studentName}</span>
                    {student.duration > 0 &&
                      student.duration < durationThreshold && (
                        <span className="text-xs text-gray-600 ml-auto">
                          {student.duration} mins of {durationThreshold} mins
                        </span>
                      )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {student.phoneId}
                    </span>
                  </label>
                ))}
              {localAbsent.filter(
                (student) =>
                  absentSearch.trim() === "" ||
                  (student.studentName ?? "")
                    .toLowerCase()
                    .includes(absentSearch.toLowerCase())
              ).length === 0 && (
                <p className="p-4 text-sm text-gray-500">
                  No absent students found
                </p>
              )}
            </div>
          </div>

          {/* Unmatched Records */}
          <div>
            <h3 className="font-medium mb-2">
              Unmatched Records ({localUnmatched.length})
            </h3>
            {/* Search input for unmatched records */}
            {searchEnabled && (
              <SearchInput
                search={unmatchedSearch}
                setSearch={setUnmatchedSearch}
                placeholder="Search unmatched..."
              />
            )}
            <div className="border rounded-lg divide-y max-h-32 md:max-h-72 overflow-y-auto">
              {localUnmatched
                .map((rec, idx) => ({ rec, idx }))
                .filter(
                  ({ rec }) =>
                    unmatchedSearch.trim() === "" ||
                    (rec.studentName ?? "")
                      .toLowerCase()
                      .includes(unmatchedSearch.toLowerCase())
                )
                .map(({ rec, idx }) => {
                  const isSimilar =
                    smartMatchEnabled &&
                    similarNames.current.has(rec.studentName ?? "");
                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 ${
                        isSimilar
                          ? "bg-yellow-100 border-l-4 border-l-yellow-500"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUnmatchedIdxs.has(idx)}
                        onChange={() => handleToggleUnmatched(idx)}
                      />
                      <span className="truncate flex-1">
                        {rec.studentName}{" "}
                        {rec.phoneId ? `(${rec.phoneId})` : ""}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {rec.duration}m
                      </span>
                    </label>
                  );
                })}
              {localUnmatched.filter(
                (rec) =>
                  unmatchedSearch.trim() === "" ||
                  (rec.studentName ?? "")
                    .toLowerCase()
                    .includes(unmatchedSearch.toLowerCase())
              ).length === 0 && (
                <p className="p-4 text-sm text-gray-500">
                  No unmatched records found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Selected total */}
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

        {/* Assigned Matches Display - Column */}
        {assignedMatches.length > 0 && (
          <div className="md:absolute -top-5 right-1/2 md:translate-x-1/2 max-h-48 md:-translate-y-full w-full md:w-80 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg shadow-lg p-4 z-20">
            <h3 className="font-medium mb-3 text-gray-800 border-b border-gray-300 pb-2">
              Recent Assignments ({assignedMatches.length})
            </h3>
            <div className="space-y-2">
              {reversedData.map((match, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white border border-green-200 rounded-lg p-3 shadow-sm"
                >
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-green-800 mb-1">
                      {match.student.studentName}
                    </div>
                    <div className="text-gray-600 text-xs mb-1">
                      ←{" "}
                      {match.unmatchedRecords
                        .map((r) => r.studentName)
                        .join(", ")}
                    </div>
                    <div className="text-green-600 font-medium text-xs">
                      {match.totalDuration} minutes
                    </div>
                  </div>
                  <button
                    onClick={() => handleUndoMatch(match.student.studentId)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 flex-shrink-0"
                    title="Undo this assignment"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex flex-col md:flex-row md:justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <div className="flex flex-col gap-2 md:flex-row">
            <button
              onClick={handleAssign}
              disabled={
                selectedStudentId == null || selectedUnmatchedIdxs.size === 0
              }
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
            >
              <FiCheck size={16} /> Assign & Next
            </button>

            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FixAttendanceModal;
