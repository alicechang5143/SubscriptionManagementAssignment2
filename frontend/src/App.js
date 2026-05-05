import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Subscriptions from "./pages/Subscriptions";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app-shell">
        <div className="bg-grid" />
        <div className="bg-orb bg-orb-one" />
        <div className="bg-orb bg-orb-two" />

        <Navbar />

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to={user ? "/subscriptions" : "/login"} replace />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/subscriptions" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/subscriptions" replace />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
            <Route path="/subscriptions" element={user ? <Subscriptions /> : <Navigate to="/login" replace />} />
            <Route path="/tasks" element={<Navigate to="/subscriptions" replace />} />
            <Route
              path="/admin"
              element={user && user.role === "admin" ? <AdminDashboard /> : <Navigate to="/subscriptions" replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;