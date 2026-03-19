import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomeRoute } from "@/routes/HomeRoute";
import { AddBookRoute } from "@/routes/AddBookRoute";
import { LoginRoute } from "@/routes/LoginRoute";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/lib/authContext";

import { useAuth } from "@/lib/authContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddBookRoute />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginRoute />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;