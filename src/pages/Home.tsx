import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Shield,
  Users,
  Zap,
  Search,
  Filter,
  Calendar,
  FileType,
  Tag,
  Gavel,
  BookOpen,
  FileSpreadsheet,
  ChevronRight,
  Check,
  Clock,
  Building2,
  Globe,
  Briefcase,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { SearchResults } from "../components/SearchResults";
import { PaymentModal } from "../components/PaymentModal";

// Mock data for recent sections
const recentData = {
  judgments: [
    {
      id: "1",
      title: "Supreme Court Civil Appeal No. 13 of 2024",
      date: "2024-02-20",
      court: "Supreme Court",
    },
    {
      id: "2",
      title: "Constitutional Petition No. 29 of 2024",
      date: "2024-02-19",
      court: "Constitutional Court",
    },
    {
      id: "3",
      title: "Civil Appeal No. 54 of 2024",
      date: "2024-02-18",
      court: "Court of Appeal",
    },
  ],
  legislation: [
    {
      id: "1",
      title: "The Data Protection Act, 2024",
      date: "2024-02-15",
      type: "Act",
    },
    {
      id: "2",
      title: "The Companies (Amendment) Act, 2024",
      date: "2024-02-14",
      type: "Act",
    },
    {
      id: "3",
      title: "The Investment Code (Amendment) Act, 2024",
      date: "2024-02-13",
      type: "Act",
    },
  ],
  hansards: [
    {
      id: "1",
      title: "Parliamentary Debates - February 20, 2024",
      date: "2024-02-20",
      session: "Morning",
    },
    {
      id: "2",
      title: "Parliamentary Debates - February 19, 2024",
      date: "2024-02-19",
      session: "Afternoon",
    },
    {
      id: "3",
      title: "Parliamentary Debates - February 18, 2024",
      date: "2024-02-18",
      session: "Morning",
    },
  ],
  gazettes: [
    {
      id: "1",
      title: "The Uganda Gazette Vol. CXVII No. 12",
      date: "2024-02-20",
      type: "General Notice",
    },
    {
      id: "2",
      title: "The Uganda Gazette Vol. CXVII No. 11",
      date: "2024-02-19",
      type: "Statutory Instrument",
    },
    {
      id: "3",
      title: "The Uganda Gazette Vol. CXVII No. 10",
      date: "2024-02-18",
      type: "General Notice",
    },
  ],
};

