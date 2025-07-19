import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  HiTrash,
  HiPencil,
  HiExclamationTriangle,
  HiCheck,
  HiXMark,
  HiUserGroup,
  HiCalendar,
  HiUser,
  HiClock,
  HiCog,
} from "react-icons/hi2";
import { HashLoader } from "react-spinners";
import {
  useGetGroupQuery,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupDurationThresholdMutation,
} from "../../stores/api";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { toast } from "react-toastify";

export default function GroupSettings() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const numericGroupId = groupId ? parseInt(groupId, 10) : undefined;

  // Queries and mutations
  const { data: group, isLoading } = useGetGroupQuery(numericGroupId!);
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();

  // Local state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(group?.group_name || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [newDurationThreshold, setNewDurationThreshold] = useState(
    group?.duration_threshold?.toString() || "0"
  );
  const [updateGroupDurationThreshold, { isLoading: isUpdatingDuration }] = useUpdateGroupDurationThresholdMutation();    

  const handleUpdateGroupName = async () => {
    if (!numericGroupId || !newGroupName.trim()) return;

    try {
      await updateGroup({
        groupId: numericGroupId,
        updates: { group_name: newGroupName.trim() },
      }).unwrap();
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to update group name:", error);
    }
  };

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
    // Dummy function - will be implemented later
    console.log("Updating duration threshold to:", newDurationThreshold);
    setIsEditingDuration(false);
    toast.success("Duration threshold updated successfully");
    const result = await updateGroupDurationThreshold({
      groupId: numericGroupId!,
      durationThreshold: parseInt(newDurationThreshold, 10),
    });
    console.log(result);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <HiCog className="text-xl text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Group Settings
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your group configuration
            </p>
          </div>
        </div>
      </div>

      {/* Group Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group Name Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <HiUserGroup className="text-lg text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Group Name</h3>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900 truncate">
              {group.group_name}
            </span>
            <button
              onClick={() => {
                toast.info("This feature is not available yet", {
                  toastId: "group-name-edit-not-available",
                });
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <HiPencil className="text-sm" />
            </button>
          </div>
        </div>

        {/* Created Date Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <HiCalendar className="text-lg text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Created Date
              </h3>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(group.created_at).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {getRelativeTime(group.created_at)}
            </p>
          </div>
        </div>

        {/* Owner Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <HiUser className="text-lg text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Owner</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-sm">
              {(group.Users?.username || "U").charAt(0).toUpperCase()}
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {group.Users?.username || "Unknown"}
            </span>
          </div>
        </div>

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

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <HiExclamationTriangle className="text-xl text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
            <p className="text-red-600 mt-1">Irreversible actions</p>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-900 mb-2">
                Delete Group
              </h4>
              <p className="text-red-700 text-sm">
                This action cannot be undone. This will permanently delete the
                group and all associated data including students and attendance
                records.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              <HiTrash className="text-sm" />
              Delete Group
            </button>
          </div>
        </div>
      </div>

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
