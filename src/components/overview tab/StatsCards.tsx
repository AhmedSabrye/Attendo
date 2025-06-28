import { HiCalendar, HiUserGroup } from "react-icons/hi";

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Students */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">10</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <HiUserGroup className="text-2xl text-blue-600" />
          </div>
        </div>
      </div>

      {/* Sessions Held */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Sessions Held</p>
            <p className="text-2xl font-bold text-gray-900">10</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <HiCalendar className="text-2xl text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
