import { useState } from "react";
import {
  CreditCard,
  Edit2,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Clock,
  Users,
  Shield,
  Download,
  Upload,
  Search,
  BarChart2,
  Mail,
  MessageSquare,
  Settings,
  HelpCircle,
  Save,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

interface Feature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: "monthly" | "yearly" | "daily";
  features: Feature[];
  activeSubscribers: number;
  status: "active" | "inactive" | "draft";
  color: string;
  maxUsers?: number;
  trialDays?: number;
}

// Mock data - replace with API calls
const defaultFeatures: Feature[] = [
  {
    id: "f1",
    name: "Document Access",
    description: "Access to legal documents",
    included: true,
  },
  {
    id: "f2",
    name: "Search Functionality",
    description: "Advanced search capabilities",
    included: true,
  },
  {
    id: "f3",
    name: "Download Access",
    description: "Ability to download documents",
    included: true,
  },
  {
    id: "f4",
    name: "API Access",
    description: "Access to API endpoints",
    included: false,
  },
  {
    id: "f5",
    name: "Priority Support",
    description: "24/7 priority support",
    included: false,
  },
  {
    id: "f6",
    name: "Custom Branding",
    description: "Add your own branding",
    included: false,
  },
  {
    id: "f7",
    name: "Analytics",
    description: "Usage analytics and reports",
    included: false,
  },
  {
    id: "f8",
    name: "Bulk Downloads",
    description: "Download multiple documents",
    included: false,
  },
  {
    id: "f9",
    name: "Team Management",
    description: "Manage team access",
    included: false,
  },
  {
    id: "f10",
    name: "Custom Integration",
    description: "Custom API integration",
    included: false,
  },
];

