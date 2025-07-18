import { HiCalendar, HiUserGroup } from "react-icons/hi";

interface StatsCardsProps {
  loading: boolean;
  totalStudents: number;
  totalSessions: number;
}

export default function StatsCards({ loading, totalStudents, totalSessions }: StatsCardsProps) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 ${loading ? "opacity-50" : ""}`}>
      {/* Total Students */}
      <div className="bg-white gap-3 p-3 md:p-6  rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <HiUserGroup className="text-2xl text-blue-600" />
          </div>
        </div>
      </div>

      {/* Sessions Held */}
      <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Sessions Held</p>
            <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <HiCalendar className="text-2xl text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
