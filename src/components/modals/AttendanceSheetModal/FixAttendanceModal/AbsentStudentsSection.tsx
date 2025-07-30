import type { FinalComparisonRecord } from "@/utils/generateSessionAttendanceReport";
import SearchInput from "./searchInput";
import { useState } from "react";

interface AbsentStudentsSectionProps {
  localAbsent: FinalComparisonRecord[];
  searchEnabled: boolean;
  handleSelectStudent: (studentId: number, studentName: string) => void;
  selectedStudentId: number | null;
  durationThreshold: number;
}
export default function AbsentStudentsSection({
  localAbsent,
  searchEnabled,
  handleSelectStudent,
  selectedStudentId,
  durationThreshold,
}: AbsentStudentsSectionProps) {
  const [absentSearch, setAbsentSearch] = useState("");
  return (
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
  )
}
