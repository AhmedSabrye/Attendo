import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import GroupsLayout from "./pages/Layouts/GroupsLayout";
import GroupPlaceholder from "./components/GroupPlaceholder";
import OverviewTab from "./components/overview tab/Overview";
import ReportsList from "./components/Reports/ReportsList";
import ReportDetails from "./components/Reports/ReportDetails/ReportDetails";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import GroupLayout from "./pages/Layouts/GroupLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
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
            element: <ReportsList />,
          },
          {
            path: "/groups/:groupId/reports/:reportId",
            element: <ReportDetails />,
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
