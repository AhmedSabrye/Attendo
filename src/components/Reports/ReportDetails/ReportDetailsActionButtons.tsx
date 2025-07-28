import { useState } from "react";
import { copyToClipboard } from "@/utils/copyToClipboard";
import type { AttendanceReport } from "@/types/api";

export default function ReportDetailsActionButtons({
  report,
  order,
  handleOrderChange,
}: {
  report: AttendanceReport;
  order: string;
  handleOrderChange: (order: string) => void;
}) {
  const [isCopied, setIsCopied] = useState(false);


  return (
    <div className="flex items-center gap-2 flex-col">
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded-md transition-colors cursor-pointer text-sm w-full  duration-500 ${
          isCopied ? "bg-green-500" : ""
        }`}
        onClick={async () => {
          const success = await copyToClipboard(report);
          if (success) {
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 2000);
          } else {
            setIsCopied(false);
          }
        }}
      >
        {isCopied ? "Copied!" : "Copy to Google Sheets"}
      </button>
      <div className="flex items-center justify-around gap-2 w-full">
        <label
          htmlFor="order"
          className="text-sm text-gray-600 font-semibold min-w-fit"
        >
          Order by
        </label>
        <select
          id="order"
          className="w-full text-sm text-gray-600 bg-gray-100 rounded-md p-2"
          value={order}
          onChange={(e) => {
            handleOrderChange(e.target.value);
          }}
        >
          <option value="alphabetical">Alphabetical</option>
          <option value="template">Same order as sheet</option>
        </select>
      </div>
    </div>
  );
}
