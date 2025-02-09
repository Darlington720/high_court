import { useState } from 'react';
import { 
  FileText,
  Search,
  Filter,
  Calendar,
  Clock,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  User,
  Activity,
  BarChart2,
  TrendingUp,
  Folder,
  Tag,
  AlertCircle,
  CheckCircle,
  XCircle,
  Share2,
  FileUp,
  Globe,
  Printer,
  Mail
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { LineChart, BarChart, DoughnutChart } from '../../components/charts';

interface DocumentAccess {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  document: {
    id: string;
    title: string;
    category: string;
    subcategory: string;
    type: string;
  };
  action: 'view' | 'download' | 'print' | 'share';
  metadata: {
    ip: string;
    userAgent: string;
    location?: string;
    device?: string;
    browser?: string;
    os?: string;
    timeSpent?: number;
  };
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
}

// Mock data - replace with API calls
const mockAccess: DocumentAccess[] = Array.from({ length: 50 }, (_, i) => ({
  id: `access-${i + 1}`,
  user: {
    id: `user-${i + 1}`,
    name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
    email: `user${i + 1}@example.com`,
    role: ['admin', 'subscriber', 'guest'][Math.floor(Math.random() * 3)],
    avatar: Math.random() > 0.5 ? `https://i.pravatar.cc/150?u=${i}` : undefined
  },
  document: {
    id: `doc-${i + 1}`,
    title: ['Supreme Court Judgment 2024', 'Legal Guidelines', 'Privacy Policy', 'Terms of Service'][Math.floor(Math.random() * 4)],
    category: ['Hansards', 'Courts', 'Acts', 'Statutory'][Math.floor(Math.random() * 4)],
    subcategory: ['2024', 'Supreme Court', 'Civil Division', 'General'][Math.floor(Math.random() * 4)],
    type: ['pdf', 'doc', 'docx'][Math.floor(Math.random() * 3)]
  },
  action: ['view', 'download', 'print', 'share'][Math.floor(Math.random() * 4)] as DocumentAccess['action'],
  metadata: {
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0',
    location: ['Kampala', 'Entebbe', 'Jinja', 'Gulu'][Math.floor(Math.random() * 4)],
    device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
    browser: ['Chrome', 'Firefox', 'Safari'][Math.floor(Math.random() * 3)],
    os: ['Windows', 'MacOS', 'iOS', 'Android'][Math.floor(Math.random() * 4)],
    timeSpent: Math.floor(Math.random() * 3600) // seconds
  },
  status: ['success', 'failed', 'pending'][Math.floor(Math.random() * 3)] as 'success' | 'failed' | 'pending',
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
}));

const mockStats = {
  totalAccess: mockAccess.length,
  uniqueUsers: new Set(mockAccess.map(a => a.user.id)).size,
  successRate: (mockAccess.filter(a => a.status === 'success').length / mockAccess.length) * 100,
  popularDocuments: new Set(mockAccess.map(a => a.document.id)).size
};

const mockTrends = {
  hourly: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50))
  },
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 200))
  }
};

export default function DocumentAccess() {
  const [accessLogs, setAccessLogs] = useState<DocumentAccess[]>(mockAccess);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('daily');
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccessLogs(mockAccess);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handleEmailReport = () => {
    // Implement email report functionality
    console.log('Emailing report');
  };

  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = 
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.document.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesCategory = selectedCategory === 'all' || log.document.category === selectedCategory;
    
    const matchesDate = 
      (!dateRange.start || new Date(log.timestamp) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(log.timestamp) <= new Date(dateRange.end));

    return matchesSearch && matchesAction && matchesCategory && matchesDate;
  });

  const getActionIcon = (action: DocumentAccess['action']) => {
    switch (action) {
      case 'view': return <Eye className="h-4 w-4" />;
      case 'download': return <Download className="h-4 w-4" />;
      case 'print': return <Printer className="h-4 w-4" />;
      case 'share': return <Share2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Access</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and analyze document access patterns
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Access"
          value={mockStats.totalAccess}
          trend={12}
          icon={<Activity className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Unique Users"
          value={mockStats.uniqueUsers}
          trend={8}
          icon={<User className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Success Rate"
          value={`${mockStats.successRate.toFixed(1)}%`}
          trend={5}
          icon={<TrendingUp className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Popular Documents"
          value={mockStats.popularDocuments}
          trend={15}
          icon={<FileText className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Report Actions */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900">Report Actions</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleEmailReport}
            className="flex items-center"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Report
          </Button>
        </div>
      </div>

      {/* Activity Trends */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Access Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Access Trends</h2>
            <div className="flex rounded-lg border border-gray-300">
              <Button
                variant="ghost"
                onClick={() => setViewMode('hourly')}
                className={`rounded-l-lg ${viewMode === 'hourly' ? 'bg-gray-100' : ''}`}
              >
                Hourly
              </Button>
              <Button
                variant="ghost"
                onClick={() => setViewMode('daily')}
                className={`rounded-r-lg ${viewMode === 'daily' ? 'bg-gray-100' : ''}`}
              >
                Daily
              </Button>
            </div>
          </div>
          <LineChart
            data={{
              labels: viewMode === 'hourly' ? mockTrends.hourly.labels : mockTrends.daily.labels,
              datasets: [
                {
                  label: 'Document Access',
                  data: viewMode === 'hourly' ? mockTrends.hourly.data : mockTrends.daily.data,
                  borderColor: '#3b82f6',
                  tension: 0.4
                }
              ]
            }}
          />
        </div>

        {/* Access by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Access by Category</h2>
          <DoughnutChart
            data={{
              labels: ['Hansards', 'Courts', 'Acts', 'Statutory'],
              datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: [
                  '#3b82f6',
                  '#8b5cf6',
                  '#ec4899',
                  '#f59e0b'
                ]
              }]
            }}
          />
        </div>
      </div>

      {/* Access Logs */}
      <div className="bg-white rounded-lg shadow">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search access logs..."
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
                  Action
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Actions</option>
                  <option value="view">View</option>
                  <option value="download">Download</option>
                  <option value="print">Print</option>
                  <option value="share">Share</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Hansards">Hansards</option>
                  <option value="Courts">Courts</option>
                  <option value="Acts">Acts</option>
                  <option value="Statutory">Statutory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Access Logs Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {log.user.avatar ? (
                        <img
                          src={log.user.avatar}
                          alt={log.user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {log.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {log.document.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.document.category} / {log.document.subcategory}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${log.action === 'view' ? 'bg-blue-100 text-blue-800' : ''}
                      ${log.action === 'download' ? 'bg-green-100 text-green-800' : ''}
                      ${log.action === 'print' ? 'bg-purple-100 text-purple-800' : ''}
                      ${log.action === 'share' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {getActionIcon(log.action)}
                      <span className="ml-1">
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${log.status === 'success' ? 'bg-green-100 text-green-800' : ''}
                      ${log.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                      ${log.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {log.status === 'success' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {log.status === 'failed' && <XCircle className="mr-1 h-3 w-3" />}
                      {log.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe className="mr-1.5 h-4 w-4" />
                      {log.metadata.location || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1.5 h-4 w-4" />
                      {new Date(log.timestamp).toLocaleString()}
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
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'purple' | 'yellow';
}

function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
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