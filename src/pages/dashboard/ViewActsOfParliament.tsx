import { useState, useEffect } from 'react';
import { 
  FileText,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Tag,
  RefreshCw,
  MoreVertical,
  Building2,
  MapPin,
  Scale,
  User,
  ArrowUpRight,
  ArrowDownRight,
  FileUp,
  Plus,
  Archive,
  Scroll,
  BookOpen,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { fetchDocuments, deleteDocument } from '../../lib/documents';
import { exportData, formatFileSize, formatDate } from '../../lib/utils';
import type { Document } from '../../types';

interface ActStats {
  total: number;
  recent: number;
  pending: number;
  archived: number;
}

export default function ViewActsOfParliament() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    year: '',
    status: '',
    category: '',
    actType: ''
  });
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState<ActStats>({
    total: 0,
    recent: 0,
    pending: 0,
    archived: 0
  });

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocuments(
        { category: 'Acts of Parliament' },
        { field: sortField as any, direction: sortDirection }
      );
      setDocuments(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        recent: data.filter(d => new Date(d.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
        pending: data.filter(d => d.metadata.status === 'pending').length,
        archived: data.filter(d => d.metadata.status === 'archived').length
      });
    } catch (err) {
      setError('Failed to load Acts of Parliament. Please try again.');
      console.error('Error loading acts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this Act?')) {
      return;
    }

    try {
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        await deleteDocument(doc);
        setDocuments(prev => prev.filter(d => d.id !== documentId));
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete Act');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedDocuments.length} Acts?`)) {
      return;
    }

    try {
      for (const id of selectedDocuments) {
        const doc = documents.find(d => d.id === id);
        if (doc) {
          await deleteDocument(doc);
        }
      }
      setDocuments(prev => prev.filter(d => !selectedDocuments.includes(d.id)));
      setSelectedDocuments([]);
    } catch (err) {
      console.error('Error deleting documents:', err);
      setError('Failed to delete Acts');
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    const docsToExport = selectedDocuments.length > 0
      ? documents.filter(d => selectedDocuments.includes(d.id))
      : documents;

    const exportData = docsToExport.map(doc => ({
      Title: doc.title,
      'Act Number': doc.metadata.actNumber || 'N/A',
      Year: new Date(doc.created_at).getFullYear(),
      'Date Published': formatDate(doc.created_at),
      'Commencement Date': doc.metadata.commencementDate || 'N/A',
      Status: doc.metadata.status || 'N/A',
      'File Size': formatFileSize(doc.metadata.size)
    }));

    try {
      await exportData(exportData, format, 'acts-of-parliament');
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.metadata.keywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesYear = !filters.year || doc.created_at.includes(filters.year);
    const matchesStatus = !filters.status || doc.metadata.status === filters.status;
    const matchesCategory = !filters.category || doc.metadata.category === filters.category;
    const matchesActType = !filters.actType || doc.metadata.actType === filters.actType;

    return matchesSearch && matchesYear && matchesStatus && matchesCategory && matchesActType;
  }).sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'created_at') {
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * direction;
    }
    if (sortField === 'title') {
      return a.title.localeCompare(b.title) * direction;
    }
    if (sortField === 'size') {
      return (a.metadata.size - b.metadata.size) * direction;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Acts of Parliament</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage Acts of Parliament
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={loadDocuments}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/dashboard/documents/upload'}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Act
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Acts"
          value={stats.total}
          trend={12}
          icon={<Scroll className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Recent Uploads"
          value={stats.recent}
          trend={8}
          icon={<FileUp className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          trend={-2}
          icon={<Clock className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Archived"
          value={stats.archived}
          trend={5}
          icon={<Archive className="h-6 w-6" />}
          color="purple"
        />
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
                placeholder="Search Acts of Parliament..."
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
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Act Type
              </label>
              <select
                value={filters.actType}
                onChange={(e) => setFilters({ ...filters, actType: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="principal">Principal Act</option>
                <option value="amendment">Amendment Act</option>
                <option value="repeal">Repeal Act</option>
                <option value="consolidation">Consolidation Act</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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

      {/* Acts Table */}
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
                onClick={() => handleExport('pdf')}
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
                    checked={selectedDocuments.length === filteredDocuments.length}
                    onChange={(e) => setSelectedDocuments(
                      e.target.checked ? filteredDocuments.map(d => d.id) : []
                    )}
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
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={(e) => setSelectedDocuments(prev => 
                        e.target.checked
                          ? [...prev, doc.id]
                          : prev.filter(id => id !== doc.id)
                      )}
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
                        {doc.metadata.actNumber || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {doc.metadata.actType || 'Principal Act'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${doc.metadata.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      ${doc.metadata.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${doc.metadata.status === 'archived' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {doc.metadata.status === 'active' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {doc.metadata.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                      {doc.metadata.status === 'archived' && <Archive className="mr-1 h-3 w-3" />}
                      {doc.metadata.status || 'N/A'}
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
                      <Button variant="ghost" size="sm">
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
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  trend: number;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'yellow' | 'purple';
}

function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg ${colorClasses[color]} p-3`}>
          {icon}
        </div>
        {trend !== 0 && (
          <div className={`flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            <span className="ml-1 text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}