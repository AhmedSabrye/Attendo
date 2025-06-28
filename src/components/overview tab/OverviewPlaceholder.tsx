import { HiUserGroup } from "react-icons/hi";

export default function OverviewPlaceholder() {
  return (
    <div className="text-center py-12">
      <HiUserGroup className="text-6xl text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 mb-4">No students in template yet</p>
      <p className="text-sm text-gray-400 mb-6">Create a template in the Smart Attendance tab to see students here</p>
    </div>
  );
}
