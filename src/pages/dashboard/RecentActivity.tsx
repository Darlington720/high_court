import { useState } from 'react';
import { 
  FileText, 
  Download,
  Upload,
  CreditCard,
  User,
  Clock,
  Calendar,
  Filter,
  Search,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  RefreshCcw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Activity type definitions
type ActivityType = 'document' | 'user' | 'subscription' | 'system';
type ActivityStatus = 'success' | 'failed' | 'pending';

interface Activity {
  id: string;
  type: ActivityType;
  action: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  details: string;
  status: ActivityStatus;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Mock data - replace with real data from API
const mockActivities: Activity[] = Array.from({ length: 50 }, (_, i) => ({
  id: `act-${i + 1}`,
  type: ['document', 'user', 'subscription', 'system'][Math.floor(Math.random() * 4)] as ActivityType,
  action: ['upload', 'download', 'login', 'subscribe', 'update', 'delete'][Math.floor(Math.random() * 6)],
  user: {
    name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
    email: 'user@example.com',
  },
  details: `Activity details ${i + 1}`,
  status: ['success', 'failed', 'pending'][Math.floor(Math.random() * 3)] as ActivityStatus,
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
  metadata: {
    ip: '192.168.1.1',
    browser: 'Chrome',
    os: 'Windows'
  }
}));

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ActivityStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<'timestamp' | 'type' | 'status'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort activities
  const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = 
        activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || activity.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
      
      const matchesDate = 
        (!dateRange.start || new Date(activity.timestamp) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(activity.timestamp) <= new Date(dateRange.end));

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'timestamp') {
        return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * direction;
      }
      return (a[sortField] > b[sortField] ? 1 : -1) * direction;
    });

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const refreshActivities = () => {
    // In a real app, this would fetch new data from the API
    setActivities(mockActivities);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recent Activity</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and monitor all system activities
          </p>
        </div>
        <Button
          variant="outline"
          onClick={refreshActivities}
          className="flex items-center"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
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
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ActivityType | 'all')}
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="document">Document</option>
                <option value="user">User</option>
                <option value="subscription">Subscription</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ActivityStatus | 'all')}
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Type
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center">
                    Time
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ActivityIcon type={activity.type} action={activity.action} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.details}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${activity.type === 'document' && 'bg-blue-100 text-blue-800'}
                      ${activity.type === 'user' && 'bg-green-100 text-green-800'}
                      ${activity.type === 'subscription' && 'bg-purple-100 text-purple-800'}
                      ${activity.type === 'system' && 'bg-gray-100 text-gray-800'}
                    `}>
                      {activity.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={activity.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
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

function ActivityIcon({ type, action }: { type: ActivityType; action: string }) {
  const getIcon = () => {
    switch (action) {
      case 'upload':
        return <Upload className="h-5 w-5 text-blue-500" />;
      case 'download':
        return <Download className="h-5 w-5 text-green-500" />;
      case 'login':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'subscribe':
        return <CreditCard className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="rounded-full bg-gray-100 p-2">
      {getIcon()}
    </div>
  );
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800'
        };
      case 'failed':
        return {
          icon: XCircle,
          className: 'bg-red-100 text-red-800'
        };
      case 'pending':
        return {
          icon: AlertCircle,
          className: 'bg-yellow-100 text-yellow-800'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <Icon className="mr-1 h-3 w-3" />
      {status}
    </span>
  );
}