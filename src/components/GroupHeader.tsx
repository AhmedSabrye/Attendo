import React from "react";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { NavLink, useParams } from "react-router";
import { useAppDispatch } from "@/stores/hooks";
import { toggleSidebar } from "@/stores/modals";
import { HiMenu } from "react-icons/hi";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  to: string;
}

const tabs: Tab[] = [
  {
    id: "overview",
    label: "Overview",
    to: "/groups/:groupId/overview",
    icon: <HiDocumentArrowUp />,
  },
  {
    id: "reports",
    label: "Reports",
    to: "/groups/:groupId/reports",
    icon: <HiDocumentArrowUp />,
  },
  {
    id: "settings",
    label: "Settings",
    to: "/groups/:groupId/settings",
    icon: <HiDocumentArrowUp />,
  },
];

export default function GroupHeader({
  onAttendanceSheetModalOpen,
  onTemplateManagerModalOpen,
}: {
  onAttendanceSheetModalOpen: () => void;
  onTemplateManagerModalOpen: () => void;
}) {
  const dispatch = useAppDispatch();
  // const tabId = useLocation().pathname.split("/").pop();
  const { groupId } = useParams();

  return (
    <div className="bg-white border-b border-gray-200 mb-8 ">
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="text-gray-500 block md:hidden hover:text-gray-700"
      >
        <HiMenu className="text-2xl" />
      </button>
      <nav className="flex gap-3 items-center justify-between flex-col lg:flex-row">
        <div className="flex items-center gap-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.to.replace(":groupId", groupId || "")}
              className={({ isActive }) =>
                `flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`
              }
            >
              {tab.icon && tab.icon}
              {tab.label}
            </NavLink>
          ))}
        </div>
        {
          <div className="flex items-center gap-2">
            <button
              onClick={onTemplateManagerModalOpen}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-sm text-white rounded-lg hover:bg-emerald-700 transition-colors ml-auto my-2"
            >
              <HiDocumentArrowUp className="text-lg" />
              Template
            </button>
            <button
              onClick={onAttendanceSheetModalOpen}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ml-auto my-2 text-sm"
            >
              <HiDocumentArrowUp className="text-lg" />
              Take Attendance
            </button>
          </div>
        }
      </nav>
    </div>
  );
}
