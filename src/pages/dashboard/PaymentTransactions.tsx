import { useState, useEffect } from 'react';
import { 
  CreditCard,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  DollarSign,
  User,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  CreditCard as CardIcon,
  Smartphone,
  Building
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { LineChart } from '../../components/charts';
import { fetchPayments, getPaymentStats } from '../../lib/payments';
import { exportData, formatDate } from '../../lib/utils';
import type { Payment } from '../../lib/payments';

export default function PaymentTransactions() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [showActions, setShowActions] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successRate: 0,
    averageAmount: 0,
    refundRate: 0
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const [paymentsData, statsData] = await Promise.all([
        fetchPayments(),
        getPaymentStats()
      ]);
      setPayments(paymentsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading payments:', err);
      setError('Failed to load payment data');
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

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    const paymentsToExport = selectedPayments.length > 0
      ? payments.filter(p => selectedPayments.includes(p.id))
      : payments;

    const exportData = paymentsToExport.map(payment => ({
      ID: payment.id,
      User: payment.userName,
      Email: payment.userEmail,
      Amount: `$${payment.amount}`,
      Status: payment.status,
      Type: payment.type,
      'Payment Method': payment.paymentMethod,
      Date: formatDate(payment.date)
    }));

    try {
      await exportData(exportData, format, 'payment-transactions');
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedPayments(checked ? filteredPayments.map(p => p.id) : []);
  };

  const handleSelectPayment = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, id]);
    } else {
      setSelectedPayments(selectedPayments.filter(pid => pid !== id));
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesMethod = selectedMethod === 'all' || payment.paymentMethod === selectedMethod;
    
    const matchesDate = 
      (!dateRange.start || new Date(payment.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(payment.date) <= new Date(dateRange.end));

    return matchesSearch && matchesStatus && matchesMethod && matchesDate;
  }).sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'date') {
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
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
          <h1 className="text-2xl font-bold text-gray-900">Payment Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage payment transactions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={loadPayments}
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
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          trend={12}
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate.toFixed(1)}%`}
          trend={5}
          icon={<CheckCircle className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Average Amount"
          value={`$${stats.averageAmount.toFixed(2)}`}
          trend={3}
          icon={<Receipt className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Refund Rate"
          value={`${stats.refundRate.toFixed(1)}%`}
          trend={-2}
          icon={<Wallet className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Revenue Trend</h2>
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
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  label: 'Revenue',
                  data: [5000, 7500, 6000, 8000, 9500, 7000, 8500],
                  borderColor: '#3b82f6',
                  tension: 0.4
                }
              ]
            }}
          />
        </div>

        {/* Transaction Volume */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Transaction Volume</h2>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Daily Transactions</span>
            </div>
          </div>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  label: 'Transactions',
                  data: [50, 75, 60, 80, 95, 70, 85],
                  borderColor: '#22c55e',
                  tension: 0.4
                }
              ]
            }}
          />
        </div>
      </div>

      {/* Transactions List */}
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
                  placeholder="Search transactions..."
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
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Methods</option>
                  <option value="card">Card</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPayments.length === filteredPayments.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={(e) => handleSelectPayment(payment.id, e.target.checked)}
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
                        <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                        <div className="text-sm text-gray-500">{payment.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${payment.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                      ${payment.status === 'refunded' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {payment.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {payment.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                      {payment.status === 'failed' && <XCircle className="mr-1 h-3 w-3" />}
                      {payment.status === 'refunded' && <AlertCircle className="mr-1 h-3 w-3" />}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${payment.type === 'subscription' ? 'bg-blue-100 text-blue-800' : ''}
                      ${payment.type === 'one-time' ? 'bg-purple-100 text-purple-800' : ''}
                      ${payment.type === 'refund' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      {payment.paymentMethod === 'card' && (
                        <>
                          <CardIcon className="mr-1.5 h-4 w-4" />
                          <span className="capitalize">
                            {payment.metadata.cardBrand} *{payment.metadata.cardLast4}
                          </span>
                        </>
                      )}
                      {payment.paymentMethod === 'mobile_money' && (
                        <>
                          <Smartphone className="mr-1.5 h-4 w-4" />
                          <span className="capitalize">
                            {payment.metadata.provider} ({payment.metadata.mobileNumber})
                          </span>
                        </>
                      )}
                      {payment.paymentMethod === 'bank_transfer' && (
                        <>
                          <Building className="mr-1.5 h-4 w-4" />
                          <span>Bank Transfer</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                      {formatDate(payment.date)}
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
  value: string;
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