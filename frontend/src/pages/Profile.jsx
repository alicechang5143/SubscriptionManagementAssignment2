import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/auth/profile", {
          
        });

        const profile = response.data?.data || response.data;

        setFormData({
          name: profile.name,
          email: profile.email,
          university: profile.university || "",
          address: profile.address || "",
        });
      } catch (error) {
        alert("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put("/api/auth/profile", formData, {
        
      });

      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-[75vh]">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Update your personal details
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="text"
            placeholder="University"
            value={formData.university}
            onChange={(e) =>
              setFormData({ ...formData, university: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;