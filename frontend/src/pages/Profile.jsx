import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/auth/profile");
        const profile = response.data?.data || response.data;

        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          university: profile.university || "",
          address: profile.address || "",
        });
      } catch (error) {
        alert(error.response?.data?.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await axiosInstance.put("/api/auth/profile", formData);
      const updatedProfile = response.data?.data || response.data;

      updateUser({
        name: updatedProfile.name || formData.name,
        email: updatedProfile.email || formData.email,
        university: updatedProfile.university || formData.university,
        address: updatedProfile.address || formData.address,
      });

      alert("Profile updated successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in space-y-8">
      <section className="grid lg:grid-cols-[0.75fr_1.25fr] gap-6 items-stretch">
        <div className="glass-panel rounded-[2rem] p-6">
          <div className="h-20 w-20 rounded-[1.75rem] bg-gradient-to-br from-indigo-600 to-sky-500 text-white grid place-items-center text-3xl font-black shadow-xl">
            {(formData.name || formData.email || "U").slice(0, 1).toUpperCase()}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 mt-5">
            Your Profile
          </h1>
          <p className="text-slate-500 mt-2">
            Manage your personal information used across the subscription
            system.
          </p>

          <div className="mt-6 space-y-3">
            <div className="metric-card">
              <p className="text-xs uppercase tracking-wide text-slate-400 font-black">
                Role
              </p>
              <p className="text-lg font-black text-slate-950 capitalize">
                {user?.role || "user"}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-xs uppercase tracking-wide text-slate-400 font-black">
                Account
              </p>
              <p className="text-sm font-bold text-slate-700 break-all">
                {formData.email || "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="soft-card rounded-[2rem] p-6 sm:p-8">
          <div className="mb-6">
            <p className="badge badge-blue mb-3">Personal details</p>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Update Profile
            </h2>
            <p className="text-slate-500 mt-1">
              Keep your details accurate for better account management.
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <p className="text-slate-500 font-bold">Loading profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Full name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  University
                </label>
                <input
                  name="university"
                  type="text"
                  placeholder="University"
                  value={formData.university}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="primary-button w-full py-3"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
