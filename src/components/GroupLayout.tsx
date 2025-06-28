import { Outlet } from "react-router";
import GroupHeader from "./GroupHeader";

export default function GroupLayout() {
  return (
    <div>
      <GroupHeader />
      <Outlet />
    </div>
  );
}
