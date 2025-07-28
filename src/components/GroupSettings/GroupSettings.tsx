import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  HiPencil,
  HiCheck,
  HiXMark,
  HiUserGroup,
  HiCalendar,
  HiUser,
  HiClock,
} from "react-icons/hi2";
import { HashLoader } from "react-spinners";
import {
  useGetGroupQuery,
  useDeleteGroupMutation,
  useUpdateGroupDurationThresholdMutation,
} from "../../stores/api";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { toast } from "react-toastify";
import DangerZone from "./DangerZone";
import GroupCard from "./GroupCard";
import GroupSettingsHeader from "./GroupSettingsHeader";

export default function GroupSettings() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const numericGroupId = groupId ? parseInt(groupId, 10) : undefined;

  // Queries and mutations
  const { data: group, isLoading } = useGetGroupQuery(numericGroupId!);
  // const [updateGroup] = useUpdateGroupMutation();
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();

  // Local state
  // const [isEditingName, setIsEditingName] = useState(false);
  // const [newGroupName, setNewGroupName] = useState(group?.group_name || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [newDurationThreshold, setNewDurationThreshold] = useState(
    group?.duration_threshold?.toString() || "0"
  );
  const [updateGroupDurationThreshold] =
    useUpdateGroupDurationThresholdMutation();

  // const handleUpdateGroupName = async () => {
  // if (!numericGroupId || !newGroupName.trim()) return;

  //   try {
  //     await updateGroup({
  //       groupId: numericGroupId,
  //       updates: { group_name: newGroupName.trim() },
  //     }).unwrap();
  //     setIsEditingName(false);
  //   } catch (error) {
  //     console.error("Failed to update group name:", error);
  //   }
  // };

  const handleDeleteGroup = async () => {
    if (!numericGroupId) return;

    try {
      await deleteGroup(numericGroupId).unwrap();
      navigate("/groups");
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  const handleUpdateDurationThreshold = async () => {
    setIsEditingDuration(false);
    const result = await updateGroupDurationThreshold({
      groupId: numericGroupId!,
      durationThreshold: parseInt(newDurationThreshold, 10),
    });
    if (result.data) {
      toast.success("Duration threshold updated successfully");
    } else {
      toast.error("Failed to update duration threshold");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl"></div>
          <HashLoader color="#6366f1" />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
          <p className="text-gray-500">Group not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GroupSettingsHeader />

      {/* Group Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group Name Card */}
        <GroupCard
          text={group.group_name}
          title="Group Name"
          onClick={() => {
            toast.info("This feature is not available yet", {
              toastId: "group-name-edit-not-available",
            });
          }}
        >
          <HiUserGroup className="text-lg text-emerald-600" />
        </GroupCard>

        {/* Created Date Card */}
        <GroupCard
          text={new Date(group.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          title="Created Date"
        >
          <HiCalendar className="text-lg text-emerald-600" />
        </GroupCard>

        {/* Owner Card */}
        <GroupCard text={group.Users?.username || "Unknown"} title="Owner">
          <HiUser className="text-lg text-emerald-600" />
        </GroupCard>

        {/* Duration Threshold Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <HiClock className="text-lg text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Duration Threshold
              </h3>
            </div>
          </div>
          {isEditingDuration ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={newDurationThreshold}
                onChange={(e) => setNewDurationThreshold(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter duration threshold"
              />
              <button
                onClick={handleUpdateDurationThreshold}
                disabled={!newDurationThreshold.trim()}
                className="p-2 text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
              >
                <HiCheck className="text-lg" />
              </button>
              <button
                onClick={() => {
                  setIsEditingDuration(false);
                  setNewDurationThreshold(
                    group.duration_threshold?.toString() || "0"
                  );
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <HiXMark className="text-lg" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                {group.duration_threshold || 0} minutes
              </span>
              <button
                onClick={() => setIsEditingDuration(true)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <HiPencil className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>

      <DangerZone
        setShowDeleteConfirm={setShowDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          displayedName={group.group_name}
          setShowDeleteConfirm={setShowDeleteConfirm}
          handleDeleteGroup={handleDeleteGroup}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
