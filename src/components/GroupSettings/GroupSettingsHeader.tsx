import { HiCog } from "react-icons/hi";

export default function GroupSettingsHeader() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
      <div className="p-2 bg-emerald-100 rounded-lg">
        <HiCog className="text-xl text-emerald-600" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Group Settings</h1>
        <p className="text-gray-500 mt-1">Manage your group configuration</p>
      </div>
    </div>
  );
}
