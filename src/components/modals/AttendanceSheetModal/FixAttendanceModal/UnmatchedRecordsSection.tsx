import type { AttendanceRecord } from "@/utils/parse";
import SearchInput from "./searchInput";
import { useState, type RefObject } from "react";

interface UnmatchedRecordsSectionProps {
  localUnmatched: AttendanceRecord[];
  searchEnabled: boolean;
  smartMatchEnabled: boolean;
  similarNames: RefObject<Set<string>>;
  handleToggleUnmatched: (idx: number) => void;
  selectedUnmatchedIdxs: Set<number>;
}

export default function UnmatchedRecordsSection({
  localUnmatched,
  searchEnabled,
  smartMatchEnabled,
  similarNames,
  handleToggleUnmatched,
  selectedUnmatchedIdxs,
}: UnmatchedRecordsSectionProps) {
  const [unmatchedSearch, setUnmatchedSearch] = useState("");
  return (
    <div>
      <h3 className="font-medium mb-2">
         Meeting Sheet ({localUnmatched.length})
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
                  {rec.studentName} {rec.phoneId ? `(${rec.phoneId})` : ""}
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
  );
}
