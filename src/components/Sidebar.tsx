import React from "react";
import { HiUserGroup, HiPlus, HiTrash, HiArrowRightOnRectangle, HiXMark } from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { Link, useParams, useNavigate } from "react-router";
import type { Group } from "../utils/api";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { useSignOutMutation } from "@/stores/auth.slice";
import { toggleCreateGroupModal, toggleSidebar } from "@/stores/modals";
import { useDeleteGroupMutation, useGetGroupsQuery } from "@/stores/api";
import { toast } from "react-toastify";

export default function GroupsSidebar() {
  const { groupId } = useParams();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [signOut] = useSignOutMutation();
  const sidebarOpen = useAppSelector((state) => state.modals.sidebarOpen);
  const navigate = useNavigate();

  // Queries & Mutations
  const { data: groups, isLoading: groupsLoading } = useGetGroupsQuery();
  const [deleteGroupMutation] = useDeleteGroupMutation();
  const reversedGroups = [...(groups ?? [])]?.reverse();

  const handleDeleteGroup = async (e: React.MouseEvent<HTMLButtonElement>, group: Group) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${group.group_name}"?`)) {
      try {
        await deleteGroupMutation(group.group_id).unwrap();
        toast.success("Group deleted successfully");
        navigate("/groups");
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="">
      <div
        onClick={() => dispatch(toggleSidebar())}
        className={`fixed md:relative z-50 top-0 right-0 left-0 bottom-0  bg-black/40 transition-all duration-500 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
      <div
        className={`flex min-h-screen flex-col fixed md:static z-50 top-0 right-0 left-0 bottom-0 sm:bottom-auto sm:right-auto transition duration-500 md:translate-x-0 bg-white lg:relative min-w-64 px-4 py-8 shadow-md ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full "
        }`}
      >
        <button onClick={() => dispatch(toggleSidebar())} className="text-gray-500 md:hidden absolute top-2 right-2 hover:text-gray-700">
          <HiXMark className="text-2xl" />
        </button>
        <div className="mb-5">
          <Link
            to="/"
            className="text-gray-900 text-base leading-normal mb-3 bg-gray-300 text-center p-4 rounded-3xl font-bold hover:bg-gray-400 hover:text-white transition-colors duration-300 block"
          >
            Home Page
          </Link>

          {/* User info and logout */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Signed in as:</p>
            <p className="text-sm font-medium text-gray-900 mb-3">{authUser?.email}</p>
            <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors">
              <HiArrowRightOnRectangle className="text-lg" />
              Sign out
            </button>
          </div>
        </div>

        <h2 className="text-gray-900 text-base font-medium leading-normal mb-5">Groups</h2>

        <div className="flex flex-col gap-2 flex-1 overflow-y-auto px-2 max-h-[500px]">
          {!groupsLoading &&
            reversedGroups?.map((group) => (
              <Link
                onClick={() => dispatch(toggleSidebar())}
                key={group.group_id}
                to={`/groups/${group.group_id}/overview`}
                className="cursor-pointer w-full"
              >
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                    parseInt(groupId || "0") === group.group_id ? "bg-emerald-600/80 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {parseInt(groupId || "0") === group.group_id ? (
                    <HiUserGroup className="text-md flex-shrink-0" />
                  ) : (
                    <HiOutlineUserGroup className="text-md flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-normal truncate">{group.group_name.split("(")[0]}</p>
                    <p className="text-sm font-semibold leading-normal truncate">
                      {group.group_name.split("(")[1] && "(" + group.group_name.split("(")[1]}
                    </p>
                    {/* <p className="text-xs opacity-75 truncate">{group.students_count} students</p> */}
                  </div>
                  <button
                    onClick={(e) => handleDeleteGroup(e, group)}
                    className="flex-shrink-0 p-1 hover:bg-red-100 rounded transition-colors"
                    title="Delete group"
                  >
                    <HiTrash className="text-sm cursor-pointer hover:text-red-600 transition-colors" />
                  </button>
                </div>
              </Link>
            ))}
        </div>

        <button
          onClick={() => dispatch(toggleCreateGroupModal())}
          className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer mt-4 bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
        >
          <HiPlus className="text-2xl" />
          <p className="text-sm font-medium leading-normal">Add Group</p>
        </button>
      </div>
    </div>
  );
}
