import { useState, useCallback, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../../components/ui/Button";
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPES,
  DOCUMENT_STATUSES,
} from "../../lib/constants";
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
} from "../../lib/documents";
import type { Document, DocumentFilter, DocumentSort } from "../../types";
import { exportData, formatFileSize, formatDate } from "../../lib/utils";
import {
  Upload,
  Filter,
  Search,
  FileText,
  Folder,
  X,
  ChevronDown,
  Download,
  ExternalLink,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Tag,
  FileType,
  RefreshCw,
  Grid,
  List,
  Archive,
  ChevronRight,
  Eye,
  Scroll,
  Edit2,
  MoreVertical,
  BookOpen,
  Gavel,
  FileSpreadsheet,
  Plus,
  User,
  Building2,
  Globe,
  MapPin,
  Hash,
  Save,
  ChevronLeft,
  Loader,
} from "lucide-react";
import EditDocument from "../../components/EditDocument";
import AppContext from "../../context/AppContext";

export default function ViewDocuments() {
  const appContext = useContext(AppContext);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    year: "",
    status: "",
    category: "",
    actType: "",
  });
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [stats, setStats] = useState<ActStats>({
    total: 0,
    recent: 0,
    pending: 0,
    archived: 0,
  });
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);

  const [sort, setSort] = useState<DocumentSort>({
    field: "created_at",
    direction: "desc",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Add state for High Court subcategories
  const [selectedHighCourtDivision, setSelectedHighCourtDivision] =
    useState<string>("");

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, [filters]);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);

    console.log("filters", {
      title: searchTerm,
      category: filters.category,
      subcategory: filters.subcategory,
    });
    try {
      const data = await fetchDocuments(
        {
          title: searchTerm,
          category: filters.category,
          subcategory: filters.subcategory,
        },
        { field: sortField as any, direction: sortDirection },
        2000
      );
      setDocuments(data);

      // Calculate stats
      setStats({
        total: data.length,
        recent: data.filter(
          (d) =>
            new Date(d.created_at) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        pending: data.filter((d) => d.metadata.status === "pending").length,
        archived: data.filter((d) => d.metadata.status === "archived").length,
      });
    } catch (err) {
      setError("Failed to load Courts of record. Please try again.");
      console.error("Error loading acts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
  };

  const handleDelete = async (documentId: string) => {
    if (!window.confirm("Are you sure you want to delete this Act?")) {
      return;
    }

    try {
      const doc = documents.find((d) => d.id === documentId);
      if (doc) {
        await deleteDocument(doc);
        setDocuments((prev) => prev.filter((d) => d.id !== documentId));
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      setError("Failed to delete Act");
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedDocuments.length} Acts?`
      )
    ) {
      return;
    }

    try {
      for (const id of selectedDocuments) {
        const doc = documents.find((d) => d.id === id);
        if (doc) {
          await deleteDocument(doc);
        }
      }
      setDocuments((prev) =>
        prev.filter((d) => !selectedDocuments.includes(d.id))
      );
      setSelectedDocuments([]);
    } catch (err) {
      console.error("Error deleting documents:", err);
      setError("Failed to delete Acts");
    }
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    const docsToExport =
      selectedDocuments.length > 0
        ? documents.filter((d) => selectedDocuments.includes(d.id))
        : documents;

    const exportData = docsToExport.map((doc) => ({
      Title: doc.title,
      "Act Number": doc.metadata.actNumber || "N/A",
      Year: new Date(doc.created_at).getFullYear(),
      "Date Published": formatDate(doc.created_at),
      "Commencement Date": doc.metadata.commencementDate || "N/A",
      Status: doc.metadata.status || "N/A",
      "File Size": formatFileSize(doc.metadata.size),
    }));

    try {
      // await exportData(exportData, format, "acts-of-parliament");
    } catch (err) {
      console.error("Error exporting data:", err);
      setError("Failed to export data");
    }
  };

  const handleSearch = async () => {
    if (searchTerm == "") return;

    loadDocuments();
  };

  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.metadata.keywords?.some((k) =>
          k.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesYear =
        !filters.year || doc.created_at.includes(filters.year);
      const matchesStatus =
        !filters.status || doc.metadata.status === filters.status;
      const matchesCategory =
        !filters.category || doc.metadata.category === filters.category;
      const matchesActType =
        !filters.actType || doc.metadata.actType === filters.actType;

      return (
        // matchesSearch &&
        matchesYear &&
        matchesStatus &&
        // matchesCategory &&
        matchesActType
      );
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortField === "created_at") {
        return (
          (new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()) *
          direction
        );
      }
      if (sortField === "title") {
        return a.title.localeCompare(b.title) * direction;
      }
      if (sortField === "size") {
        return (a.metadata.size - b.metadata.size) * direction;
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to handle High Court division selection
  const handleHighCourtDivisionChange = (division: string) => {
    setSelectedHighCourtDivision(division);
    setFilters((prev) => ({
      ...prev,
      subcategory: `${division}`,
    }));
  };

  // Function to get available High Court divisions
  // const getHighCourtDivisions = () => {
  //   return DOCUMENT_CATEGORIES["Courts of Record"]
  //     .filter((sub) => sub.startsWith("High Court of Uganda/"))
  //     .map((sub) => sub.replace("High Court of Uganda/", ""));
  // };

  const getHighCourtDivisions = () => {
    return DOCUMENT_CATEGORIES["Courts of Record"].map((sub) => {
      // If it starts with "High Court of Uganda/", remove that part
      // if (sub.startsWith("High Court of Uganda/")) {
      //   return sub.replace("High Court of Uganda/", "");
      // }
      // Otherwise, return the subcategory as it is
      return sub;
    });
  };

  // console.log("divisions", getHighCourtDivisions());

  // Add new state variables for advanced search
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    keywords: "",
    author: "",
    institution: "",
    jurisdiction: "",
    location: "",
    caseNumber: "",
    dateFrom: "",
    dateTo: "",
    documentType: "",
    status: "",
  });
  const [savedSearches, setSavedSearches] = useState<
    Array<{
      name: string;
      filters: typeof searchFilters;
    }>
  >([]);
  const [searchHistory, setSearchHistory] = useState<
    Array<{
      query: string;
      timestamp: Date;
    }>
  >([]);

  // const handleSearch = () => {
  //   // Add search to history
  //   const searchQuery = buildSearchQuery();
  //   if (searchQuery) {
  //     setSearchHistory((prev) => [
  //       {
  //         query: searchQuery,
  //         timestamp: new Date(),
  //       },
  //       ...prev.slice(0, 9),
  //     ]);
  //   }

  //   // TODO: Implement actual search logic
  //   console.log("Searching with filters:", searchFilters);
  // };

  const buildSearchQuery = () => {
    const parts = [];
    if (searchFilters.keywords)
      parts.push(`Keywords: ${searchFilters.keywords}`);
    if (searchFilters.author) parts.push(`Author: ${searchFilters.author}`);
    if (searchFilters.institution)
      parts.push(`Institution: ${searchFilters.institution}`);
    if (searchFilters.dateFrom) parts.push(`From: ${searchFilters.dateFrom}`);
    if (searchFilters.dateTo) parts.push(`To: ${searchFilters.dateTo}`);
    return parts.join(" | ");
  };

  const handleSaveSearch = () => {
    const name = prompt("Enter a name for this search:");
    if (name) {
      setSavedSearches((prev) => [
        ...prev,
        {
          name,
          filters: { ...searchFilters },
        },
      ]);
    }
  };

  const handleLoadSearch = (filters: typeof searchFilters) => {
    setSearchFilters(filters);
    handleSearch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your legal documents
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <div className="flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded p-1 ${
                viewMode === "grid" ? "bg-gray-100" : ""
              }`}
            >
              <Grid className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded p-1 ${
                viewMode === "list" ? "bg-gray-100" : ""
              }`}
            >
              <List className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
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
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSearch}
            className="flex items-center"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                {"Searching..."}
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
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
                Category
              </label>
              <select
                value={filters.category || ""}
                onChange={(e) => {
                  const category = e.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    category,
                    subcategory: undefined,
                  }));
                  setSelectedHighCourtDivision("");
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {Object.keys(DOCUMENT_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Conditional rendering for High Court divisions */}
            {filters.category === "Courts of Record" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  High Court Division
                </label>
                <select
                  value={selectedHighCourtDivision}
                  onChange={(e) =>
                    handleHighCourtDivisionChange(e.target.value)
                  }
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Division</option>
                  {getHighCourtDivisions().map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Regular subcategory selection for other categories */}
            {filters.category && filters.category !== "Courts of Record" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  value={filters.subcategory || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      subcategory: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Subcategories</option>
                  {DOCUMENT_CATEGORIES[
                    filters.category as keyof typeof DOCUMENT_CATEGORIES
                  ]
                    .filter((sub) => {
                      // console.log("sub cats", sub); // Log each subcategory
                      return !sub.includes("High Court of Uganda/");
                    })
                    .map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Additional filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document Type
              </label>
              <select
                value={filters.type?.[0] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    type: e.target.value ? [e.target.value] : undefined,
                  }))
                }
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {Object.entries(DOCUMENT_TYPES).map(([type, { label }]) => (
                  <option key={type} value={type}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Search Panel */}
      {false && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            {/* <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchFilters.keywords}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      keywords: e.target.value,
                    }))
                  }
                  placeholder="Search documents..."
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setAdvancedSearch(!advancedSearch)}
                className="flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Advanced Search
              </Button>
              <Button
                variant="primary"
                onClick={handleSearch}
                className="flex items-center"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div> */}

            {/* Advanced Search Filters */}
            {advancedSearch && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Document Properties */}
                {/* <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Document Properties
                </h3>
                <div>
                  <label className="block text-sm text-gray-700">
                    Document Type
                  </label>
                  <select
                    value={searchFilters.documentType}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        documentType: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="pdf">PDF</option>
                    <option value="doc">DOC</option>
                    <option value="docx">DOCX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Status</label>
                  <select
                    value={searchFilters.status}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div> */}

                {/* Date Range */}
                {/* <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Date Range
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">From</label>
                    <input
                      type="date"
                      value={searchFilters.dateFrom}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          dateFrom: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">To</label>
                    <input
                      type="date"
                      value={searchFilters.dateTo}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          dateTo: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div> */}

                {/* Additional Filters */}
                {/* <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Additional Filters
                </h3>
                <div>
                  <label className="block text-sm text-gray-700">Author</label>
                  <input
                    type="text"
                    value={searchFilters.author}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter author name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={searchFilters.institution}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        institution: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter institution name"
                  />
                </div>
              </div> */}

                {/* Legal Information */}
                {/* <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Legal Information
                </h3>
                <div>
                  <label className="block text-sm text-gray-700">
                    Case Number
                  </label>
                  <input
                    type="text"
                    value={searchFilters.caseNumber}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        caseNumber: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Civil Appeal No. 13 of 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={searchFilters.jurisdiction}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        jurisdiction: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter jurisdiction"
                  />
                </div>
              </div> */}

                {/* Location */}
                {/* <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Location</h3>
                <div>
                  <label className="block text-sm text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={searchFilters.location}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter location"
                  />
                </div>
              </div> */}
              </div>
            )}
          </div>

          {/* Search History and Saved Searches */}
          {/* <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveSearch}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Search
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSearchFilters({
                    keywords: "",
                    author: "",
                    institution: "",
                    jurisdiction: "",
                    location: "",
                    caseNumber: "",
                    dateFrom: "",
                    dateTo: "",
                    documentType: "",
                    status: "",
                  })
                }
                className="flex items-center"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {searchHistory.length} recent searches
              </span>
            </div>
          </div>
        </div> */}

          {/* Recent Searches Dropdown */}
          {/* {searchHistory.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Recent Searches
            </h3>
            <div className="space-y-2">
              {searchHistory.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {search.query}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {search.timestamp.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )} */}

          {/* Saved Searches */}
          {/* {savedSearches.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Saved Searches
            </h3>
            <div className="space-y-2">
              {savedSearches.map((saved, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{saved.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadSearch(saved.filters)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSavedSearches((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Bulk Actions */}
        {selectedDocuments.length > 0 && (
          <div className="bg-blue-50 px-6 py-3 flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedDocuments.length} Acts selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport("pdf")}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
              <Button
                variant="outline"
                onClick={handleBulkDelete}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedDocuments.length === filteredDocuments.length
                    }
                    onChange={(e) =>
                      setSelectedDocuments(
                        e.target.checked
                          ? filteredDocuments.map((d) => d.id)
                          : []
                      )
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Act Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={(e) =>
                        setSelectedDocuments((prev) =>
                          e.target.checked
                            ? [...prev, doc.id]
                            : prev.filter((id) => id !== doc.id)
                        )
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Scroll className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {doc.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatFileSize(doc.metadata.size)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {doc.metadata.actNumber || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {doc.metadata.actType || "Principal Act"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        doc.metadata.status === "active"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                      ${
                        doc.metadata.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                      ${
                        doc.metadata.status === "archived"
                          ? "bg-gray-100 text-gray-800"
                          : ""
                      }
                    `}
                    >
                      {doc.metadata.status === "active" && (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      )}
                      {doc.metadata.status === "pending" && (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {doc.metadata.status === "archived" && (
                        <Archive className="mr-1 h-3 w-3" />
                      )}
                      {doc.metadata.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-4 w-4" />
                      {formatDate(doc.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          appContext?.setSelectedDocument(doc);
                          appContext?.setEditDocModalVisible(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-400 hover:text-gray-500"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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

      <EditDocument />
    </div>
  );
}
