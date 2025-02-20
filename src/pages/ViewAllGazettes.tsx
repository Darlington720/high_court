import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Eye,
  ExternalLink,
  Calendar,
  Tag,
  Building2,
  AlertCircle,
  Lock,
  ChevronRight,
  ChevronLeft,
  Clock,
  Users,
  FileText,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { fetchDocuments } from "../lib/documents";
import { formatDate } from "../lib/utils";
import { PaymentModal } from "../components/PaymentModal";
import type { Document } from "../types";

export default function ViewAllGazettes() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    year: "",
    noticeType: "",
    status: "",
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocuments(
        { category: "Gazettes" },
        { field: "created_at", direction: "desc" }
      );
      setDocuments(data);
    } catch (err) {
      setError("Failed to load gazettes. Please try again.");
      console.error("Error loading gazettes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (doc: Document) => {
    setShowPaymentModal(true);
    setSelectedPlan({
      name: "Bronze",
      price: 10,
      duration: "1 Day",
      features: ["Document Downloads", "Basic Search", "24/7 Support"],
    });
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.metadata.keywords?.some((k) =>
        k.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = !filters.type || doc.subcategory === filters.type;
    const matchesYear = !filters.year || doc.created_at.includes(filters.year);
    const matchesNoticeType =
      !filters.noticeType || doc.metadata.noticeType === filters.noticeType;
    const matchesStatus =
      !filters.status || doc.metadata.status === filters.status;

    return (
      matchesSearch &&
      matchesType &&
      matchesYear &&
      matchesNoticeType &&
      matchesStatus
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Recent Gazettes
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse and search through official gazettes and notices
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search gazettes..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  {/* <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    
                  </select> */}
                  <select
                    value={filters.type}
                    onChange={(e) =>
                      setFilters({ ...filters, type: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {Array.from(
                      { length: 2025 - 1900 + 1 },
                      (_, i) => 2025 - i
                    ).map((year) => (
                      <option key={year} value={`Gazzetes ${year}`}>
                        Gazzetes {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) =>
                      setFilters({ ...filters, year: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Years</option>
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notice Type
                  </label>
                  <select
                    value={filters.noticeType}
                    onChange={(e) =>
                      setFilters({ ...filters, noticeType: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Notice Types</option>
                    <option value="tender">Tender Notices</option>
                    <option value="trademark">Trademark Notices</option>
                    <option value="company">Company Notices</option>
                    <option value="public">Public Notices</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading gazettes...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {paginatedDocuments.map((doc) => (
                    <div key={doc.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-blue-50 p-2">
                              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {doc.title}
                              </h3>
                              <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <FileText className="mr-1.5 h-4 w-4" />
                                  {doc.subcategory}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="mr-1.5 h-4 w-4" />
                                  {formatDate(doc.created_at)}
                                </span>
                                {doc.metadata.noticeType && (
                                  <span className="flex items-center">
                                    <Tag className="mr-1.5 h-4 w-4" />
                                    {doc.metadata.noticeType}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Subscription CTA */}
              <div className="bg-blue-900 rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 py-8 sm:p-10 sm:pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Get Full Access
                      </h3>
                      <p className="mt-2 text-blue-200">
                        Subscribe to download gazettes and access premium
                        features
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setShowPaymentModal(true)}
                      className="flex items-center"
                    >
                      Subscribe Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
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
    </div>
  );
}
