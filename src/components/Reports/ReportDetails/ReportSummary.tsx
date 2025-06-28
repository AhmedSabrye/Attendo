

export default function ReportSummary({ report }: { report: any }) {
  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">CSV Records:</span>
          <span className="font-medium">{report.summary.total}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Matched:</span>
          <span className="font-medium text-green-600">{report.summary.matched}</span>
        </div>
        {report.summary.unmatched > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Unmatched:</span>
            <span className="font-medium text-red-600">{report.summary.unmatched}</span>
          </div>
        )}
        {report.summary.conflicts > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Conflicts:</span>
            <span className="font-medium text-yellow-600">{report.summary.conflicts}</span>
          </div>
        )}
      </div>
    </div>
  );
}
