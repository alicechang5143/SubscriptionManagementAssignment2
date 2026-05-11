import { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../axiosConfig";

const unwrap = (response) => response.data?.data ?? response.data;

const emptyForm = {
  name: "",
  price: "",
  duration: "monthly",
  features: "",
  isActive: true,
};

const AdminDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const activePlans = useMemo(
    () => plans.filter((plan) => plan.isActive !== false).length,
    [plans],
  );
  const inactivePlans = useMemo(
    () => plans.filter((plan) => plan.isActive === false).length,
    [plans],
  );

  const averagePrice = useMemo(() => {
    if (!plans.length) return 0;
    const total = plans.reduce((sum, plan) => sum + Number(plan.price || 0), 0);
    return Math.round(total / plans.length);
  }, [plans]);

  const fetchPlans = async () => {
    const response = await axiosInstance.get("/api/plans?includeInactive=true");
    const data = unwrap(response);
    setPlans(Array.isArray(data) ? data : []);
  };

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      await fetchPlans();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load plans.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || form.price === "") {
      alert("Plan name and price are required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      duration: form.duration,
      features: form.features
        ? form.features
            .split(",")
            .map((feature) => feature.trim())
            .filter(Boolean)
        : [],
      isActive: form.isActive,
    };

    try {
      setSaving(true);

      if (editingId) {
        await axiosInstance.put(`/api/plans/${editingId}`, payload);
      } else {
        await axiosInstance.post("/api/plans", payload);
      }

      resetForm();
      await fetchPlans();
      alert(
        editingId ? "Plan updated successfully." : "Plan created successfully.",
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save plan.");
    } finally {
      setSaving(false);
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
      alert(error.response?.data?.message || "Failed to delete plan.");
    }
  };

  const togglePlanStatus = async (plan) => {
    try {
      await axiosInstance.put(`/api/plans/${plan._id}`, {
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        features: plan.features || [],
        isActive: plan.isActive === false,
      });

      await fetchPlans();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update plan status.");
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="badge badge-blue mb-5">Admin control panel</p>

          <h1 className="page-title">Plan Management Dashboard</h1>

          <p className="page-subtitle text-lg max-w-3xl mt-5">
            Create, update, activate, deactivate, and delete subscription plans.
            This section demonstrates complete admin CRUD functionality.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <div className="metric-card">
              <p className="text-3xl font-black text-slate-950">
                {plans.length}
              </p>
              <p className="text-sm font-bold text-slate-500 mt-1">
                Total plans
              </p>
            </div>

            <div className="metric-card">
              <p className="text-3xl font-black text-slate-950">
                {activePlans}
              </p>
              <p className="text-sm font-bold text-slate-500 mt-1">
                Active plans
              </p>
            </div>

            <div className="metric-card">
              <p className="text-3xl font-black text-slate-950">
                ${averagePrice}
              </p>
              <p className="text-sm font-bold text-slate-500 mt-1">
                Average price
              </p>
            </div>
          </div>
        </div>

        <div className="soft-card rounded-[2rem] p-6">
          <div className="mb-5">
            <p
              className={
                editingId ? "badge badge-yellow mb-3" : "badge badge-blue mb-3"
              }
            >
              {editingId ? "Update mode" : "Create mode"}
            </p>

            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              {editingId ? "Update Plan" : "Create New Plan"}
            </h2>

            <p className="text-slate-500 mt-1">
              {editingId
                ? "Edit the selected plan below."
                : "Add a new subscription plan for users."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                Plan name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Premium Plan"
                value={form.name}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="16.99"
                  value={form.price}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  Duration
                </label>
                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">
                Features
              </label>
              <input
                name="features"
                type="text"
                placeholder="Priority support, Analytics, Unlimited access"
                value={form.features}
                onChange={handleChange}
                className="input-field"
              />
              <p className="text-xs text-slate-500 mt-2">
                Separate features using commas.
              </p>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span>
                <span className="block text-sm font-black text-slate-800">
                  Plan is active
                </span>
                <span className="block text-xs text-slate-500">
                  Active plans are visible to users.
                </span>
              </span>
            </label>

            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="submit"
                disabled={saving}
                className="primary-button py-3"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Plan"
                    : "Create Plan"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="ghost-button py-3"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              All Subscription Plans
            </h2>
            <p className="text-slate-500 mt-1">
              {activePlans} active, {inactivePlans} inactive.
            </p>
          </div>

          <button onClick={loadPage} className="ghost-button px-4 py-2">
            Refresh Plans
          </button>
        </div>

        {loading && (
          <div className="soft-card rounded-[2rem] p-10 text-center">
            <p className="font-bold text-slate-500">Loading plans...</p>
          </div>
        )}

        {!loading && plans.length === 0 && (
          <div className="soft-card rounded-[2rem] p-10 text-center">
            <h3 className="text-xl font-black text-slate-950">
              No plans found
            </h3>
            <p className="text-slate-500 mt-2">
              Create the first plan using the form above.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <article
              key={plan._id}
              className="soft-card hover-card rounded-[2rem] p-6 space-y-5"
            >
              <div className="flex justify-between gap-4 items-start">
                <div>
                  <h3 className="text-xl font-black text-slate-950">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    ${plan.price} / {plan.duration}
                  </p>
                </div>

                <span
                  className={
                    plan.isActive === false
                      ? "badge badge-muted"
                      : "badge badge-active"
                  }
                >
                  {plan.isActive === false ? "Inactive" : "Active"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {Array.isArray(plan.features) && plan.features.length > 0 ? (
                  plan.features.map((feature, index) => (
                    <span key={index} className="badge badge-blue">
                      {feature}
                    </span>
                  ))
                ) : (
                  <span className="badge badge-muted">No features listed</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => startEdit(plan)}
                  className="secondary-button px-3 py-2 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => togglePlanStatus(plan)}
                  className="warning-button px-3 py-2 text-sm"
                >
                  {plan.isActive === false ? "Enable" : "Disable"}
                </button>

                <button
                  onClick={() => handleDelete(plan._id)}
                  className="danger-button px-3 py-2 text-sm"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
