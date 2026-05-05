import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `px-4 py-2 rounded-2xl text-sm font-extrabold transition ${
    isActive
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
      : "text-slate-600 hover:bg-white hover:text-slate-950"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/75 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-indigo-500 blur-lg opacity-30 group-hover:opacity-50 transition" />
            <div className="relative h-12 w-12 rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 text-white grid place-items-center font-black shadow-xl group-hover:scale-105 transition">
              SM
            </div>
          </div>

          <div className="leading-tight hidden sm:block">
            <p className="font-black tracking-tight text-slate-950">
              SubManager
            </p>
            <p className="text-xs text-slate-500">
              Subscription control centre
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-1 rounded-3xl bg-slate-100/80 p-1 border border-slate-200">
                <NavLink to="/subscriptions" className={navClass}>
                  Subscriptions
                </NavLink>

                <NavLink to="/profile" className={navClass}>
                  Profile
                </NavLink>

                {user.role === "admin" && (
                  <NavLink to="/admin" className={navClass}>
                    Admin
                  </NavLink>
                )}
              </div>

              <div className="hidden lg:flex items-center gap-3 rounded-3xl bg-white border border-slate-200 px-3 py-2 shadow-sm">
                <div className="h-9 w-9 rounded-2xl bg-indigo-100 text-indigo-700 grid place-items-center text-sm font-black">
                  {(user.name || user.email || "U").slice(0, 1).toUpperCase()}
                </div>

                <div className="leading-tight max-w-[170px]">
                  <p className="text-sm font-black text-slate-900 truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {user.role || "user"} account
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="ghost-button px-4 py-2 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>

              <Link to="/register" className="primary-button px-4 py-2 text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
