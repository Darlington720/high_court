import { useState } from 'react';
import { 
  Users,
  Search,
  Filter,
  Calendar,
  Clock,
  Globe,
  FileText,
  Download,
  Upload,
  LogIn,
  LogOut,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  User,
  Activity as ActivityIcon,
  BarChart2,
  TrendingUp,
  Mail,
  Save,
  X,
  BookOpen,
  Trash2,
  Eye,
  Edit2,
  MoreVertical,
  FileUp,
  Share2,
  Printer,
  Lock,
  UserCheck,
  UserX,
  Building2,
  Database,
  Smartphone,
  Laptop,
  Monitor
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { LineChart, BarChart } from '../../components/charts';

interface UserActivity {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  action: 'login' | 'logout' | 'view' | 'download' | 'upload' | 'settings' | 'failed_login' | 'print' | 'share' | 'edit' | 'delete' | 'password_change' | 'profile_update';
  resource?: {
    type: 'document' | 'page' | 'settings' | 'profile';
    id: string;
    name: string;
  };
  metadata: {
    ip: string;
    userAgent: string;
    location?: string;
    device?: string;
    browser?: string;
    os?: string;
    success?: boolean;
    details?: string;
  };
  status: 'success' | 'failed' | 'warning';
  timestamp: string;
}

// Mock data - replace with API calls
const mockActivities: UserActivity[] = Array.from({ length: 50 }, (_, i) => ({
  id: `act-${i + 1}`,
  user: {
    id: `user-${i + 1}`,
    name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
    email: `user${i + 1}@example.com`,
    role: ['admin', 'subscriber', 'guest'][Math.floor(Math.random() * 3)],
    avatar: Math.random() > 0.5 ? `https://i.pravatar.cc/150?u=${i}` : undefined
  },
  action: ['login', 'logout', 'view', 'download', 'upload', 'settings', 'failed_login', 'print', 'share', 'edit', 'delete', 'password_change', 'profile_update'][Math.floor(Math.random() * 13)] as UserActivity['action'],
  resource: Math.random() > 0.3 ? {
    type: ['document', 'page', 'settings', 'profile'][Math.floor(Math.random() * 4)] as 'document' | 'page' | 'settings' | 'profile',
    id: `res-${Math.floor(Math.random() * 100)}`,
    name: ['Annual Report 2024', 'Legal Guidelines', 'Privacy Policy', 'User Profile', 'System Settings'][Math.floor(Math.random() * 5)]
  } : undefined,
  metadata: {
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0',
    location: ['Kampala', 'Entebbe', 'Jinja', 'Gulu'][Math.floor(Math.random() * 4)],
    device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
    browser: ['Chrome', 'Firefox', 'Safari'][Math.floor(Math.random() * 3)],
    os: ['Windows', 'MacOS', 'iOS', 'Android'][Math.floor(Math.random() * 4)],
    success: Math.random() > 0.1,
    details: Math.random() > 0.7 ? 'Additional activity details here' : undefined
  },
  status: ['success', 'failed', 'warning'][Math.floor(Math.random() * 3)] as 'success' | 'failed' | 'warning',
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
}));

const mockStats = {
  totalActivities: mockActivities.length,
  activeUsers: new Set(mockActivities.map(a => a.user.id)).size,
  successRate: (mockActivities.filter(a => a.status === 'success').length / mockActivities.length) * 100,
  failedLogins: mockActivities.filter(a => a.action === 'failed_login').length,
  totalDownloads: mockActivities.filter(a => a.action === 'download').length,
  totalUploads: mockActivities.filter(a => a.action === 'upload').length
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

export default function UserActivity() {
  const [activities, setActivities] = useState<UserActivity[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('daily');
  const [loading, setLoading] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
    setShowExportMenu(false);
  };

  const handleBulkAction = (action: 'delete' | 'archive' | 'flag') => {
    // Implement bulk actions
    console.log(`Bulk ${action}:`, selectedActivities);
  };

  const getActionIcon = (action: UserActivity['action']) => {
    switch (action) {
      case 'login': return <LogIn className="h-4 w-4" />;
      case 'logout': return <LogOut className="h-4 w-4" />;
      case 'view': return <Eye className="h-4 w-4" />;
      case 'download': return <Download className="h-4 w-4" />;
      case 'upload': return <Upload className="h-4 w-4" />;
      case 'settings': return <Settings className="h-4 w-4" />;
      case 'failed_login': return <XCircle className="h-4 w-4" />;
      case 'print': return <Printer className="h-4 w-4" />;
      case 'share': return <Share2 className="h-4 w-4" />;
      case 'edit': return <Edit2 className="h-4 w-4" />;
      case 'delete': return <Trash2 className="h-4 w-4" />;
      case 'password_change': return <Lock className="h-4 w-4" />;
      case 'profile_update': return <User className="h-4 w-4" />;
      default: return <ActivityIcon className="h-4 w-4" />;
    }
  };

  const getDeviceIcon = (device?: string) => {
    switch (device?.toLowerCase()) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Laptop className="h-4 w-4" />;
      default: return <Device className="h-4 w-4" />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.resource?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = selectedAction === 'all' || activity.action === selectedAction;
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    
    const matchesDate = 
      (!dateRange.start || new Date(activity.timestamp) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(activity.timestamp) <= new Date(dateRange.end));

    return matchesSearch && matchesAction && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Activity</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and analyze user actions and behavior
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
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="mr-3 h-4 w-4 text-gray-400" />
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Database className="mr-3 h-4 w-4 text-gray-400" />
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="mr-3 h-4 w-4 text-gray-400" />
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Activities"
          value={mockStats.totalActivities}
          trend={12}
          icon={<ActivityIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={mockStats.activeUsers}
          trend={8}
          icon={<UserCheck className="h-6 w-6" />}
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
          title="Failed Logins"
          value={mockStats.failedLogins}
          trend={-3}
          icon={<UserX className="h-6 w-6" />}
          color="red"
        />
      </div>

      {/* Activity Trends */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activity Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Activity Trends</h2>
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
                  label: 'Activities',
                  data: viewMode === 'hourly' ? mockTrends.hourly.data : mockTrends.daily.data,
                  borderColor: '#3b82f6',
                  tension: 0.4
                }
              ]
            }}
          />
        </div>

        {/* Activity by Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Activity Distribution</h2>
          <BarChart
            data={{
              labels: ['Login', 'View', 'Download', 'Upload', 'Settings', 'Other'],
              datasets: [{
                label: 'Activities',
                data: [150, 300, 200, 100, 50, 120],
                backgroundColor: '#93c5fd'
              }]
            }}
          />
        </div>
      </div>

      {/* Activity List */}
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
                  placeholder="Search activities..."
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
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="view">View</option>
                  <option value="download">Download</option>
                  <option value="upload">Upload</option>
                  <option value="settings">Settings</option>
                  <option value="failed_login">Failed Login</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="warning">Warning</option>
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

        {/* Activity Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device Info
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
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {activity.user.avatar ? (
                        <img
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${activity.action === 'login' ? 'bg-green-100 text-green-800' : ''}
                      ${activity.action === 'logout' ? 'bg-gray-100 text-gray-800' : ''}
                      ${activity.action === 'view' ? 'bg-blue-100 text-blue-800' : ''}
                      ${activity.action === 'download' ? 'bg-purple-100 text-purple-800' : ''}
                      ${activity.action === 'upload' ? 'bg-indigo-100 text-indigo-800' : ''}
                      ${activity.action === 'settings' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${activity.action === 'failed_login' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {getActionIcon(activity.action)}
                      <span className="ml-1">
                        {activity.action.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {activity.resource ? (
                      <div className="text-sm text-gray-900">
                        {activity.resource.name}
                        <span className="text-xs text-gray-500 ml-1">
                          ({activity.resource.type})
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${activity.status === 'success' ? 'bg-green-100 text-green-800' : ''}
                      ${activity.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                      ${activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {activity.status === 'success' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {activity.status === 'failed' && <XCircle className="mr-1 h-3 w-3" />}
                      {activity.status === 'warning' && <AlertCircle className="mr-1 h-3 w-3" />}
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      {getDeviceIcon(activity.metadata.device)}
                      <span className="ml-2">
                        {activity.metadata.device} - {activity.metadata.browser}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe className="mr-1.5 h-4 w-4" />
                      {activity.metadata.location || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1.5 h-4 w-4" />
                      {new Date(activity.timestamp).toLocaleString()}
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
  color: 'green' | 'blue' | 'purple' | 'red';
}

function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600'
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