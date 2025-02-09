import { useState } from 'react';
import { 
  User,
  Search,
  Filter,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  RefreshCw,
  Download,
  UserCheck,
  UserX
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { LineChart } from '../../components/charts';

// Mock data - replace with API calls
const mockUsers = Array.from({ length: 100 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
  email: `user${i + 1}@example.com`,
  status: ['active', 'inactive'][Math.floor(Math.random() * 2)],
  lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
  lastActive: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
  inactiveReason: ['subscription_expired', 'account_suspended', 'user_deactivated', null][Math.floor(Math.random() * 4)],
  loginCount: Math.floor(Math.random() * 100),
  activityScore: Math.floor(Math.random() * 100)
}));

const mockActivityData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  active: [85, 88, 92, 89, 86, 82, 84],
  inactive: [15, 12, 8, 11, 14, 18, 16]
};

export default function UserStatus() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('7d');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<'lastLogin' | 'lastActive' | 'activityScore'>('lastLogin');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const activeUsers = users.filter(user => user.status === 'active');
  const inactiveUsers = users.filter(user => user.status === 'inactive');
  const activePercentage = (activeUsers.length / users.length) * 100;
  const inactivePercentage = (inactiveUsers.length / users.length) * 100;

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'lastLogin') {
        return (new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()) * direction;
      }
      if (sortField === 'lastActive') {
        return (new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()) * direction;
      }
      return (a.activityScore - b.activityScore) * direction;
    });

  const handleExport = (format: 'csv' | 'excel') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handleContactInactive = () => {
    // Implement contact functionality
    console.log('Contacting inactive users');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Status</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor user activity and engagement
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setUsers(mockUsers)}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Users"
          value={activeUsers.length}
          percentage={activePercentage}
          trend={5}
          icon={<UserCheck className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Inactive Users"
          value={inactiveUsers.length}
          percentage={inactivePercentage}
          trend={-2}
          icon={<UserX className="h-6 w-6" />}
          color="red"
        />
        <StatCard
          title="Average Activity Score"
          value={Math.round(users.reduce((acc, user) => acc + user.activityScore, 0) / users.length)}
          suffix="%"
          trend={3}
          icon={<CheckCircle className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="At Risk Users"
          value={users.filter(u => u.activityScore < 30).length}
          trend={8}
          icon={<AlertCircle className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Activity Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Activity Trends</h2>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as typeof selectedTimeframe)}
              className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <LineChart
            data={{
              labels: mockActivityData.labels,
              datasets: [
                {
                  label: 'Active Users',
                  data: mockActivityData.active,
                  borderColor: '#22c55e',
                  tension: 0.4
                },
                {
                  label: 'Inactive Users',
                  data: mockActivityData.inactive,
                  borderColor: '#ef4444',
                  tension: 0.4
                }
              ]
            }}
          />
        </div>

        {/* Inactivity Reasons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Inactivity Reasons</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Subscription Expired</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {inactiveUsers.filter(u => u.inactiveReason === 'subscription_expired').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Account Suspended</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {inactiveUsers.filter(u => u.inactiveReason === 'account_suspended').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-sm text-gray-600">User Deactivated</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {inactiveUsers.filter(u => u.inactiveReason === 'user_deactivated').length}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={handleContactInactive}
              className="w-full flex items-center justify-center"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Inactive Users
            </Button>
          </div>
        </div>
      </div>

      {/* Users List */}
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
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastLogin')}
                >
                  Last Login
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastActive')}
                >
                  Last Active
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('activityScore')}
                >
                  Activity Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {user.status === 'active' ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                      {new Date(user.lastActive).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            user.activityScore >= 70 ? 'bg-green-500' :
                            user.activityScore >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${user.activityScore}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {user.activityScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
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
  percentage?: number;
  suffix?: string;
  trend: number;
  icon: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'yellow';
}

function StatCard({ title, value, percentage, suffix = '', trend, icon, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
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
        <div className="mt-2 flex items-baseline">
          <p className="text-3xl font-bold text-gray-900">
            {value}{suffix}
          </p>
          {percentage !== undefined && (
            <p className="ml-2 text-sm text-gray-500">
              ({percentage.toFixed(1)}%)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}