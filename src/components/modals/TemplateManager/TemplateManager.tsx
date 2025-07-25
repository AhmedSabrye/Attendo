import { useState, useMemo } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { useParams } from "react-router";
import { parseTemplate } from "@/utils/parse";
import { useGetStudentsQuery, useSyncStudentsMutation, useUpdateGroupDuplicatedIndicesMutation } from "@/stores/api";
import DiffIndicator from "./DiffIndicator";
import type { Student } from "@/utils/api";

interface TemplateManagerProps {
  onClose: () => void;
}
export interface ParsedStudent extends Pick<Student, "name" | "phone_last_3" | "order_index"> {}
export interface OrderUpdate extends Pick<Student, "student_id" | "name" | "phone_last_3" | "order_index"> {}

const TemplateManager = ({ onClose }: TemplateManagerProps) => {
  const [template, setTemplate] = useState("");
  const [parsed, setParsed] = useState<ParsedStudent[]>([]);
  const [localDuplicatesIdxs, setLocalDuplicatesIdxs] = useState<string[]>([]);
  // Current group id from route params
  const { groupId } = useParams();

  // Fetch current students for this group
  const { data: allStudents = [] } = useGetStudentsQuery(groupId ? Number(groupId) : undefined);
  const students = allStudents?.filter((s) => s.is_active);

  // Bulk sync mutation
  const [syncStudents] = useSyncStudentsMutation();
  const [updateGroupDuplicatedIndices] = useUpdateGroupDuplicatedIndicesMutation();

  // Compute differences between parsed list and existing students
  const diff = useMemo(() => {
    const key = (name: string, phoneLast3: string | number | null) => `${name.trim().toLowerCase()}|${String(phoneLast3).slice(-3)}`;

    const currentSet = new Set(students.map((s) => key(s.name, s.phone_last_3?.trim() ?? "")));
    const incomingSet = new Set(parsed.map((p) => key(p.name, p.phone_last_3?.trim() ?? "")));
    const toAdd = parsed.filter((p) => !currentSet.has(key(p.name, p.phone_last_3?.trim() ?? "")));
    const toRemove = students.filter((s) => !incomingSet.has(key(s.name, s.phone_last_3?.trim() ?? "")));
    const toReactivate = students.filter((s) => !s.is_active && incomingSet.has(key(s.name, s.phone_last_3?.trim() ?? "")));

    // Determine order updates for existing students
    const parsedMap = new Map(parsed.map((p) => [key(p.name, p.phone_last_3 ?? ""), p]));
    const orderUpdates: OrderUpdate[] = students
      .map((s) => {
        const match = parsedMap.get(key(s.name, s.phone_last_3?.trim() ?? ""));
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
    <div className="bg-white rounded-lg shadow-lg max-h-[90vh] min-w-96 md:min-w-3xl overflow-y-auto mx-auto">
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
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            onBlur={handleParsing}
            placeholder="paste your template here"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          />
          {/* Diff indicator */}
          <DiffIndicator parsed={parsed} diff={diff} />
        </div>

        {/* Process Button */}
        <ProcessButton handleProceed={handleProceed} />
      </div>
    </div>
  );
};

export default TemplateManager;

function ProcessButton({ handleProceed }: { handleProceed: () => void }) {
  return (
    <div className="flex justify-end mt-4">
      <button
        onClick={handleProceed}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        <FiCheck size={16} />
        Create & Proceed
      </button>
    </div>
  );
}
