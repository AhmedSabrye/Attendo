import React from "react";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { NavLink, useParams } from "react-router";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  to: string;
}

const tabs: Tab[] = [
  { id: "overview", label: "Overview",to:"/groups/:groupId/overview", icon: <HiDocumentArrowUp /> },
  { id: "reports", label: "Reports",to:"/groups/:groupId/reports", icon: <HiDocumentArrowUp /> },
  { id: "settings", label: "Settings",to:"/groups/:groupId/settings", icon: <HiDocumentArrowUp />,
  },
];

export default function GroupHeader() {
  // const tabId = useLocation().pathname.split("/").pop();
  const { groupId } = useParams();


  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.to.replace(":groupId", groupId || "")}
              className={({ isActive }) => `flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                isActive ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon && tab.icon}
              {tab.label}
            </NavLink>
          ))}
          {
            <button
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ml-auto my-2"
            >
              <HiDocumentArrowUp className="text-lg" />
              Take Attendance
            </button>
          }
        </nav>
      </div>
    </div>
  );
}
