import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import GroupsLayout from "./pages/Layouts/GroupsLayout";
import GroupPlaceholder from "./components/GroupPlaceholder";
import OverviewTab from "./components/overview tab/Overview";
import ReportsList from "./components/Reports/ReportsList/ReportsList";
import ReportDetails from "./components/Reports/ReportDetails/ReportDetails";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import GroupLayout from "./pages/Layouts/GroupLayout";
import ProfileLayout from "./pages/Layouts/ProfileLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import GroupSettings from "./components/GroupSettings/GroupSettings";

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
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfileLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/groups",
    element: (
      <ProtectedRoute>
        <GroupsLayout />
      </ProtectedRoute>
    ),
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
            element: <GroupSettings />,
          },
        ],
      },
    ],
  },
]);
