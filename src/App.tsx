import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import LoginPage from "./features/auth/page/LoginPage";
import SignupPage from "./features/auth/page/SignUpPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ArticlesPage from "./features/articles/pages/ArticlesPage";
import StockManagementPage from "./features/stock/pages/StockManagementPage";
import PodcastScriptsPage from "./features/podcast/pages/PodcastScriptsPage";
import UsersPage from "./features/users/pages/UsersPage";
import NotFoundPage from "./features/404/pages/NotFoundPage";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [isAuthenticated] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/articles"
          element={
            isAuthenticated ? <ArticlesPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/stock-management"
          element={
            isAuthenticated ? <StockManagementPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/podcast-scripts"
          element={
            isAuthenticated ? <PodcastScriptsPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/users"
          element={isAuthenticated ? <UsersPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
