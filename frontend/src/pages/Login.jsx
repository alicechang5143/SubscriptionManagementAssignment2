import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/api/auth/login", formData);

      login(response.data?.data || response.data);
      navigate("/tasks");
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">
            Login to manage your subscriptions
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
          >
            Login
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-indigo-600 hover:underline cursor-pointer font-medium"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;