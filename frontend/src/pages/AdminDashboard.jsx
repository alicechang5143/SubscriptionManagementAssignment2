import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const unwrap = (response) => response.data?.data ?? response.data;
const emptyForm = { name: "", price: "", duration: "monthly", features: "", isActive: true };

const AdminDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    const response = await axiosInstance.get("/api/plans?includeInactive=true");
    setPlans(Array.isArray(unwrap(response)) ? unwrap(response) : []);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.price === "") return alert("Name and price are required");

    const payload = {
      name: form.name,
      price: Number(form.price),
      duration: form.duration,
      features: form.features ? form.features.split(",").map((f) => f.trim()).filter(Boolean) : [],
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/api/plans/${editingId}`, payload);
      } else {
        await axiosInstance.post("/api/plans", payload);
      }
      resetForm();
      await fetchPlans();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save plan");
    }
  };

  const startEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
      name: plan.name || "",
      price: plan.price ?? "",
      duration: plan.duration || "monthly",
      features: Array.isArray(plan.features) ? plan.features.join(", ") : "",
      isActive: plan.isActive !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan permanently?")) return;
    try {
      await axiosInstance.delete(`/api/plans/${id}`);
      await fetchPlans();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete plan");
    }
  };

  const loadPage = async () => {
    try {
      setLoading(true);
      await fetchPlans();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Create, update, activate/deactivate, and delete subscription plans.</p>
      </section>

      <section className="bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">{editingId ? "Update Plan" : "Create New Plan"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Plan name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select value={String(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <input type="text" placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition w-auto">
              {editingId ? "Update Plan" : "Create Plan"}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-2 rounded-lg font-medium transition w-auto">Cancel Edit</button>}
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Plans</h2>
        {loading && <p className="text-gray-500">Loading plans...</p>}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <article key={plan._id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between border border-gray-100">
              <div>
                <div className="flex justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold h-fit ${plan.isActive !== false ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {plan.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">${plan.price} / {plan.duration}</p>
                {plan.calculatedPrice > 0 && <p className="text-gray-500 text-sm">Calculated yearly value: ${plan.calculatedPrice}</p>}
                {plan.features?.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {plan.features.map((feature, index) => <li key={index}>• {feature}</li>)}
                  </ul>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <button onClick={() => startEdit(plan)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Edit</button>
                <button onClick={() => handleDelete(plan._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
