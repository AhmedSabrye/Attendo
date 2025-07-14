import { Outlet, useParams } from "react-router";
import GroupHeader from "@/components/GroupHeader";
import AttendanceSheetModal from "@/components/modals/AttendanceSheetModal/AttendanceSheetModal";
import { useState } from "react";
import TemplateManager from "@/components/modals/TemplateManager/TemplateManager";
import { useCreateGroupMutation, useGetCurrentUserQuery, useGetStudentsQuery } from "@/stores/api";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import CreateGroupModal from "@/components/modals/CreateGroupModal";
import { toggleCreateGroupModal } from "@/stores/modals";

export default function GroupLayout() {
  const { groupId } = useParams();
  const { sidebarOpen, createGroupModalOpen } = useAppSelector((state) => state.modals);
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState<0 | 1 | 2>(0);
  const { data: students } = useGetStudentsQuery(Number(groupId));
  const { user: authUser } = useAppSelector((state) => state.auth);
  const [createGroupMutation] = useCreateGroupMutation();
  const { data: currentUser } = useGetCurrentUserQuery(authUser);

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


  const handleCreateGroup = async (groupData: { name: string }) => {
    if (!currentUser) return;
    try {
      await createGroupMutation({
        userId: Number(currentUser.user_id),
        groupName: groupData.name,
      }).unwrap();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div
      className={`md:p-4 p-2 ${sidebarOpen ? "overflow-hidden h-screen" : ""}`}
    >
      <GroupHeader
      
        onAttendanceSheetModalOpen={onOpenAttendanceSheetModal}
      />
      <Outlet key={groupId} />
      {/* modals */}
      {modal === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* <AttendanceSheetModal onClose={onCloseModal} /> */}
        </div>
      )}
      {modal === 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* <TemplateManager
            onClose={onCloseModal}
          /> */}
        </div>
      )}
      {createGroupModalOpen && (
          <CreateGroupModal
            isOpen={createGroupModalOpen}
            onClose={() => dispatch(toggleCreateGroupModal())}
            onCreateGroup={handleCreateGroup}
          />
        )}
    </div>
  );
}
