import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await axiosInstance.post("/api/auth/register", formData);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[78vh] grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-center fade-in">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-8 order-2 lg:order-1">
        <div className="mb-7">
          <p className="badge badge-blue mb-4">New user setup</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Create your account
          </h1>
          <p className="text-slate-500 mt-2">
            Start managing subscriptions with a clean and secure workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">
              Full name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">
              Email address
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-button w-full py-3"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-black text-indigo-600 hover:text-indigo-700"
            >
              Login here
            </Link>
          </p>
        </div>
      </section>

      <section className="space-y-7 order-1 lg:order-2">
        <div className="inline-flex items-center gap-2 badge badge-yellow">
          <span>★</span>
          Subscription Lifecycle System
        </div>

        <div className="space-y-5">
          <h2 className="page-title">
            A modern app for users, admins, and software lifecycle evidence.
          </h2>

          <p className="page-subtitle text-lg max-w-2xl">
            The system demonstrates authentication, CRUD operations, role-based
            access, API integration, functional testing, and deployment
            readiness.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="soft-card rounded-3xl p-5">
            <p className="text-lg font-black text-slate-950">User Panel</p>
            <p className="text-sm text-slate-500 mt-2">
              Subscribe, renew, cancel, and review subscription history.
            </p>
          </div>

          <div className="soft-card rounded-3xl p-5">
            <p className="text-lg font-black text-slate-950">Admin Panel</p>
            <p className="text-sm text-slate-500 mt-2">
              Create, update, activate, deactivate, and delete plans.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
