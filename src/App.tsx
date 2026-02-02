import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import LoginPage from "./features/auth/page/LoginPage";
import SignupPage from "./features/auth/page/SignUpPage";
import NotFoundPage from "./features/404/pages/NotFoundPage";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [isAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <div>Dashboard</div> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