const subscriptionPlans = [
  {
    name: "Bronze",
    description: "Perfect for individual legal professionals",
    price: 30000,
    duration: "1 Day",
    icon: Clock,
    color: "amber",
    features: [
      "One Account",
      "Daily access",
      "Basic search functionality",
      "Document previews",
      "Download access",
    ],
    bestFor: "Individual Users",
  },
  {
    name: "Silver",
    description: "Ideal for local organizations and institutions",
    price: 2500000,
    duration: "Per year",
    icon: Building2,
    color: "slate",
    features: [
      "Multiple accounts",
      "Advanced search features",
      "Document annotations",
      "Priority support",
      "Bulk downloads",
    ],
    bestFor: "Local Law Firms, NGOs, Schools",
  },
  {
    name: "Gold",
    description: "Perfect for larger organizations",
    price: 10000000,
    duration: "Per year",
    icon: Briefcase,
    color: "yellow",
    features: [
      "30 Customized accounts",
      "API access",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated support",
    ],
    bestFor: "Banks, MDAs",
  },
  {
    name: "Platinum",
    description: "Enterprise-grade solution",
    price: 35000000,
    duration: "Per year",
    icon: Globe,
    color: "slate",
    features: [
      "Unlimited accounts",
      "Custom deployment options",
      "Enterprise API access",
      "Advanced security features",
      "24/7 Priority support",
    ],
    bestFor: "Academic Institutions, Foreign Companies",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    (typeof subscriptionPlans)[0] | null
  >(null);

  const handleSearch = async () => {
    // TODO: Implement actual search when Supabase is connected
    const mockResults = [
      {
        id: "1",
        title: "Supreme Court Judgment 2023",
        category: "Courts of Record",
        subcategory: "Supreme Court of Uganda",
        fileType: "pdf",
        date: "2023-12-01",
      },
      {
        id: "2",
        title: "Parliamentary Proceedings Feb 2024",
        category: "Hansards",
        subcategory: "Hansards 2025-2004",
        fileType: "pdf",
        date: "2024-02-15",
      },
    ];
    setSearchResults(mockResults);
  };

  const handleSubscribe = (plan: (typeof subscriptionPlans)[0]) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80")',
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/95" />
        </div>

        {/* Content */}
        <div className="relative z-10 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Access to Legal Information made simple
              </h1>
              <p className="mt-6 text-lg leading-8 text-blue-100">
                Search through thousands of legal documents, court records, and
                parliamentary proceedings.
              </p>

              {/* Search Bar */}
              <div className="mt-10">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-lg border-0 py-3 pl-10 pr-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                    placeholder="Search documents..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Filter className="h-4 w-4" />
                      <span className="ml-2">Filters</span>
                    </Button>
                  </div>
                </div>

                {/* Advanced Search Filters */}
                {showAdvancedSearch && (
                  <div className="mt-4 rounded-lg bg-white/95 backdrop-blur-sm p-4 shadow-lg">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          onChange={(e) =>
                            setFilters({ ...filters, category: e.target.value })
                          }
                        >
                          <option value="">All Categories</option>
                          <option value="hansards">Hansards</option>
                          <option value="courts">Courts</option>
                          <option value="tribunals">Tribunals</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date Range
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              dateRange: {
                                ...filters.dateRange,
                                start: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          File Type
                        </label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              fileType: [e.target.value as any],
                            })
                          }
                        >
                          <option value="">All Types</option>
                          <option value="pdf">PDF</option>
                          <option value="doc">DOC</option>
                          <option value="docx">DOCX</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Keywords
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter keywords..."
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              keywords: e.target.value.split(","),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <Button
                    variant="secondary"
                    onClick={handleSearch}
                    className="bg-white text-blue-600 hover:bg-gray-50"
                  >
                    Search Documents
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sections */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Recent Judgments */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Gavel className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900">
                  Recent Judgments
                </h2>
              </div>
              <Link
                to="/judgments"
                className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
              >
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentData.judgments.map((item) => (
                <div key={item.id} className="py-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    {new Date(item.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    {item.court}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Legislation */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-100 p-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900">
                  Recent Legislation
                </h2>
              </div>
              <Link
                to="/legislation"
                className="text-purple-600 hover:text-purple-700 flex items-center text-sm font-medium"
              >
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentData.legislation.map((item) => (
                <div key={item.id} className="py-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    {new Date(item.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    {item.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Hansards */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900">
                  Recent Hansards
                </h2>
              </div>
              <Link
                to="/hansards"
                className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium"
              >
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentData.hansards.map((item) => (
                <div key={item.id} className="py-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    {new Date(item.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    {item.session} Session
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Gazettes */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-orange-100 p-3">
                  <FileSpreadsheet className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900">
                  Recent Gazettes
                </h2>
              </div>
              <Link
                to="/gazettes"
                className="text-orange-600 hover:text-orange-700 flex items-center text-sm font-medium"
              >
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentData.gazettes.map((item) => (
                <div key={item.id} className="py-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    {new Date(item.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    {item.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <SearchResults results={searchResults} />
        </div>
      )}

      {/* Subscription Packages */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Choose Your Subscription Plan
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Select the perfect plan for your needs, from individual access to
              enterprise solutions
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-4">
            {subscriptionPlans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`
                    relative flex flex-col rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200
                    hover:shadow-2xl hover:scale-105 transition-all duration-300
                    ${plan.name === "Gold" ? "lg:shadow-2xl lg:scale-105" : ""}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      rounded-lg p-3
                      ${
                        plan.name === "Bronze"
                          ? "bg-amber-100 text-amber-600"
                          : ""
                      }
                      ${
                        plan.name === "Silver"
                          ? "bg-slate-100 text-slate-600"
                          : ""
                      }
                      ${
                        plan.name === "Gold"
                          ? "bg-yellow-100 text-yellow-600"
                          : ""
                      }
                      ${
                        plan.name === "Platinum"
                          ? "bg-slate-100 text-slate-600"
                          : ""
                      }
                    `}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold leading-7 text-gray-900">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {plan.description}
                  </p>
                  <div className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-lg font-semibold text-gray-600">
                      UGX {plan.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /{plan.duration}
                    </span>
                  </div>
                  <div className="mt-8 text-sm font-medium text-gray-500">
                    Best for: {plan.bestFor}
                  </div>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <Check className="h-5 w-5 flex-none text-blue-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="primary"
                    className={`
                      mt-8 w-full
                      ${
                        plan.name === "Gold"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : ""
                      }
                    `}
                    onClick={() => handleSubscribe(plan)}
                  >
                    Get started
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      )}

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your Legal documents
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our comprehensive document management solution provides all the
            tools you need to keep your documents organized and secure.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<FileText className="h-8 w-8" />}
              title="Document Organization"
              description="Organize documents with categories and subcategories for easy access and management."
            />
            <Feature
              icon={<Shield className="h-8 w-8" />}
              title="Secure Storage"
              description="Enterprise-grade security ensures your documents are safe and protected."
            />
            <Feature
              icon={<Users className="h-8 w-8" />}
              title="Team Collaboration"
              description="Share documents and collaborate with team members seamlessly."
            />
            <Feature
              icon={<Zap className="h-8 w-8" />}
              title="Fast Search"
              description="Find any document instantly with our powerful search capabilities."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-lg bg-white p-8 shadow-sm">
      <div className="mb-6 inline-block rounded-lg bg-blue-600 p-3 text-white">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}
