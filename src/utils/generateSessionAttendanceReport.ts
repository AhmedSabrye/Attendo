import type { Student } from "./api";
import type { AttendanceRecord } from "./parse";
export interface ComparisonRecord extends AttendanceRecord {
  studentId: number;
  attendance_alias?: string | null;
}
export interface FinalComparisonRecord extends ComparisonRecord {
  isAbsent?: boolean;
  isMatched?: boolean;
}
export interface SessionReport {
  comparison: FinalComparisonRecord[];
  notMatchedStudents: AttendanceRecord[];
  absentStudents: FinalComparisonRecord[];
}
// this one will compare the students in the group with the students in the attendance sheet
// if

export function generateSessionAttendanceReport(
  attendanceSheet: AttendanceRecord[],
  groupStudents: Student[],
  duplicatesIdxs: string[],
  durationThreshold: number
) {
  const comparison: FinalComparisonRecord[] = [];
  const attendanceSheetCopy = [...attendanceSheet];
  const groupStudentsCopy = structuredClone(groupStudents);

  groupStudentsCopy.forEach((student, groupIndex) => {
    attendanceSheetCopy.forEach((record, index) => {
      // Convert phone numbers to 3-digit strings with leading zeros for comparison
      const studentPhone = student.phone_last_3?.padStart(3, "0") ?? "";
      const recordPhone = record.phoneId
        ? String(record.phoneId).padStart(3, "0")
        : null;

      const phoneMatch = recordPhone === studentPhone;
      const aliasMatch =
        record.studentName.trim().toLowerCase() ===
        (student.attendance_alias ?? "").trim().toLowerCase();
      // console.table({phoneMatch, aliasMatch, recordPhone, studentPhone, studentName: student.name, recordName: record.studentName});
      // if the student has 3 digits id and not duplication, take the name of it to make it attendance_alias
      if (!duplicatesIdxs.includes(recordPhone!)) {
        // the normal flow, if the phone matches or the alias matches, we add the record to the comparison
        if (phoneMatch || aliasMatch) {
          const existingRecord = comparison.find(
            (c) => c.studentName === student.name
          );
          // if the record is already in the comparison, we add the duration to it
          if (existingRecord) {
            existingRecord.duration += record.duration;
            // existingRecord.attendance_alias = aliasMatch ? student.attendance_alias : record.studentName;
          } else {
            comparison.push({
              studentName: student.name ?? "",
              studentId: student.student_id ?? 0,
              phoneId: studentPhone,
              duration: record.duration ?? 0,
              attendance_alias: aliasMatch
                ? student.attendance_alias ?? null
                : record.studentName,
              isAbsent: record.duration < durationThreshold,
              isMatched: true,
            });
          }
          attendanceSheetCopy.splice(index, 1);
          groupStudentsCopy[groupIndex].isMatched = true;
        }
      }
    });
    if (!groupStudentsCopy[groupIndex].isMatched) {
      comparison.push({
        studentName: student.name ?? "",
        studentId: student.student_id ?? 0,
        phoneId: student.phone_last_3 ?? null,
        duration: 0,
        attendance_alias: student.attendance_alias ?? null,
        isAbsent: true,
        isMatched: false,
      });
    }
  });

  const absentStudents = comparison.filter(
    (student) => !student.isMatched || student.isAbsent
  );
  // handle
  return {
    comparison,
    notMatchedStudents: attendanceSheetCopy,
    absentStudents,
  };
}
