import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar";

export default function ProfileLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
