import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../../components/ui/Button';
import { DOCUMENT_CATEGORIES, DOCUMENT_TYPES, DOCUMENT_STATUSES } from '../../lib/constants';
import { fetchDocuments, uploadDocument, deleteDocument } from '../../lib/documents';
import type { Document, DocumentFilter, DocumentSort } from '../../types';
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
  Save
} from 'lucide-react';

export default function ViewDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DocumentFilter>({});
  const [sort, setSort] = useState<DocumentSort>({
    field: 'created_at',
    direction: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Add state for High Court subcategories
  const [selectedHighCourtDivision, setSelectedHighCourtDivision] = useState<string>('');

  // Function to handle High Court division selection
  const handleHighCourtDivisionChange = (division: string) => {
    setSelectedHighCourtDivision(division);
    setFilters(prev => ({
      ...prev,
      subcategory: `High Court of Uganda/${division}`
    }));
  };

  // Function to get available High Court divisions
  const getHighCourtDivisions = () => {
    return DOCUMENT_CATEGORIES['Courts of Record']
      .filter(sub => sub.startsWith('High Court of Uganda/'))
      .map(sub => sub.replace('High Court of Uganda/', ''));
  };

  // Add new state variables for advanced search
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    keywords: '',
    author: '',
    institution: '',
    jurisdiction: '',
    location: '',
    caseNumber: '',
    dateFrom: '',
    dateTo: '',
    documentType: '',
    status: ''
  });
  const [savedSearches, setSavedSearches] = useState<Array<{
    name: string;
    filters: typeof searchFilters;
  }>>([]);
  const [searchHistory, setSearchHistory] = useState<Array<{
    query: string;
    timestamp: Date;
  }>>([]);

  const handleSearch = () => {
    // Add search to history
    const searchQuery = buildSearchQuery();
    if (searchQuery) {
      setSearchHistory(prev => [{
        query: searchQuery,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);
    }

    // TODO: Implement actual search logic
    console.log('Searching with filters:', searchFilters);
  };

  const buildSearchQuery = () => {
    const parts = [];
    if (searchFilters.keywords) parts.push(`Keywords: ${searchFilters.keywords}`);
    if (searchFilters.author) parts.push(`Author: ${searchFilters.author}`);
    if (searchFilters.institution) parts.push(`Institution: ${searchFilters.institution}`);
    if (searchFilters.dateFrom) parts.push(`From: ${searchFilters.dateFrom}`);
    if (searchFilters.dateTo) parts.push(`To: ${searchFilters.dateTo}`);
    return parts.join(' | ');
  };

  const handleSaveSearch = () => {
    const name = prompt('Enter a name for this search:');
    if (name) {
      setSavedSearches(prev => [...prev, {
        name,
        filters: { ...searchFilters }
      }]);
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
              onClick={() => setViewMode('grid')}
              className={`rounded p-1 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Grid className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded p-1 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
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
                value={filters.category || ''}
                onChange={(e) => {
                  const category = e.target.value;
                  setFilters(prev => ({
                    ...prev,
                    category,
                    subcategory: undefined
                  }));
                  setSelectedHighCourtDivision('');
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
            {filters.category === 'Courts of Record' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  High Court Division
                </label>
                <select
                  value={selectedHighCourtDivision}
                  onChange={(e) => handleHighCourtDivisionChange(e.target.value)}
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
            {filters.category && filters.category !== 'Courts of Record' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  value={filters.subcategory || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    subcategory: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Subcategories</option>
                  {DOCUMENT_CATEGORIES[filters.category as keyof typeof DOCUMENT_CATEGORIES]
                    .filter(sub => !sub.includes('High Court of Uganda/'))
                    .map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))
                  }
                </select>
              </div>
            )}

            {/* Additional filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document Type
              </label>
              <select
                value={filters.type?.[0] || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  type: e.target.value ? [e.target.value] : undefined
                }))}
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
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchFilters.keywords}
                  onChange={(e) => setSearchFilters(prev => ({
                    ...prev,
                    keywords: e.target.value
                  }))}
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
          </div>

          {/* Advanced Search Filters */}
          {advancedSearch && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Document Properties */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Document Properties</h3>
                <div>
                  <label className="block text-sm text-gray-700">Document Type</label>
                  <select
                    value={searchFilters.documentType}
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      documentType: e.target.value
                    }))}
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
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      status: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Date Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">From</label>
                    <input
                      type="date"
                      value={searchFilters.dateFrom}
                      onChange={(e) => setSearchFilters(prev => ({
                        ...prev,
                        dateFrom: e.target.value
                      }))}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">To</label>
                    <input
                      type="date"
                      value={searchFilters.dateTo}
                      onChange={(e) => setSearchFilters(prev => ({
                        ...prev,
                        dateTo: e.target.value
                      }))}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Additional Filters</h3>
                <div>
                  <label className="block text-sm text-gray-700">Author</label>
                  <input
                    type="text"
                    value={searchFilters.author}
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      author: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter author name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Institution</label>
                  <input
                    type="text"
                    value={searchFilters.institution}
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      institution: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter institution name"
                  />
                </div>
              </div>

              {/* Legal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Legal Information</h3>
                <div>
                  <label className="block text-sm text-gray-700">Case Number</label>
                  <input
                    type="text"
                    value={searchFilters.caseNumber}
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      caseNumber: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Civil Appeal No. 13 of 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Jurisdiction</label>
                  <input
                    type="text"
                    value={searchFilters.jurisdiction}
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      jurisdiction: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter jurisdiction"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Location</h3>
                <div>
                  <label className="block text-sm text-gray-700">Location</label>
                  <input
                    type="text"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      location: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter location"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search History and Saved Searches */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
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
                onClick={() => setSearchFilters({
                  keywords: '',
                  author: '',
                  institution: '',
                  jurisdiction: '',
                  location: '',
                  caseNumber: '',
                  dateFrom: '',
                  dateTo: '',
                  documentType: '',
                  status: ''
                })}
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
        </div>

        {/* Recent Searches Dropdown */}
        {searchHistory.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Searches</h3>
            <div className="space-y-2">
              {searchHistory.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{search.query}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {search.timestamp.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Saved Searches</h3>
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
                        setSavedSearches(prev => prev.filter((_, i) => i !== index));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}