import React from "react";
import { HiUserGroup, HiPlus, HiTrash, HiArrowLeft } from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { Link, useParams } from "react-router";

interface Group {
  id: number;
  name: string;
  students: any[];
}

const groups: Group[] = [
  { id: 1, name: "Group 1", students: [] },
  { id: 2, name: "Group 2", students: [] },
];

export default function GroupsSidebar() {
  const { groupId } = useParams();

  const handleDeleteGroup = (
    e: React.MouseEvent<HTMLButtonElement>,
    group: Group
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${group.name}"?`)) {
      // deleteGroup(group.id);
    }
  };

  return (
    <div className="flex h-full flex-col min-w-64 p-4 shadow-md">
      <Link
        to="/"
        className="text-gray-900 text-base  leading-normal mb-5 bg-gray-300 text-center p-4 rounded-3xl font-bold hover:bg-gray-400 hover:text-white transition-colors duration-300 "
      >
        Home Page
      </Link>
      <h2 className="text-gray-900 text-base font-medium leading-normal mb-5">
        Groups
      </h2>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {groups.map((group) => (
          <Link
            key={group.id}
            to={`/groups/${group.id}`}
            className="cursor-pointer w-full"
          >
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                parseInt(groupId || "0") === group.id
                  ? "bg-emerald-600/80 text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {parseInt(groupId || "0") === group.id ? (
                <HiUserGroup className="text-md flex-shrink-0" />
              ) : (
                <HiOutlineUserGroup className="text-md flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-normal truncate">
                  {group.name}
                </p>
                <p className="text-xs opacity-75 truncate">
                  {group.students?.length || 0} students
                </p>
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

      <button className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer mt-4 bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors">
        <HiPlus className="text-2xl" />
        <p className="text-sm font-medium leading-normal">Add Group</p>
      </button>
    </div>
  );
}
