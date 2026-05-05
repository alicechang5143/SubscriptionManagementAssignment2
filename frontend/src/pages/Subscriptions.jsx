import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const unwrap = (response) => response.data?.data ?? response.data;

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    const response = await axiosInstance.get("/api/plans");
    setPlans(Array.isArray(unwrap(response)) ? unwrap(response) : []);
  };

  const fetchSubscriptions = async () => {
    const response = await axiosInstance.get("/api/subscriptions");
    setSubscriptions(Array.isArray(unwrap(response)) ? unwrap(response) : []);
  };

  const loadPage = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPlans(), fetchSubscriptions()]);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return alert("Please select a plan first");

    try {
      await axiosInstance.post("/api/subscriptions", { plan: selectedPlan });
      setSelectedPlan("");
      await fetchSubscriptions();
      alert("Subscription created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Subscription failed");
    }
  };

  const handleCancel = async (id) => {
    try {
      await axiosInstance.patch(`/api/subscriptions/${id}/cancel`);
      await fetchSubscriptions();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel subscription");
    }
  };

  const handleRenew = async (id) => {
    try {
      await axiosInstance.patch(`/api/subscriptions/${id}/renew`);
      await fetchSubscriptions();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to renew subscription");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscription record permanently?")) return;
    try {
      await axiosInstance.delete(`/api/subscriptions/${id}`);
      await fetchSubscriptions();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete subscription");
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <div className="space-y-10">
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-500 mt-1">Choose plans, renew services, cancel active subscriptions, and review subscription history.</p>
        </div>
        <button onClick={loadPage} className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium w-auto">
          Refresh
        </button>
      </section>

      <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Subscription</h2>
        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Available Plans</label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.name} - ${plan.price} / {plan.duration}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleSubscribe} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition">
            Subscribe
          </button>
        </div>
        {!loading && plans.length === 0 && <p className="text-sm text-red-500 mt-3">No active plans are available. Ask an admin to create plans.</p>}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Subscriptions</h2>
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && subscriptions.length === 0 && <p className="text-gray-500 text-sm">No subscriptions yet.</p>}

        <div className="grid md:grid-cols-2 gap-6">
          {subscriptions.map((sub) => (
            <article key={sub._id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition space-y-4">
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{sub.plan?.name || "Unknown plan"}</h3>
                  <p className="text-sm text-gray-500">${sub.plan?.price ?? "-"} / {sub.plan?.duration || "-"}</p>
                </div>
                <span className={`h-fit capitalize px-3 py-1 rounded-full text-xs font-semibold ${sub.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {sub.status}
                </span>
              </div>

              <div className="text-sm text-gray-500 space-y-1">
                <p>Started: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "N/A"}</p>
                <p>Renewals: {sub.renewalCount || 0}</p>
                {sub.renewedAt && <p>Last renewed: {new Date(sub.renewedAt).toLocaleDateString()}</p>}
                {sub.cancelledAt && <p>Cancelled: {new Date(sub.cancelledAt).toLocaleDateString()}</p>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleRenew(sub._id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium">Renew</button>
                <button onClick={() => handleCancel(sub._id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium">Cancel</button>
                <button onClick={() => handleDelete(sub._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;
