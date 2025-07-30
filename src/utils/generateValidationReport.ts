import type { ValidationReport } from "./parse";
import type { SessionReport } from "./generateSessionAttendanceReport";
import type { Student } from "./api";

export function generateValidationReport(
  sessionReport: SessionReport,
  groupStudents: Student[]
): ValidationReport {
  const { comparison, absentStudents } = sessionReport;

  const totalStudents = groupStudents.length;
  const totalDuration = comparison.reduce((sum, record) => sum + record.duration, 0);

  const averageDuration = comparison.length > 0 ? Math.round(totalDuration / comparison.length) : 0;

  const report: ValidationReport = {
    isValid: true,
    summary: {
      totalStudents,
      attendedStudents: totalStudents - absentStudents.length || 0,
      averageDuration,
      absentStudents: absentStudents.length,
    },
  };
  return report;
}