// Re-export all types
export * from "../../types/api";

// Import and re-export all API modules
export { userApi } from "./userApi";
export { groupsApi } from "./groupsApi";
export { studentsApi } from "./studentsApi";
export { attendanceApi } from "./attendanceApi";
export { reportsApi } from "./reportsApi";
export { handleRpcCall } from "./helpers";

// Import individual modules for default export
import { userApi } from "./userApi";
import { groupsApi } from "./groupsApi";
import { studentsApi } from "./studentsApi";
import { attendanceApi } from "./attendanceApi";
import { reportsApi } from "./reportsApi";

// ==================== EXPORT ALL APIs ====================
// Maintain backward compatibility with the original default export structure
const supabaseApi = {
  user: userApi,
  groups: groupsApi,
  students: studentsApi,
  attendance: attendanceApi,
  reports: reportsApi,
};

export default supabaseApi;
