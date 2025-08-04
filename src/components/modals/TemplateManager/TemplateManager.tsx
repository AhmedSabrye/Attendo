import { useState, useMemo } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { useParams } from "react-router";
import { parseTemplate } from "@/utils/parse";
import {
  useGetStudentsQuery,
  useSyncStudentsMutation,
  useUpdateGroupDuplicatedIndicesMutation,
} from "@/stores/api";
import DiffIndicator from "./DiffIndicator";
import type { Student } from "@/utils/api";
import { cleanInputInvisibleChars, isSafeInput } from "@/utils/validation";

interface TemplateManagerProps {
  onClose: () => void;
}
export interface ParsedStudent
  extends Pick<Student, "name" | "phone_last_3" | "order_index"> {}
export interface OrderUpdate
  extends Pick<
    Student,
    "student_id" | "name" | "phone_last_3" | "order_index"
  > {}

export interface InvalidLine {
  line: string;
  error: string;
  fix: string;
}

const TemplateManager = ({ onClose }: TemplateManagerProps) => {
  const [template, setTemplate] = useState("");
  const [parsed, setParsed] = useState<ParsedStudent[]>([]);
  const [localDuplicatesIdxs, setLocalDuplicatesIdxs] = useState<string[]>([]);
  const [error, setError] = useState<InvalidLine[]>([]);
  // Current group id from route params
  const { groupId } = useParams();

  function handleTemplateChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const input = e.target.value;
    setTemplate(input);
    if (input.length < 10) {
      setError([]);
      return;
    }
    const LINE_REGEX =
      /^\s*(?:"([^"]+)"|([^\d\s]+(?:\s+[^\d\s]+)*))\s*([\d\u0660-\u0669\s\-\+\(\)\.]+)?\s*$/u;
    const cleanInput = cleanInputInvisibleChars(input);
    const lines = cleanInput.split("\n");
    const invalidLines: InvalidLine[] = [];

    lines.forEach((line, index) => {
      if (line.trim() === "") {
        invalidLines.push({
          line: `Line ${index + 1}: "${line}"`,
          error: "Empty line",
          fix: "you must remove it from google sheet, before copying",
        });
      } else if (line.length > 60) {
        invalidLines.push({
          line: `Line ${index + 1}: "${line}"`,
          error: "Line too long",
          fix: "Shorten the name, keep unique for you to identify",
        });
      } else if (!LINE_REGEX.test(line)) {
        invalidLines.push({
          line: `Line ${index + 1}: "${line}"`,
          error: "Invalid format (should be: Name Phone)",
          fix: 'Format should be "Student Name" like this "Mahmoud Elnaggar"',
        });
      } else if (!isSafeInput(line)) {
        invalidLines.push({
          line: `Line ${index + 1}: "${line}"`,
          error: "this is not a valid input",
          fix: "Remove any special characters, SQL keywords, or script tags from the input",
        });
      }
    });

    setError(invalidLines);
    if (lines.length > 300) {
      setError([
        {
          line: "Template",
          error: "Template is too long (max 300 lines)",
          fix: "Reduce the number of lines to 300 or less by removing excess entries",
        },
      ]);
    }
  }

  // Fetch current students for this group
  const { data: allStudents = [] } = useGetStudentsQuery(
    groupId ? Number(groupId) : undefined
  );
  const students = allStudents?.filter((s) => s.is_active);

  // Bulk sync mutation
  const [syncStudents] = useSyncStudentsMutation();
  const [updateGroupDuplicatedIndices] =
    useUpdateGroupDuplicatedIndicesMutation();

  // Compute differences between parsed list and existing students
  const diff = useMemo(() => {
    const GenerateKey = (name: string, phoneLast3: string | number | null) =>
      `${name.trim().toLowerCase()}|${String(phoneLast3).slice(-3)}`;

    const currentSet = new Set(
      students.map((s) => GenerateKey(s.name, s.phone_last_3?.trim() ?? ""))
    );
    const incomingSet = new Set(
      parsed.map((p) => GenerateKey(p.name, p.phone_last_3?.trim() ?? ""))
    );
    const toAdd = parsed.filter(
      (p) => !currentSet.has(GenerateKey(p.name, p.phone_last_3?.trim() ?? ""))
    );
    const toRemove = students.filter(
      (s) => !incomingSet.has(GenerateKey(s.name, s.phone_last_3?.trim() ?? ""))
    );
    const toReactivate = students.filter(
      (s) =>
        !s.is_active &&
        incomingSet.has(GenerateKey(s.name, s.phone_last_3?.trim() ?? ""))
    );

    // Determine order updates for existing students
    const parsedMap = new Map(
      parsed.map((p) => [GenerateKey(p.name, p.phone_last_3 ?? ""), p])
    );
    const orderUpdates: OrderUpdate[] = students
      .map((s) => {
        const match = parsedMap.get(
          GenerateKey(s.name, s.phone_last_3?.trim() ?? "")
        );
        if (match && s.order_index !== match.order_index) {
          return {
            student_id: s.student_id,
            name: s.name,
            phone_last_3: s.phone_last_3 ?? "",
            order_index: match.order_index,
          };
        }
        return null;
      })
      .filter((s) => s !== null);

    return {
      toAdd,
      toRemove,
      toReactivate,
      orderUpdates,
    };
  }, [students, parsed]);

  const handleParsing = () => {
    const { parsed, duplicatesIdxs } = parseTemplate(template);
    setParsed(parsed);
    const duplicatesArray = Array.from(duplicatesIdxs);
    setLocalDuplicatesIdxs(duplicatesArray);
  };

  const handleProceed = async () => {
    if (groupId) {
      // Sync students
      await syncStudents({
        groupId: Number(groupId),
        toAdd: diff.toAdd,
        reactivateIds: diff.toReactivate.map((s) => s.student_id),
        deactivateIds: diff.toRemove.map((s) => s.student_id),
        orderUpdates: diff.orderUpdates,
      }).unwrap();

      // Update group's duplicated indices in database
      await updateGroupDuplicatedIndices({
        groupId: Number(groupId),
        duplicatedIdx: localDuplicatesIdxs,
      }).unwrap();
    }

    onClose();
  };

  return (
    <div className="bg-white rounded-lg max-w-3xl shadow-lg max-h-[90vh] min-w-96 md:min-w-3xl overflow-y-auto mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Template Manager
          </h2>
          <p className="text-sm text-gray-600">Group Name</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Template Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Template
          </label>
          <textarea
            value={template}
            placeholder="paste your template here"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            onChange={handleTemplateChange}
            onBlur={handleParsing}
          />
          {/* Diff indicator */}
          {error.length === 0 && <DiffIndicator parsed={parsed} diff={diff} />}
          {error.length > 0 && (
            <div className="text-red-500 text-sm mt-2">
              <div className="font-semibold mb-1">Invalid lines found:</div>
              <ul className="list-disc list-inside space-y-1">
                {error.map((err, index) => (
                  <li key={index} className="">
                    <span className="font-medium">
                      {err.line.slice(0, 20)}...
                    </span>
                    <span className="text-red-400"> - {err.error}</span>
                    <div className="ml-4 mt-1 text-emerald-700">
                      <span className="font-medium">How to fix: </span>
                      {err.fix}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Process Button */}
        <ProcessButton
          handleProceed={handleProceed}
          isDisabled={!template || error.length > 0}
        />
      </div>
    </div>
  );
};

export default TemplateManager;

function ProcessButton({
  handleProceed,
  isDisabled,
}: {
  handleProceed: () => void;
  isDisabled: boolean;
}) {
  return (
    <div className="flex justify-end mt-4">
      <button
        onClick={handleProceed}
        disabled={isDisabled}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiCheck size={16} />
        Create & Proceed
      </button>
    </div>
  );
}
