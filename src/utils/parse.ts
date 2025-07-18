// Types
export interface AttendanceRecord {
  studentName: string;
  phoneId: string | null;
  duration: number;
  done?: boolean;
}
export interface ComparisonRecord extends AttendanceRecord {
  studentId: number;
  attendance_alias?: string | null;
}
export interface ValidationReport {
  isValid: boolean;
  summary: {
    totalStudents: number;
    validRecords: number;
    recordsWithIds: number;
    averageDuration: number;
    absentStudents: number;
  };
  columnDetection?: {
    nameColumn?: string;
    durationColumn?: string;
  };
  warnings: string[];
}

import Papa from "papaparse";
import type { Student } from "./api";
import type { ParsedStudent } from "@/components/modals/TemplateManager/TemplateManager";

export function parseTemplate(csv: string): {
  parsed: ParsedStudent[];
  duplicatesIdxs: Set<string>;
} {
  const parseResult = Papa.parse(csv, {
    header: false,
    skipEmptyLines: true,
    transform: (value: string) => value.trim(),
  });
  const rows = parseResult.data as string[][];
  const parsed: ParsedStudent[] = [];
  const duplicatesIdxs: Set<string> = new Set();

  rows.forEach((row, idx) => {
    const name = row[0].trim();
    const fullNumber = row[1]?.trim();
    // Clean the number string and take last 3 digits
    const cleanNumber = fullNumber ? fullNumber.replace(/[^\d]/g, "") : null;
    const phoneId = cleanNumber ? cleanNumber.slice(-3) : null;

    const index = parsed.find((p) => p.phone_last_3 === phoneId);
    if (index && phoneId) {
      duplicatesIdxs.add(phoneId);
    }

    parsed.push({
      name: name,
      phone_last_3: phoneId ?? "",
      order_index: idx,
    });
  });

  return { parsed, duplicatesIdxs };
}

export function parseAttendanceSheet(csv: string): AttendanceRecord[] {
  // Parse CSV with papaparse
  const parseResult = Papa.parse(csv, {
    header: false,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
    transform: (value: string) => value.trim(),
  });

  if (parseResult.errors.length > 0) {
    console.error("CSV parsing errors:", parseResult.errors);
  }

  const rows = parseResult.data as string[][];
  if (rows.length === 0) {
    return [];
  }

  // Find the header row by looking for key columns
  let headerRowIndex = -1;
  let nameColumnIndex = -1;
  let durationColumnIndex = -1;
  // feature will be added later
  // let emailColumnIndex = -1;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    // Check if this row contains header-like content
    const lowerRow = row.map((cell) => cell.toLowerCase().trim());

    const nameIndex = lowerRow.findIndex((cell) => cell.includes("name") && !cell.includes("email"));
    const durationIndex = lowerRow.findIndex((cell) => cell.includes("duration") || cell.includes("minutes"));
    // const emailIndex = lowerRow.findIndex((cell) => cell.includes("email"));

    // If we found at least name column, consider this the header row
    if (nameIndex !== -1) {
      headerRowIndex = i;
      nameColumnIndex = nameIndex;
      durationColumnIndex = durationIndex;
      // emailColumnIndex = emailIndex;
      break;
    }
  }

  if (headerRowIndex === -1 || nameColumnIndex === -1) {
    console.error("Could not find header row or name column");
    return [];
  }

  // Parse data rows
  const parsed: AttendanceRecord[] = [];

  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const studentNameFull = row[nameColumnIndex]?.trim() || "";
    if (!studentNameFull) continue;

    // Get duration - try the detected duration column first, then fallback to common positions
    let duration = 0;
    if (durationColumnIndex !== -1 && row[durationColumnIndex]) {
      duration = parseInt(row[durationColumnIndex], 10);
    }

    // Extract phone ID as the last sequence of 3+ digits in the name
    const phoneMatch = studentNameFull.match(/([\d\u0660-\u0669\u06F0-\u06F9]{3,})/);
    let phoneId: string | null = null;

    if (phoneMatch) {
      const digits = phoneMatch[1];
      if (digits.match(/[\u0660-\u0669\u06F0-\u06F9]/)) {
        // Handle Arabic/Persian digits
        phoneId = normalizeDigits(digits).slice(-3).padStart(3, "0");
      } else {
        // Handle regular digits
        phoneId = digits.slice(-3).padStart(3, "0");
      }
    }

    const studentName = studentNameFull.replace(phoneMatch?.[0] || "", "").trim();
    const existingRecord = parsed.find((c) => c.phoneId === phoneId && c.studentName === studentName);
    if (existingRecord) {
      existingRecord.duration = existingRecord.duration + duration;
      continue;
    }
    
    parsed.push({
      studentName,
      phoneId,
      duration,
    });
  }
  
  return parsed;
}
// this one will compare the students in the group with the students in the attendance sheet
// if
export function generateSessionAttendanceReport(attendanceSheet: AttendanceRecord[], groupStudents: Student[], duplicatesIdxs: string[]) {
  const comparison: ComparisonRecord[] = [];
  const attendanceSheetCopy = [...attendanceSheet];
  const groupStudentsCopy = structuredClone(groupStudents);
  groupStudentsCopy.forEach((student, groupIndex) => {
    attendanceSheetCopy.forEach((record, index) => {
      // Convert phone numbers to 3-digit strings with leading zeros for comparison
      const studentPhone = student.phone_last_3.padStart(3, "0");
      const recordPhone = record.phoneId ? String(record.phoneId).padStart(3, "0") : null;

      const phoneMatch = recordPhone === studentPhone;
      const aliasMatch = record.studentName.trim().toLowerCase() === (student.attendance_alias ?? "").trim().toLowerCase();
      // console.table({phoneMatch, aliasMatch, recordPhone, studentPhone, studentName: student.name, recordName: record.studentName});
      // if the student has 3 digits id and not duplication, take the name of it to make it attendance_alias
      if (!duplicatesIdxs.includes(recordPhone!)) {
        
        // the normal flow, if the phone matches or the alias matches, we add the record to the comparison
        if (phoneMatch || aliasMatch) {
          const existingRecord = comparison.find((c) => c.studentName === student.name);
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
              attendance_alias: aliasMatch ? student.attendance_alias ?? null : record.studentName,
            });
          }
          if (record.duration < 40 && !existingRecord) {
            groupStudentsCopy[groupIndex].isAbsent = true;
          }
          attendanceSheetCopy.splice(index, 1);
          groupStudentsCopy[groupIndex].isMatched = true;
        }
      }
      
    });
  });

  const absentStudents = groupStudentsCopy.filter((student) => !student.isMatched || student.isAbsent);
  
  return { comparison, notMatchedStudents: attendanceSheetCopy, absentStudents: absentStudents };
}

