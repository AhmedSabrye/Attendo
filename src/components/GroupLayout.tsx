import { Outlet } from "react-router";
import GroupHeader from "./GroupHeader";

export default function GroupLayout() {
  return (
    <div className="p-4 h-full">
      <GroupHeader />
      <Outlet />
    </div>
  );
}
