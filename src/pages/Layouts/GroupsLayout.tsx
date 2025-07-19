import { Outlet } from "react-router";
import GroupsSidebar from "../../components/Sidebar";
import CreateGroupModal from "@/components/modals/CreateGroupModal";
import { toggleCreateGroupModal } from "@/stores/modals";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { useCreateGroupMutation, useGetCurrentUserQuery } from "@/stores/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function GroupsLayout() {
  const navigate = useNavigate();
  const { createGroupModalOpen } = useAppSelector((state) => state.modals);
  const dispatch = useAppDispatch();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const [createGroupMutation] = useCreateGroupMutation();
  const { data: currentUser } = useGetCurrentUserQuery(authUser);
  const handleCreateGroup = async (groupData: { name: string }) => {
    if (!currentUser) return;
    try {
      const res = await createGroupMutation({
        userId: Number(currentUser.user_id),
        groupName: groupData.name,
      }).unwrap();
      toast.success("Group created successfully");
      navigate(`/groups/${res.group_id}/overview`);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <GroupsSidebar />
        <div className="flex flex-col min-w-64 flex-1 h-full">
          <Outlet />
        </div>
      </div>
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
