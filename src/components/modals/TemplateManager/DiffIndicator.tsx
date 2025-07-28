import type { Student } from "@/utils/api";
import type { OrderUpdate, ParsedStudent } from "./TemplateManager";

interface Diff {
  toAdd: ParsedStudent[];
  toRemove: Student[];
  toReactivate: Student[];
  orderUpdates: OrderUpdate[];
}

export default function DiffIndicator({
  parsed,
  diff,
}: {
  parsed: ParsedStudent[];
  diff: Diff;
}) {
  if (parsed.length === 0) return null;
  if (
    diff.toAdd.length === 0 &&
    diff.toRemove.length === 0 &&
    diff.toReactivate.length === 0 &&
    diff.orderUpdates.length === 0
  ) {
    return <span className="text-gray-500">No changes detected</span>;
  }
  return (
    <div className="mt-2 text-sm">
      {diff.toAdd.length > 0 && (
        <span className="text-green-600 mr-4">+{diff.toAdd.length} to add</span>
      )}
      {diff.toRemove.length > 0 && (
        <span className="text-red-600">-{diff.toRemove.length} missing</span>
      )}
      {diff.toReactivate.length > 0 && (
        <span className="text-blue-600 mr-4">
          ↻{diff.toReactivate.length} to reactivate
        </span>
      )}
      {diff.orderUpdates.length > 0 && (
        <span className="text-purple-600 mr-4">
          ⇅{diff.orderUpdates.length} to reorder
        </span>
      )}
    </div>
  );
}
