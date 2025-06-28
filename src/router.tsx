import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import GroupsLayout from "./pages/Layouts/GroupsLayout";

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
        element: <div>Groups</div>,
      },
      {
        path: "/groups/:groupId",
        element: <div>Group Details</div>,
      },
    ],
  },
]);
