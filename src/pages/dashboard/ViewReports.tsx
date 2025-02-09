import { useState } from 'react';
import { 
  BarChart as BarChartIcon,
  Download,
  Filter,
  Calendar,
  FileText,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Search,
  RefreshCw,
  PieChart,
  TrendingUp,
  UserCheck,
  FileUp,
  Share2,
  Printer,
  Mail,
  Save
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { LineChart, BarChart, DoughnutChart } from '../../components/charts';

interface ReportMetrics {
  documentAccess: {
    total: number;
    trend: number;
    byCategory: Record<string, number>;
    timeline: {
      labels: string[];
      data: number[];
    };
  };
  userActivity: {
    activeUsers: number;
    trend: number;
    byRole: Record<string, number>;
    timeline: {
      labels: string[];
      data: number[];
    };
  };
  subscriptions: {
    revenue: number;
    trend: number;
    byTier: Record<string, number>;
    timeline: {
      labels: string[];
      data: number[];
    };
  };
  downloads: {
    total: number;
    trend: number;
    byType: Record<string, number>;
    timeline: {
      labels: string[];
      data: number[];
    };
  };
}

// Mock data - replace with API calls
const mockMetrics: ReportMetrics = {
  documentAccess: {
    total: 15234,
    trend: 12,
    byCategory: {
      'Hansards': 4500,
      'Courts': 3800,
      'Acts': 2500,
      'Statutory': 2000,
      'Other': 2434
    },
    timeline: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [1200, 1500, 1800, 2100, 2400, 2700]
    }
  },
  userActivity: {
    activeUsers: 850,
    trend: 8,
    byRole: {
      'Admin': 50,
      'Subscriber': 600,
      'Guest': 200
    },
    timeline: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [500, 600, 700, 750, 800, 850]
    }
  },
  subscriptions: {
    revenue: 125000,
    trend: 15,
    byTier: {
      'Platinum': 40000,
      'Gold': 35000,
      'Silver': 30000,
      'Bronze': 20000
    },
    timeline: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [15000, 18000, 21000, 23000, 25000, 28000]
    }
  },
  downloads: {
    total: 8500,
    trend: 5,
    byType: {
      'PDF': 5000,
      'DOC': 2000,
      'DOCX': 1000,
      'TXT': 500
    },
    timeline: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [800, 1000, 1200, 1400, 1600, 1800]
    }
  }
};

export default function ViewReports() {
  const [metrics, setMetrics] = useState<ReportMetrics>(mockMetrics);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(mockMetrics);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handleEmailReport = () => {
    // Implement email report functionality
    console.log('Emailing report');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveReport = () => {
    // Implement save report functionality
    console.log('Saving report configuration');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and analyze system metrics and performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-gray-300">
            <Button
              variant="ghost"
              onClick={() => setSelectedTimeframe('7d')}
              className={`rounded-l-lg ${selectedTimeframe === '7d' ? 'bg-gray-100' : ''}`}
            >
              7D
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedTimeframe('30d')}
              className={selectedTimeframe === '30d' ? 'bg-gray-100' : ''}
            >
              30D
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedTimeframe('90d')}
              className={selectedTimeframe === '90d' ? 'bg-gray-100' : ''}
            >
              90D
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedTimeframe('1y')}
              className={`rounded-r-lg ${selectedTimeframe === '1y' ? 'bg-gray-100' : ''}`}
            >
              1Y
            </Button>
          </div>
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
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date Range
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="primary" className="w-full">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Document Access"
          value={metrics.documentAccess.total}
          trend={metrics.documentAccess.trend}
          icon={<FileText className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={metrics.userActivity.activeUsers}
          trend={metrics.userActivity.trend}
          icon={<Users className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Revenue"
          value={`$${metrics.subscriptions.revenue.toLocaleString()}`}
          trend={metrics.subscriptions.trend}
          icon={<TrendingUp className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Downloads"
          value={metrics.downloads.total}
          trend={metrics.downloads.trend}
          icon={<FileUp className="h-6 w-6" />}
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
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveReport}
            className="flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Report
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Document Access Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Document Access Trend</h2>
          <LineChart
            data={{
              labels: metrics.documentAccess.timeline.labels,
              datasets: [
                {
                  label: 'Document Access',
                  data: metrics.documentAccess.timeline.data,
                  borderColor: '#3b82f6',
                  tension: 0.4
                }
              ]
            }}
          />
        </div>

        {/* User Activity Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">User Activity Trend</h2>
          <LineChart
            data={{
              labels: metrics.userActivity.timeline.labels,
              datasets: [
                {
                  label: 'Active Users',
                  data: metrics.userActivity.timeline.data,
                  borderColor: '#22c55e',
                  tension: 0.4
                }
              ]
            }}
          />
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Revenue by Subscription Tier</h2>
          <DoughnutChart
            data={{
              labels: Object.keys(metrics.subscriptions.byTier),
              datasets: [{
                data: Object.values(metrics.subscriptions.byTier),
                backgroundColor: [
                  '#818cf8',
                  '#fbbf24',
                  '#94a3b8',
                  '#6b7280'
                ]
              }]
            }}
          />
        </div>

        {/* Downloads by Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Downloads by File Type</h2>
          <BarChart
            data={{
              labels: Object.keys(metrics.downloads.byType),
              datasets: [{
                label: 'Downloads',
                data: Object.values(metrics.downloads.byType),
                backgroundColor: '#93c5fd'
              }]
            }}
          />
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Detailed Metrics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Document Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Document Categories</h3>
              <div className="space-y-4">
                {Object.entries(metrics.documentAccess.byCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Roles */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">User Roles</h3>
              <div className="space-y-4">
                {Object.entries(metrics.userActivity.byRole).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{role}</span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* File Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">File Types</h3>
              <div className="space-y-4">
                {Object.entries(metrics.downloads.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{type}</span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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