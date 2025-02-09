import { useState, useEffect } from 'react';
import { 
  CreditCard,
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
  DollarSign,
  History,
  MoreVertical,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Tag,
  User
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { LineChart } from '../../components/charts';
import { fetchSubscriptions, updateSubscription, cancelSubscription, getSubscriptionStats } from '../../lib/subscriptions';
import type { Subscription } from '../../lib/subscriptions';

// Mock data for charts
const mockActivityData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  subscriptions: [120, 150, 180, 210, 240, 270],
  revenue: [12000, 15000, 18000, 21000, 24000, 27000]
};

export default function ViewSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortField, setSortField] = useState<string>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    averageRevenue: 0,
    refundRate: 0
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const [subs, statsData] = await Promise.all([
        fetchSubscriptions(),
        getSubscriptionStats()
      ]);
      setSubscriptions(subs);
      setStats({
        totalRevenue: statsData.totalRevenue,
        activeSubscriptions: statsData.activeSubscriptions,
        averageRevenue: statsData.averageRevenue,
        refundRate: 2.5 // Mock value for refund rate
      });
    } catch (err) {
      console.error('Error loading subscriptions:', err);
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleUpdateSubscription = async (subscriptionId: string, updates: Partial<Subscription>) => {
    try {
      await updateSubscription(subscriptionId, updates);
      await loadSubscriptions(); // Reload data
    } catch (err) {
      console.error('Error updating subscription:', err);
      setError('Failed to update subscription');
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      await cancelSubscription(subscriptionId);
      await loadSubscriptions(); // Reload data
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription');
    }
  };

  const handleBulkAction = async (action: 'cancel' | 'suspend' | 'activate') => {
    if (!window.confirm(`Are you sure you want to ${action} the selected subscriptions?`)) {
      return;
    }

    try {
      for (const id of selectedSubscriptions) {
        if (action === 'cancel') {
          await cancelSubscription(id);
        } else {
          await updateSubscription(id, {
            status: action === 'activate' ? 'active' : 'suspended'
          });
        }
      }
      await loadSubscriptions(); // Reload data
      setSelectedSubscriptions([]);
    } catch (err) {
      console.error(`Error performing bulk ${action}:`, err);
      setError(`Failed to ${action} subscriptions`);
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // TODO: Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedSubscriptions(checked ? filteredSubscriptions.map(s => s.id) : []);
  };

  const handleSelectSubscription = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedSubscriptions([...selectedSubscriptions, id]);
    } else {
      setSelectedSubscriptions(selectedSubscriptions.filter(sid => sid !== id));
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = 
      subscription.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlan = selectedPlan === 'all' || subscription.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || subscription.status === selectedStatus;
    const matchesMethod = selectedMethod === 'all' || subscription.paymentMethod === selectedMethod;
    
    const matchesDate = 
      (!dateRange.start || new Date(subscription.startDate) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(subscription.endDate) <= new Date(dateRange.end));

    return matchesSearch && matchesPlan && matchesStatus && matchesMethod && matchesDate;
  }).sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'startDate') {
      return (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * direction;
    }
    if (sortField === 'amount') {
      return (a.amount - b.amount) * direction;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor user subscriptions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={loadSubscriptions}
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

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
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
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          trend={8}
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          trend={15}
          icon={<DollarSign className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Average Revenue"
          value={`$${stats.averageRevenue.toFixed(2)}`}
          trend={5}
          icon={<CreditCard className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Refund Rate"
          value={`${stats.refundRate}%`}
          trend={-2}
          icon={<History className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Subscription Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Subscription Trend</h2>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as '7d' | '30d' | '90d')}
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
                  label: 'Active Subscriptions',
                  data: mockActivityData.subscriptions,
                  borderColor: '#22c55e',
                  tension: 0.4
                }
              ]
            }}
          />
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Revenue Trend</h2>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Monthly Revenue</span>
            </div>
          </div>
          <LineChart
            data={{
              labels: mockActivityData.labels,
              datasets: [
                {
                  label: 'Revenue',
                  data: mockActivityData.revenue,
                  borderColor: '#3b82f6',
                  tension: 0.4
                }
              ]
            }}
          />
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
            <div className="flex items-center gap-4">
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Plans</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
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

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto Renewal
                </label>
                <select
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Methods</option>
                  <option value="card">Card</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedSubscriptions.length > 0 && (
          <div className="bg-blue-50 px-6 py-3 flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedSubscriptions.length} subscriptions selected
            </span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowActions(!showActions)}
                  className="flex items-center"
                >
                  Actions
                  <MoreVertical className="ml-2 h-4 w-4" />
                </Button>
                {showActions && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <button
                      onClick={() => handleBulkAction('cancel')}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Trash2 className="mr-3 h-4 w-4 text-gray-400" />
                      Cancel Selected
                    </button>
                    <button
                      onClick={() => handleBulkAction('suspend')}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <PauseCircle className="mr-3 h-4 w-4 text-gray-400" />
                      Suspend Selected
                    </button>
                    <button
                      onClick={() => handleBulkAction('activate')}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <PlayCircle className="mr-3 h-4 w-4 text-gray-400" />
                      Activate Selected
                    </button>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => handleExport('csv')}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
            </div>
          </div>
        )}

        {/* Subscriptions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSubscriptions.length === filteredSubscriptions.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
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
                  onClick={() => handleSort('startDate')}
                >
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auto Renew
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSubscriptions.includes(subscription.id)}
                      onChange={(e) => handleSelectSubscription(subscription.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
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
                      ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      ${subscription.status === 'inactive' ? 'bg-gray-100 text-gray-800' : ''}
                      ${subscription.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${subscription.status === 'expired' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {subscription.status === 'active' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {subscription.status === 'inactive' && <XCircle className="mr-1 h-3 w-3" />}
                      {subscription.status === 'suspended' && <PauseCircle className="mr-1 h-3 w-3" />}
                      {subscription.status === 'expired' && <AlertCircle className="mr-1 h-3 w-3" />}
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${subscription.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subscription.autoRenew ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <History className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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