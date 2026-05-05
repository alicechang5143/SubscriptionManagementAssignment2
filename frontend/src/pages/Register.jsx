import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/auth/register", formData);
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Start managing your subscriptions easily
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

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
            Create Account
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-indigo-600 hover:underline cursor-pointer font-medium"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;