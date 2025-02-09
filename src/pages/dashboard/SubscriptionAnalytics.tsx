import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  DollarSign,
  UserPlus,
  UserMinus,
  PieChart,
  BarChart as BarChartIcon,
  Download
} from 'lucide-react';
import { LineChart, DoughnutChart, BarChart } from '../../components/charts';
import { Button } from '../../components/ui/Button';

// Mock data - replace with real data from API
const mockData = {
  overview: {
    totalRevenue: 125000,
    activeSubscriptions: 850,
    churnRate: 2.5,
    newSubscribers: 45
  },
  subscriptionsByTier: {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    data: [300, 250, 200, 100]
  },
  revenueByTier: {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    data: [15000, 35000, 45000, 30000]
  },
  monthlyTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    revenue: [20000, 25000, 30000, 35000, 40000, 45000],
    subscribers: [500, 600, 700, 750, 800, 850]
  },
  churnAnalysis: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [3.2, 2.8, 2.5, 2.3, 2.1, 2.0]
  }
};

export default function SubscriptionAnalytics() {
  const [timeRange, setTimeRange] = useState('6m');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor subscription performance and trends
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>
          </select>
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
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => handleExport('pdf')}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${mockData.overview.totalRevenue.toLocaleString()}`}
          trend={15}
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Active Subscriptions"
          value={mockData.overview.activeSubscriptions}
          trend={8}
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Churn Rate"
          value={`${mockData.overview.churnRate}%`}
          trend={-0.5}
          icon={<TrendingUp className="h-6 w-6" />}
          color="red"
        />
        <StatCard
          title="New Subscribers"
          value={mockData.overview.newSubscribers}
          trend={12}
          icon={<UserPlus className="h-6 w-6" />}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Trend */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue</h2>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Revenue Trend</span>
            </div>
          </div>
          <LineChart
            data={{
              labels: mockData.monthlyTrends.labels,
              datasets: [
                {
                  label: 'Revenue',
                  data: mockData.monthlyTrends.revenue,
                  borderColor: '#3b82f6',
                  tension: 0.4
                }
              ]
            }}
          />
        </div>

        {/* Subscription Distribution */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Subscription Distribution</h2>
            <div className="flex items-center space-x-4">
              {mockData.subscriptionsByTier.labels.map((tier, index) => (
                <div key={tier} className="flex items-center space-x-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ 
                      backgroundColor: [
                        '#3b82f6',
                        '#8b5cf6',
                        '#ec4899',
                        '#f59e0b'
                      ][index] 
                    }}
                  ></div>
                  <span className="text-sm text-gray-600">{tier}</span>
                </div>
              ))}
            </div>
          </div>
          <DoughnutChart
            data={{
              labels: mockData.subscriptionsByTier.labels,
              datasets: [{
                data: mockData.subscriptionsByTier.data,
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

        {/* Revenue by Tier */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Revenue by Tier</h2>
          <BarChart
            data={{
              labels: mockData.revenueByTier.labels,
              datasets: [{
                label: 'Revenue',
                data: mockData.revenueByTier.data,
                backgroundColor: '#93c5fd'
              }]
            }}
          />
        </div>

        {/* Churn Analysis */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Churn Rate Analysis</h2>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Churn Rate %</span>
            </div>
          </div>
          <LineChart
            data={{
              labels: mockData.churnAnalysis.labels,
              datasets: [{
                label: 'Churn Rate',
                data: mockData.churnAnalysis.data,
                borderColor: '#ef4444',
                tension: 0.4
              }]
            }}
          />
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
  color: 'green' | 'blue' | 'red' | 'purple';
}

function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
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