import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import GroupsLayout from "./pages/Layouts/GroupsLayout";
import GroupLayout from "./components/GroupLayout";
import GroupPlaceholder from "./components/GroupPlaceholder";
import OverviewTab from "./components/overview tab/Overview";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/groups",
    element: <GroupsLayout />,
    children: [
      {
        path: "/groups",
        element: <GroupPlaceholder />,
      },
      {
        path: "/groups/:groupId",
        element: <GroupLayout />,
        children: [
          {
            path: "/groups/:groupId/overview",
            element: <OverviewTab />,
          },
          {
            path: "/groups/:groupId/reports",
            element: <div>Reports</div>,
          },
          {
            path: "/groups/:groupId/settings",
            element: <div>Settings</div>,
          },
        ],
      },
    ],
  },
]);
