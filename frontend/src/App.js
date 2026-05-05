import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Subscriptions from "./pages/Subscriptions";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to={user ? "/subscriptions" : "/login"} replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/subscriptions" element={user ? <Subscriptions /> : <Navigate to="/login" replace />} />
            <Route path="/tasks" element={<Navigate to="/subscriptions" replace />} />
            <Route
              path="/admin"
              element={user && user.role === "admin" ? <AdminDashboard /> : <Navigate to="/subscriptions" replace />}
            />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