const mockPlans: Plan[] = [
  {
    id: "bronze",
    name: "Bronze",
    description: "Perfect for individual legal professionals",
    price: 30000,
    billingPeriod: "daily",
    features: defaultFeatures.map((f) => ({
      ...f,
      included: ["f1", "f2", "f3"].includes(f.id),
    })),
    activeSubscribers: 150,
    status: "active",
    color: "amber",
    maxUsers: 1,
    trialDays: 0,
  },
  {
    id: "silver",
    name: "Silver",
    description: "Ideal for local organizations and institutions",
    price: 2500000,
    billingPeriod: "yearly",
    features: defaultFeatures.map((f) => ({
      ...f,
      included: ["f1", "f2", "f3", "f4", "f5"].includes(f.id),
    })),
    activeSubscribers: 75,
    status: "active",
    color: "slate",
    maxUsers: 5,
    trialDays: 7,
  },
  {
    id: "gold",
    name: "Gold",
    description: "Perfect for larger organizations",
    price: 10000000,
    billingPeriod: "yearly",
    features: defaultFeatures.map((f) => ({
      ...f,
      included: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"].includes(f.id),
    })),
    activeSubscribers: 30,
    status: "active",
    color: "yellow",
    maxUsers: 30,
    trialDays: 14,
  },
  {
    id: "platinum",
    name: "Platinum",
    description: "Enterprise-grade solution",
    price: 10000,
    billingPeriod: "yearly",
    features: defaultFeatures.map((f) => ({ ...f, included: true })),
    activeSubscribers: 10,
    status: "active",
    color: "slate",
    maxUsers: null, // Unlimited
    trialDays: 30,
  },
];

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setShowNewPlanForm(false);
  };

  const handleNewPlan = () => {
    setEditingPlan({
      id: "",
      name: "",
      description: "",
      price: 0,
      billingPeriod: "monthly",
      features: defaultFeatures.map((f) => ({ ...f, included: false })),
      activeSubscribers: 0,
      status: "draft",
      color: "blue",
    });
    setShowNewPlanForm(true);
  };

  const handleSavePlan = async (plan: Plan) => {
    try {
      setError(null);

      // Validation
      if (!plan.name.trim()) {
        throw new Error("Plan name is required");
      }

      if (plan.price < 0) {
        throw new Error("Price must be greater than or equal to 0");
      }

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (showNewPlanForm) {
        // Add new plan
        const newPlan = {
          ...plan,
          id: plan.name.toLowerCase().replace(/\s+/g, "-"),
          activeSubscribers: 0,
        };
        setPlans([...plans, newPlan]);
      } else {
        // Update existing plan
        setPlans(plans.map((p) => (p.id === plan.id ? plan : p)));
      }

      setSuccess("Plan saved successfully");
      setEditingPlan(null);
      setShowNewPlanForm(false);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      setError(null);

      const plan = plans.find((p) => p.id === planId);
      if (plan?.activeSubscribers && plan.activeSubscribers > 0) {
        throw new Error("Cannot delete plan with active subscribers");
      }

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPlans(plans.filter((p) => p.id !== planId));
      setSuccess("Plan deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete plan");
    }
  };

  const handleToggleFeature = (featureId: string) => {
    if (!editingPlan) return;

    setEditingPlan((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        features: prev.features.map((f) =>
          f.id === featureId ? { ...f, included: !f.included } : f
        ),
      };
    });
  };

  const handleExport = (format: "csv" | "excel") => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subscription Plans
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage subscription tiers and pricing
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="primary"
            onClick={handleNewPlan}
            className="flex items-center"
            disabled={!!editingPlan}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Plans List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Available Plans
            </h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className={`p-6 hover:bg-gray-50 ${
                  editingPlan?.id === plan.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {plan.name}
                      </h3>
                      <span
                        className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          plan.status === "active"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                        ${
                          plan.status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : ""
                        }
                        ${
                          plan.status === "draft"
                            ? "bg-gray-100 text-gray-800"
                            : ""
                        }
                      `}
                      >
                        {plan.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {plan.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="mr-1 h-4 w-4" />
                        UGX {plan.price}/
                        {plan.billingPeriod === "yearly"
                          ? "year"
                          : plan.billingPeriod === "monthly"
                          ? "month"
                          : "day"}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="mr-1 h-4 w-4" />
                        {plan.activeSubscribers} subscribers
                      </div>
                      {plan.maxUsers && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Shield className="mr-1 h-4 w-4" />
                          {plan.maxUsers === null
                            ? "Unlimited"
                            : `${plan.maxUsers} users`}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPlan(plan)}
                      disabled={!!editingPlan}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
                      disabled={!!editingPlan || plan.activeSubscribers > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Feature List */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {plan.features
                    .filter((f) => f.included)
                    .map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        {feature.name}
                      </div>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Plan Editor */}
        {editingPlan && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {showNewPlanForm ? "Create New Plan" : "Edit Plan"}
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Plan Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={editingPlan.description}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Describe the plan's features and benefits"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={editingPlan.price}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Billing Period
                    </label>
                    <select
                      value={editingPlan.billingPeriod}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          billingPeriod: e.target
                            .value as Plan["billingPeriod"],
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Maximum Users
                    </label>
                    <input
                      type="number"
                      value={
                        editingPlan.maxUsers === null
                          ? ""
                          : editingPlan.maxUsers
                      }
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          maxUsers:
                            e.target.value === ""
                              ? null
                              : parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trial Period (Days)
                    </label>
                    <input
                      type="number"
                      value={editingPlan.trialDays || 0}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          trialDays: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={editingPlan.status}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        status: e.target.value as Plan["status"],
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Features
                </h3>
                <div className="space-y-4">
                  {editingPlan.features.map((feature) => (
                    <label
                      key={feature.id}
                      className="relative flex items-start"
                    >
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          checked={feature.included}
                          onChange={() => handleToggleFeature(feature.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-700">
                          {feature.name}
                        </div>
                        <p className="text-xs text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPlan(null);
                    setShowNewPlanForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSavePlan(editingPlan)}
                >
                  {showNewPlanForm ? "Create Plan" : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Help Card */}
        {!editingPlan && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Managing Subscription Plans
              </h2>
            </div>
            <div className="prose prose-sm text-gray-500">
              <p>
                Subscription plans define the access levels and features
                available to your users. Each plan can have different pricing,
                features, and limitations.
              </p>
              <ul className="mt-4 space-y-2">
                <li>Plans with active subscribers cannot be deleted</li>
                <li>
                  Changes to active plans will affect new subscriptions only
                </li>
                <li>Trial periods can be set for each plan individually</li>
                <li>Features can be enabled or disabled per plan</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
