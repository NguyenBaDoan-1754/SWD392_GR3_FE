import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./features/auth/page/LoginPage";
import SignupPage from "./features/auth/page/SignUpPage";
import DashboardPage from "./features/dashboard-admin/pages/DashboardPageAdmin";
import ArticlesPage from "./features/articles/pages/ArticlesPage";
import ArticleDetailPage from "./features/articles/pages/ArticleDetailPage";
import StockManagementPage from "./features/stock/pages/StockManagementPage";
import PodcastScriptsPage from "./features/podcast/pages/PodcastScriptsPage";
import UsersPage from "./features/users/pages/UsersPage";
import ChatPage from "./features/chat/pages/ChatPage";
import NotFoundPage from "./features/404/pages/NotFoundPage";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./features/auth/hook/useAuth";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Routes accessible by all authenticated users */}

        {/* Routes accessible only by admin users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<DashboardPage />}
              requiredRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/articles"
          element={
            <ProtectedRoute
              element={<ArticlesPage />}
              requiredRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/articles/:articleUrl"
          element={
            <ProtectedRoute
              element={<ArticleDetailPage />}
              requiredRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/stock-management"
          element={
            <ProtectedRoute
              element={<StockManagementPage />}
              requiredRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/podcast-scripts"
          element={
            <ProtectedRoute
              element={<PodcastScriptsPage />}
              requiredRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute element={<UsersPage />} requiredRoles={["ADMIN"]} />
          }
        />
        <Route path="/chat" element={<ChatPage />} />

        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
