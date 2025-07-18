import { HiCheck, HiX } from "react-icons/hi";

export default function OverviewLegend() {
  return (
    <div className="px-6 pb-6 hidden md:flex gap-4 items-center">
        <span className="text-gray-600 font-medium">Legend:</span>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 text-green-600">
            <HiCheck className="text-sm" />
          </div>
          <span className="text-gray-600">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-50 text-yellow-600">
            <span className="text-xs font-bold">~</span>
          </div>
          <span className="text-gray-600">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-600">
            <HiX className="text-sm" />
          </div>
          <span className="text-gray-600">Absent</span>
        </div>
    </div>
  );
}
