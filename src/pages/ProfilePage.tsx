import React, { useState } from "react";
import {
  HiUser,
  HiEnvelope,
  HiCalendar,
  HiClock,
  HiUserGroup,
  HiClipboardDocumentList,
  HiCog,
  HiPencil,
  HiCheck,
  HiXMark,
} from "react-icons/hi2";
import { useAppSelector } from "../stores/hooks";
import {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
} from "../stores/api";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data: userProfile, isLoading } = useGetCurrentUserQuery(authUser);
  const userStats = {
    totalGroups: 10,
    totalAttendanceRecords: 30,
    activeSessions: 10,
  }
  const [updateUser] = useUpdateUserMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: userProfile?.username || "",
    email: userProfile?.email || "",
  });

  const handleEdit = () => {
    setEditForm({
      username: userProfile?.username || "",
      email: userProfile?.email || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!userProfile) return;

    try {
      await updateUser({
        userId: userProfile.user_id,
        updates: {
          username: editForm.username,
          email: editForm.email,
        },
      }).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account settings and view your activity
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
                    <HiUser className="text-2xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {userProfile?.username || "User"}
                    </h2>
                    <p className="text-gray-600">{userProfile?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <HiPencil className="text-sm" />
                  Edit
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) =>
                        setEditForm({ ...editForm, username: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      <HiCheck className="text-sm" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <HiXMark className="text-sm" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <HiUser className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-medium">{userProfile?.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HiEnvelope className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{userProfile?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HiCalendar className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Member since</p>
                      <p className="font-medium">
                        {userProfile?.created_at
                          ? new Date(
                              userProfile.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiCog className="text-gray-400" />
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-600">
                      Update your account password
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                    Update
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Notification Preferences
                    </p>
                    <p className="text-sm text-gray-600">
                      Manage your email notifications
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <HiUserGroup className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Groups</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {userStats?.totalGroups || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <HiClipboardDocumentList className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Attendance Records</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {userStats?.totalAttendanceRecords || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <HiClock className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Sessions</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {userStats?.activeSessions || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
