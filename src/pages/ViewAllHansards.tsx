import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
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
  Loader,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { fetchDocuments, saveDocumentDownload } from "../lib/documents";
import { formatDate } from "../lib/utils";
import { PaymentModal } from "../components/PaymentModal";
import type { Document } from "../types";
import AppContext from "../context/AppContext";
import { toast } from "react-toastify";
import { SEO } from "../components/SEO";
import { url1 } from "../lib/apiUrls";

export default function ViewAllHansards() {
  const navigate = useNavigate();
  const { year } = useParams();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    year: "",
    session: "",
    status: "",
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const appContext = useContext(AppContext);
  const [downloadingFiles, setDownloadingFiles] = useState({});

  // const handlePreview = (fileUrl: string) => {
  //   window.open(fileUrl, "_blank");
  // };

  const handlePreview = (file: any) => {
    appContext?.setDocumentPreview(file);
    appContext?.setSelectedDocumentPreviewVisible(true);
    // window.open(fileUrl, "_blank");
  };

  const handleDownload = async (fileUrl, fileName, fileId) => {
    try {
      // Set loading state for this specific file
      setDownloadingFiles((prev) => ({ ...prev, [fileId]: true }));

      const response = await fetch(`${url1}/api/download?url=${fileUrl}&name=${fileName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      await saveDocumentDownload(appContext?.user?.id, fileId);

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      // Reset loading state for this file
      setDownloadingFiles((prev) => ({ ...prev, [fileId]: false }));
    }
  };

  const handleDocClick = (item: any) => {
    if (!appContext?.user) {
      toast.warn("You need to log in to access this document.");
      navigate("/login");
    } else {
      // handlePreview(item);
      navigate(`/document/${item.id}`);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [year]);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocuments(
        { category: "Hansards", subcategory: year ? `Hansards ${year}` : null },
        { field: "created_at", direction: "desc" }
      );
      setDocuments(data);
    } catch (err) {
      setError("Failed to load hansards. Please try again.");
      console.error("Error loading hansards:", err);
    } finally {
      setLoading(false);
    }
  };

  const _handleDownload = (doc: Document) => {
    setShowPaymentModal(true);
    setSelectedPlan({
      name: "Bronze",
      price: 10,
      duration: "1 Day",
      features: ["Document Downloads", "Basic Search", "24/7 Support"],
    });
  };

  const filteredDocuments = documents.filter((doc) => {
    const term = searchTerm.toLowerCase().trim();
    const tokens = term.split(/\s+/); // split into ['sebunya', 'a']

    const title = doc.title.toLowerCase();
    const keywords = (doc.metadata.keywords || []).map((k) => k.toLowerCase());

    const matchesSearch = tokens.every(
      (token) =>
        title.includes(token) || keywords.some((k) => k.includes(token))
    );

    const matchesYear = !filters.year || doc.subcategory.includes(filters.year);
    const matchesSession =
      !filters.session || doc.metadata.session === filters.session;
    const matchesStatus =
      !filters.status || doc.metadata.status === filters.status;

    return matchesSearch && matchesYear && matchesSession && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO
        title={year ? `Hansards ${year} | Educite Virtual Library` : `Hansards | Educite Virtual Library`}
        description={year ? 
          `Access ${year} parliamentary hansards and debates. Browse through official parliamentary records and documents from ${year}.` : 
          `Access parliamentary hansards and debates from all years. Browse through official parliamentary records and documents.`}
        keywords={`hansards ${year}, parliamentary debates, parliamentary records, ${year} parliament sessions`}
        canonicalUrl={`https://educitevl.edu.ug/hansards${year ? `/${year}` : ''}`}
        type="article"
      />
      
      {/* Add Breadcrumb Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://educitevl.edu.ug"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Hansards",
              "item": "https://educitevl.edu.ug/hansards"
            },
            ...(year ? [{
              "@type": "ListItem",
              "position": 3,
              "name": `Hansards ${year}`,
              "item": `https://educitevl.edu.ug/hansards/${year}`
            }] : [])
          ]
        })}
      </script>

      {/* Add CollectionPage Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": year ? `Hansards ${year}` : "Hansards",
          "description": year ? 
            `Access ${year} parliamentary hansards and debates` : 
            "Access parliamentary hansards and debates from all years",
          "hasPart": paginatedDocuments.map(doc => ({
            "@type": "DigitalDocument",
            "name": doc.title,
            "datePublished": doc.created_at,
            "about": "Parliamentary Hansard",
            "accessMode": "textual"
          }))
        })}
      </script>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Recent Hansards
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse and search through parliamentary hansards and debates
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
                    placeholder="Search hansards..."
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
                    Session
                  </label>
                  <select
                    value={filters.session}
                    onChange={(e) =>
                      setFilters({ ...filters, session: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Sessions</option>
                    <option value="morning">Morning Session</option>
                    <option value="afternoon">Afternoon Session</option>
                    <option value="evening">Evening Session</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading hansards...</p>
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
                              <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3
                                className="text-lg font-medium text-gray-900"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDocClick(doc)}
                              >
                                {doc.title}
                              </h3>
                              <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="mr-1.5 h-4 w-4" />
                                  {formatDate(doc.created_at)}
                                </span>
                                {doc.subcategory && (
                                  <span className="flex items-center">
                                    <Clock className="mr-1.5 h-4 w-4" />
                                    {doc.subcategory} Session
                                  </span>
                                )}
                                {doc.metadata.attendees && (
                                  <span className="flex items-center">
                                    <Users className="mr-1.5 h-4 w-4" />
                                    {doc.metadata.attendees} Members Present
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          {appContext?.user && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePreview(doc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                          >
                            <Lock className="h-4 w-4" />
                          </Button> */}

                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={downloadingFiles[doc.id]}
                                onClick={() =>
                                  handleDownload(
                                    doc.file_url,
                                    doc.title,
                                    doc.id
                                  )
                                }
                              >
                                {downloadingFiles[doc.id] ? (
                                  <Loader className="mr-0 h-5 w-5 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                            </>
                          )}
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
                        Subscribe to download hansards and access premium
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
