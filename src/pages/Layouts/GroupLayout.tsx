import { Outlet, useParams } from "react-router";
import GroupHeader from "@/components/GroupHeader";
import AttendanceSheetModal from "@/components/modals/AttendanceSheetModal/AttendanceSheetModal";
import { useState } from "react";
import TemplateManager from "@/components/modals/TemplateManager/TemplateManager";
import { useGetStudentsQuery } from "@/stores/api";
import { toast } from "react-toastify";
import { useAppSelector } from "@/stores/hooks";

export default function GroupLayout() {
  const { groupId } = useParams();
  const { sidebarOpen } = useAppSelector((state) => state.modals);
  const [modal, setModal] = useState<0 | 1 | 2>(0);
  const { data: students } = useGetStudentsQuery(Number(groupId));

  function onOpenTemplateManagerModal() {
    setModal(1);
  }
  function onOpenAttendanceSheetModal() {
    if (students?.length === 0) {
      toast.error(
        "No students found in this group, please add students first",
        {
          toastId: "no-students-found",
        }
      );
      return;
    }
    setModal(2);
  }
  function onCloseModal() {
    setModal(0);
  }

  return (
    <div
      className={`md:p-4 p-2 ${sidebarOpen ? "overflow-hidden h-screen" : ""}`}
    >
      <GroupHeader
        onAttendanceSheetModalOpen={onOpenAttendanceSheetModal}
        onTemplateManagerModalOpen={onOpenTemplateManagerModal}
      />
      <Outlet key={groupId} />
      {/* modals */}
      {modal === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <AttendanceSheetModal onClose={onCloseModal} />
        </div>
      )}
      {modal === 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <TemplateManager onClose={onCloseModal} />
        </div>
      )}
    </div>
  );
}
