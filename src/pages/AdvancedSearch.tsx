import { useState } from 'react';
import { 
  Search,
  Filter,
  Calendar,
  Tag,
  FileType,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Gavel,
  FileText,
  FileSpreadsheet,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building2,
  Globe,
  MapPin,
  Hash
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SearchResults } from '../components/SearchResults';
import { DOCUMENT_CATEGORIES } from '../lib/constants';

interface AdvancedSearchFilters {
  category?: string;
  subcategory?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  documentType?: string[];
  status?: string;
  keywords?: string[];
  author?: string;
  institution?: string;
  jurisdiction?: string;
  location?: string;
  caseNumber?: string;
  yearRange?: {
    start: string;
    end: string;
  };
}

interface SearchResult {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  fileType: string;
  date: string;
  author?: string;
  institution?: string;
  jurisdiction?: string;
  location?: string;
  caseNumber?: string;
  status: 'active' | 'archived' | 'draft';
  metadata: {
    size: number;
    lastModified: string;
    keywords: string[];
  };
}

// Mock data for demonstration
const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Supreme Court Judgment 2024',
    category: 'Courts of Record',
    subcategory: 'Supreme Court of Uganda',
    fileType: 'pdf',
    date: '2024-02-20',
    author: 'Hon. Chief Justice',
    institution: 'Supreme Court',
    jurisdiction: 'Uganda',
    location: 'Kampala',
    caseNumber: 'Civil Appeal No. 13 of 2024',
    status: 'active',
    metadata: {
      size: 2500000,
      lastModified: '2024-02-20T10:00:00Z',
      keywords: ['judgment', 'civil appeal', 'supreme court']
    }
  },
  // Add more mock results as needed
];

export default function AdvancedSearch() {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({});
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(true);
  const [selectedSort, setSelectedSort] = useState<string>('relevance');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<{name: string, filters: AdvancedSearchFilters}[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSearchResults(mockResults);
      
      // Add to search history
      const searchQuery = buildSearchQuery();
      if (searchQuery) {
        setSearchHistory(prev => [searchQuery, ...prev.slice(0, 9)]);
      }
    } finally {
      setLoading(false);
    }
  };

  const buildSearchQuery = () => {
    const parts = [];
    if (filters.keywords?.length) parts.push(`Keywords: ${filters.keywords.join(', ')}`);
    if (filters.category) parts.push(`Category: ${filters.category}`);
    if (filters.dateRange?.start) parts.push(`From: ${filters.dateRange.start}`);
    if (filters.dateRange?.end) parts.push(`To: ${filters.dateRange.end}`);
    return parts.join(' | ');
  };

  const handleSaveSearch = () => {
    const name = prompt('Enter a name for this search:');
    if (name) {
      setSavedSearches(prev => [...prev, { name, filters: { ...filters } }]);
    }
  };

  const handleLoadSearch = (savedFilters: AdvancedSearchFilters) => {
    setFilters(savedFilters);
    handleSearch();
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Hansards':
        return <BookOpen className="h-5 w-5" />;
      case 'Courts of Record':
        return <Gavel className="h-5 w-5" />;
      case 'Acts of Parliament':
        return <FileText className="h-5 w-5" />;
      case 'Statutory Instruments':
        return <FileSpreadsheet className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Search</h1>
            <p className="mt-1 text-sm text-gray-500">
              Search through our comprehensive collection of legal documents
            </p>
          </div>

          {/* Main Search Area */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={filters.keywords?.join(' ') || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        keywords: e.target.value.split(' ').filter(k => k)
                      })}
                      placeholder="Enter keywords to search..."
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex items-center px-6"
                >
                  {loading ? (
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-5 w-5" />
                  )}
                  Search
                </Button>
              </div>
            </div>

            {/* Filters Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => setExpandedFilters(!expandedFilters)}
                className="flex items-center justify-between w-full px-6 py-3 text-left"
              >
                <div className="flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Advanced Filters</span>
                </div>
                {expandedFilters ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {expandedFilters && (
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Category and Subcategory */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        value={filters.category || ''}
                        onChange={(e) => setFilters({
                          ...filters,
                          category: e.target.value,
                          subcategory: undefined
                        })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">All Categories</option>
                        {Object.keys(DOCUMENT_CATEGORIES).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    {filters.category && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Subcategory
                        </label>
                        <select
                          value={filters.subcategory || ''}
                          onChange={(e) => setFilters({
                            ...filters,
                            subcategory: e.target.value
                          })}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">All Subcategories</option>
                          {DOCUMENT_CATEGORIES[filters.category as keyof typeof DOCUMENT_CATEGORIES]?.map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date Range
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={filters.dateRange?.start || ''}
                        onChange={(e) => setFilters({
                          ...filters,
                          dateRange: { ...filters.dateRange, start: e.target.value }
                        })}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <input
                        type="date"
                        value={filters.dateRange?.end || ''}
                        onChange={(e) => setFilters({
                          ...filters,
                          dateRange: { ...filters.dateRange, end: e.target.value }
                        })}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Document Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Document Type
                    </label>
                    <select
                      value={filters.documentType?.[0] || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        documentType: e.target.value ? [e.target.value] : undefined
                      })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="pdf">PDF</option>
                      <option value="doc">DOC</option>
                      <option value="docx">DOCX</option>
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Author
                    </label>
                    <input
                      type="text"
                      value={filters.author || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        author: e.target.value
                      })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter author name"
                    />
                  </div>

                  {/* Institution */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={filters.institution || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        institution: e.target.value
                      })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter institution name"
                    />
                  </div>

                  {/* Case Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Case Number
                    </label>
                    <input
                      type="text"
                      value={filters.caseNumber || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        caseNumber: e.target.value
                      })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., Civil Appeal No. 13 of 2024"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Search Options */}
            <div className="p-4 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-4">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveSearch}
                  className="flex items-center"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Save Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport('csv')}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Search History and Saved Searches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Searches */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Searches</h2>
              <div className="space-y-2">
                {searchHistory.map((query, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{query}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSearch()}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Searches */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Saved Searches</h2>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadSearch(saved.filters)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Search Results ({searchResults.length})
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleExport('pdf')}
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                </div>
              </div>
              <SearchResults results={searchResults} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}