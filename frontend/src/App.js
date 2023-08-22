import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import HomePage from "main/pages/HomePage";
import LoadingPage from "main/pages/LoadingPage";
import LoginPage from "main/pages/LoginPage";
import ProfilePage from "main/pages/ProfilePage";
import LeaderboardPage from "main/pages/LeaderboardPage";

import AdminUsersPage from "main/pages/AdminUsersPage";
import AdminJobsPage from "main/pages/AdminJobsPage";
import AdminCreateCommonsPage from "main/pages/AdminCreateCommonsPage";
import AdminViewReportPage from "main/pages/AdminViewReportPage";

import AdminEditCommonsPage from "main/pages/AdminEditCommonsPage";
import AdminListCommonsPage from "main/pages/AdminListCommonPage";
import AdminReportsPage from "main/pages/AdminReportsPage";
import { hasRole, useCurrentUser } from "main/utils/currentUser";
import PlayPage from "main/pages/PlayPage";
import NotFoundPage from "main/pages/NotFoundPage";

function App() {
  const useCurrentUserReturn = useCurrentUser();
  const { data: currentUser } = useCurrentUserReturn;
  const [isLoading, setIsLoading] = useState(useCurrentUserReturn?.initialData);

  // Delay setting the loading state to false
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2000ms delay
  }, []);

  // Define admin routes
  const adminRoutes = hasRole(currentUser, "ROLE_ADMIN") ? (
    <>
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/jobs" element={<AdminJobsPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
      <Route path="/admin/report/:reportId" element={<AdminViewReportPage />} />
      <Route path="/admin/createcommons" element={<AdminCreateCommonsPage />} />
      <Route path="/admin/listcommons" element={<AdminListCommonsPage />} />
      <Route path="/admin/editcommons/:id" element={<AdminEditCommonsPage />} />
    </>
  ) : null;

  // Define user routes
  const userRoutes = hasRole(currentUser, "ROLE_USER") ? (
    <>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/leaderboard/:commonsId" element={<LeaderboardPage />}/>
      <Route path="/play/:commonsId" element={<PlayPage />} />
    </>
  ) : null;

  // Choose the homepage based on roles
  const homeRoute = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_USER")) 
    ? <Route path="/" element={<HomePage />} /> 
    : <Route path="/" element={<LoginPage />} />;

  return (
    <BrowserRouter>
      {isLoading ? (
          <LoadingPage /> // Loading screen
        ) : (
        <Routes>
          {homeRoute}
          {adminRoutes}
          {userRoutes}
          <Route path="*" element={<NotFoundPage />} /> {/* Fallback 404 route */}
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;