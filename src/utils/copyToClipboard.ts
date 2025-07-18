  // Function to generate attendance data for copying
  export const generateCopiedFormat = (report: any) => {
    if (!report?.students) return "";

    // Always use order_index for the copy functionality to match the original sheet order
    const studentsInSheetOrder = [...report.students].sort((a: any, b: any) => a.order_index - b.order_index);

    return studentsInSheetOrder
      .map((student: any) => {
        if (student.status === "attended") {
          return "TRUE";
        } else if (student.status === "absent") {
          return "FALSE";
        } else if (student.status === "partial") {
          return student.duration_minutes.toString();
        }
        return "FALSE"; // fallback
      })
      .join("\n");
  };

  // Function to copy attendance data to clipboard
  export const copyToClipboard = async (report: any) => {
    try {
      const data = generateCopiedFormat(report);
      await navigator.clipboard.writeText(data);
      return true;
    } catch (err) {
      return false;
    }
  };