import { Outlet } from "react-router";
import GroupsSidebar from "../../components/Sidebar";

export default function GroupsLayout() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <GroupsSidebar />
        <div className="flex flex-col min-w-64 flex-1 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