export function generateValidationReport(
  sessionReport: { comparison: ComparisonRecord[]; notMatchedStudents: AttendanceRecord[]; absentStudents: Student[] },
  groupStudents: Student[]
): ValidationReport {
  const warnings: string[] = [];
  const { comparison, notMatchedStudents, absentStudents } = sessionReport;

  const totalStudents = groupStudents.length;
  const validRecords = comparison.length;
  const totalDuration = comparison.reduce((sum, record) => sum + record.duration, 0);
  //todo: change this field
  const recordsWithIds = comparison.filter((record) => record.phoneId !== null).length;

  //todo: phoneId duplication should be in parsing phase
  const phoneIdCount: Record<string, number> = {};
  comparison.forEach((record) => {
    if (record.phoneId !== null) {
      const phoneIdStr = record.phoneId.toString();
      phoneIdCount[phoneIdStr] = (phoneIdCount[phoneIdStr] || 0) + 1;
    }
  });

  // Duplicate analysis
  const duplicatePhoneIds = Object.keys(phoneIdCount).filter((id) => phoneIdCount[id] > 1);
  const duplicateNames = comparison
    .filter((record) => record.phoneId !== null && duplicatePhoneIds.includes(record.phoneId.toString()))
    .map((record) => record.studentName);

  if (duplicatePhoneIds.length > 0) {
    warnings.push(`Duplicate phone IDs found: ${duplicatePhoneIds.join(", ")}`);
  }

  if (notMatchedStudents.length > 0) {
    warnings.push(`${notMatchedStudents.length} students from attendance sheet could not be matched`);
  }

  if (duplicateNames.length > 0) {
    warnings.push(`Duplicate names found: ${duplicateNames.join(", ")}`);
  }

  const averageDuration = validRecords > 0 ? Math.round(totalDuration / validRecords) : 0;

  const report: ValidationReport = {
    isValid: warnings.length === 0,
    summary: {
      totalStudents,
      validRecords: comparison.length,
      recordsWithIds,
      averageDuration,
      absentStudents: absentStudents.length,
    },
    columnDetection: {
      nameColumn: "Name (auto-detected)",
      durationColumn: "Duration (auto-detected)",
    },
    warnings,
  };

  return report;
}

// this function is used to normalize the digits if someone wrote his numbers in arabic
function normalizeDigits(input: string) {
  return input.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 0x0660 && code <= 0x0669) {
      return String(code - 0x0660); // Arabic-Indic
    }
    if (code >= 0x06f0 && code <= 0x06f9) {
      return String(code - 0x06f0); // Eastern Arabic-Indic
    }
    return char; // fallback, shouldn't happen
  });
}
