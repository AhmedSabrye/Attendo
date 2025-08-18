import OverviewLegend from "./OverviewLegend";
import OverviewPlaceholder from "./OverviewPlaceholder";
import StatsCards from "./StatsCards";
import AttendanceToggleModal from "../modals/AttendanceToggleModal";
import { HashLoader } from "react-spinners";
import OverviewTable from "./OverviewTable";
import { useOverview } from "./useOverview";

export default function OverviewTab() {
  const {
    students,
    attendance,
    reports,
    groupId,
    totalStudents,
    totalSessions,
    isLoading,
    isUpdating,
    selectedStudent,
    handleSelectingStudent,
    toggleStudentSessionStatus,
    closeModal,
  } = useOverview();

  return (
    <div className="mb-10">
      <div className="mb-6">
        <StatsCards
          loading={isLoading}
          totalStudents={totalStudents}
          totalSessions={totalSessions}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Students Attendance Matrix
              </h3>
            </div>
          </div>
        </div>

        {/* Attendance Matrix */}
        <div className="md:p-3">
          {totalStudents > 0 ? (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <OverviewTable
                attendance={attendance}
                totalSessions={totalSessions}
                students={students}
                groupId={groupId}
                reports={reports}
                handleSelectingStudent={handleSelectingStudent}
              />
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center min-h-45">
              <HashLoader color="#10b981" />
            </div>
          ) : (
            <OverviewPlaceholder />
          )}
        </div>

        {totalStudents > 0 && totalSessions > 0 && <OverviewLegend />}
      </div>

      {selectedStudent && (
        <AttendanceToggleModal
          student={{
            name: selectedStudent.student.name,
            attended: selectedStudent.attended,
          }}
          loading={isUpdating}
          onClose={closeModal}
          onConfirm={() => toggleStudentSessionStatus(selectedStudent)}
        />
      )}
    </div>
  );
}
