import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from "./features/auth/page/LoginPage";
import SignupPage from "./features/auth/page/SignUpPage";
import DashboardPage from "./features/dashboard-admin/pages/DashboardPageAdmin";
import BackgroundJobPage from "./features/background-jobs/pages/BackgroundJobPage";
import UsersPage from "./features/users/pages/UsersPage";
import ChatPage from "./features/chat/pages/ChatPage";
import ChatHistoryPage from "./features/chat/pages/ChatHistoryPage";
import ArticlesPage from "./features/articles/pages/ArticlesPage";
import ArticleDetailPage from "./features/articles/pages/ArticleDetailPage";
import StockManagementPage from "./features/stock-management/pages/StockManagementPage";
import MarketPage from "./features/stock-management/pages/MarketPage";
import NewsPage from "./features/articles/pages/NewsPage";
import NotFoundPage from "./features/404/pages/NotFoundPage";
import HomePage from "./features/home/pages/HomePage";
import ProfilePage from "./features/profile/pages/ProfilePage";
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
        <Route
          path="/history"
          element={<ProtectedRoute element={<ChatHistoryPage />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<ProfilePage />} />}
        />

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
          path="/background-jobs"
          element={
            <ProtectedRoute
              element={<BackgroundJobPage />}
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
          path="/articles/:articleId"
          element={
            <ProtectedRoute
              element={<ArticleDetailPage />}
              requiredRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/stocks"
          element={
            <ProtectedRoute
              element={<StockManagementPage />}
              requiredRoles={["ADMIN"]}
            />
          }
        />
        {/* User-facing routes (no ADMIN required) */}
        <Route
          path="/market"
          element={
            <ProtectedRoute element={<MarketPage />} />
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute element={<NewsPage />} />
          }
        />
        <Route path="/chat" element={<ChatPage />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
