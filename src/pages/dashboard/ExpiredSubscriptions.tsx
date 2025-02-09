import { useState } from 'react';
import { 
  Search,
  Filter,
  Clock,
  Calendar,
  AlertCircle,
  Mail,
  RefreshCw,
  Download,
  User,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { LineChart } from '../../components/charts';

// Mock data - replace with API calls
const mockSubscriptions = Array.from({ length: 50 }, (_, i) => ({
  id: `sub-${i + 1}`,
  userId: `user-${i + 1}`,
  userName: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
  userEmail: `user${i + 1}@example.com`,
  plan: ['bronze', 'silver', 'gold', 'platinum'][Math.floor(Math.random() * 4)],
  status: ['expired', 'expiring_soon'][Math.floor(Math.random() * 2)],
  expiryDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
  lastPayment: new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000)).toISOString(),
  amount: [10, 50, 100, 200][Math.floor(Math.random() * 4)],
  renewalAttempts: Math.floor(Math.random() * 3),
  reasonForExpiry: [
    'payment_failed',
    'cancelled_by_user',
    'card_expired',
    'insufficient_funds'
  ][Math.floor(Math.random() * 4)],
  autoRenewEnabled: Math.random() > 0.5
}));

const mockStats = {
  totalExpired: mockSubscriptions.filter(s => s.status === 'expired').length,
  expiringSoon: mockSubscriptions.filter(s => s.status === 'expiring_soon').length,
  averageLifetime: 180, // days
  renewalRate: 65 // percentage
};

const mockTrends = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  expired: [12, 15, 10, 8, 14, 11],
  renewed: [8, 10, 7, 6, 9, 7]
};

export default function ExpiredSubscriptions() {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedReason, setSelectedReason] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortField, setSortField] = useState<string>('expiryDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'6m' | '1y' | 'all'>('6m');

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredSubscriptions = subscriptions
    .filter(subscription => {
      const matchesSearch = 
        subscription.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPlan = selectedPlan === 'all' || subscription.plan === selectedPlan;
      const matchesReason = selectedReason === 'all' || subscription.reasonForExpiry === selectedReason;
      
      const matchesDate = 
        (!dateRange.start || new Date(subscription.expiryDate) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(subscription.expiryDate) <= new Date(dateRange.end));

      return matchesSearch && matchesPlan && matchesReason && matchesDate;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'expiryDate') {
        return (new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()) * direction;
      }
      if (sortField === 'lastPayment') {
        return (new Date(a.lastPayment).getTime() - new Date(b.lastPayment).getTime()) * direction;
      }
      return 0;
    });

  const handleExport = (format: 'csv' | 'excel') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handleRenewal = (subscriptionId: string) => {
    // Implement renewal functionality
    console.log('Renewing subscription:', subscriptionId);
  };

  const handleContactUser = (userEmail: string) => {
    // Implement contact functionality
    console.log('Contacting user:', userEmail);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expired Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage expired and soon-to-expire subscriptions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSubscriptions(mockSubscriptions)}
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
          title="Total Expired"
          value={mockStats.totalExpired}
          trend={-5}
          icon={<AlertCircle className="h-6 w-6" />}
          color="red"
        />
        <StatCard
          title="Expiring Soon"
          value={mockStats.expiringSoon}
          trend={8}
          icon={<Clock className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Average Lifetime"
          value={`${mockStats.averageLifetime} days`}
          trend={3}
          icon={<History className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Renewal Rate"
          value={`${mockStats.renewalRate}%`}
          trend={2}
          icon={<RotateCcw className="h-6 w-6" />}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Expiration Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Expiration Trend</h2>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as typeof selectedTimeframe)}
              className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="6m">Last 6 months</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
          <LineChart
            data={{
              labels: mockTrends.labels,
              datasets: [
                {
                  label: 'Expired',
                  data: mockTrends.expired,
                  borderColor: '#ef4444',
                  tension: 0.4
                },
                {
                  label: 'Renewed',
                  data: mockTrends.renewed,
                  borderColor: '#22c55e',
                  tension: 0.4
                }
              ]
            }}
          />
        </div>

        {/* Expiration Reasons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Expiration Reasons</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Payment Failed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {subscriptions.filter(s => s.reasonForExpiry === 'payment_failed').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Cancelled by User</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {subscriptions.filter(s => s.reasonForExpiry === 'cancelled_by_user').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                <span className="text-sm text-gray-600">Card Expired</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {subscriptions.filter(s => s.reasonForExpiry === 'card_expired').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-sm text-gray-600">Insufficient Funds</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {subscriptions.filter(s => s.reasonForExpiry === 'insufficient_funds').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
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
                  placeholder="Search subscriptions..."
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
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Plans</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Reasons</option>
                  <option value="payment_failed">Payment Failed</option>
                  <option value="cancelled_by_user">Cancelled by User</option>
                  <option value="card_expired">Card Expired</option>
                  <option value="insufficient_funds">Insufficient Funds</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subscriptions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('expiryDate')}
                >
                  Expiry Date
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastPayment')}
                >
                  Last Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subscription.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${subscription.plan === 'bronze' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${subscription.plan === 'silver' ? 'bg-gray-100 text-gray-800' : ''}
                      ${subscription.plan === 'gold' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${subscription.plan === 'platinum' ? 'bg-purple-100 text-purple-800' : ''}
                    `}>
                      <Tag className="mr-1 h-3 w-3" />
                      {subscription.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${subscription.status === 'expired' ? 'bg-red-100 text-red-800' : ''}
                      ${subscription.status === 'expiring_soon' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {subscription.status === 'expired' ? (
                        <XCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertTriangle className="mr-1 h-3 w-3" />
                      )}
                      {subscription.status === 'expired' ? 'Expired' : 'Expiring Soon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                      {new Date(subscription.expiryDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <CreditCard className="mr-1.5 h-4 w-4 text-gray-400" />
                      {new Date(subscription.lastPayment).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {subscription.reasonForExpiry.split('_').map(
                        word => word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRenewal(subscription.id)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleContactUser(subscription.userEmail)}
                      >
                        <Mail className="h-4 w-4" />
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
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'red' | 'yellow';
}

function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
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