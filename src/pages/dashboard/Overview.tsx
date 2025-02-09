import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  BookOpen,
  CreditCard,
  Activity
} from 'lucide-react';
import { LineChart, DoughnutChart, BarChart } from '../../components/charts';
import { supabase } from '../../lib/supabase';
import { getUserStats } from '../../lib/users';
import { getSubscriptionStats } from '../../lib/subscriptions';
import { fetchDocuments } from '../../lib/documents';

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  documentViews: number;
  revenueGrowth: number;
  userGrowth: {
    labels: string[];
    data: number[];
  };
  documentTypes: {
    labels: string[];
    data: number[];
  };
  subscriptionRevenue: {
    labels: string[];
    data: number[];
  };
  recentActivity: {
    id: number;
    type: 'upload' | 'subscription' | 'download';
    user: string;
    document?: string;
    plan?: string;
    time: string;
  }[];
}

export default function Overview() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user stats
      const userStats = await getUserStats();

      // Get subscription stats
      const subscriptionStats = await getSubscriptionStats();

      // Get document stats
      const documents = await fetchDocuments();
      const documentCount = documents.length;
      const recentDocuments = documents.filter(d => 
        new Date(d.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;

      // Get document access logs
      const { data: accessLogs } = await supabase
        .from('document_access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Calculate document views
      const totalViews = accessLogs?.filter(log => log.action === 'view').length || 0;

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('document_access_logs')
        .select(`
          id,
          action,
          document:document_id (title),
          user:user_id (email),
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate document type distribution
      const typeDistribution = documents.reduce((acc, doc) => {
        const type = doc.metadata.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get subscription revenue data
      const { data: revenueData } = await supabase
        .from('payments')
        .select('amount, created_at')
        .order('created_at', { ascending: true })
        .limit(100);

      // Process revenue data by month
      const revenueByMonth = revenueData?.reduce((acc, payment) => {
        const month = new Date(payment.created_at).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + Number(payment.amount);
        return acc;
      }, {} as Record<string, number>) || {};

      setStats({
        totalUsers: userStats.totalUsers,
        activeSubscriptions: subscriptionStats.activeSubscriptions,
        documentViews: totalViews,
        revenueGrowth: subscriptionStats.revenueGrowth || 0,
        userGrowth: {
          labels: Object.keys(userStats.growthTrend || {}),
          data: Object.values(userStats.growthTrend || {})
        },
        documentTypes: {
          labels: Object.keys(typeDistribution),
          data: Object.values(typeDistribution)
        },
        subscriptionRevenue: {
          labels: Object.keys(revenueByMonth),
          data: Object.values(revenueByMonth)
        },
        recentActivity: recentActivity?.map(activity => ({
          id: activity.id,
          type: activity.action as any,
          user: activity.user?.email?.split('@')[0] || 'Unknown User',
          document: activity.document?.title,
          time: new Date(activity.created_at).toLocaleString()
        })) || []
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={loadDashboardData}
                  className="text-sm"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6" />}
          trend={12}
          color="blue"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon={<CreditCard className="h-6 w-6" />}
          trend={8}
          color="purple"
        />
        <StatCard
          title="Document Views"
          value={stats.documentViews}
          icon={<FileText className="h-6 w-6" />}
          trend={15}
          color="pink"
        />
        <StatCard
          title="Revenue Growth"
          value={`${stats.revenueGrowth}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={25}
          color="green"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>
          <LineChart
            data={{
              labels: stats.userGrowth.labels,
              datasets: [{
                label: 'New Users',
                data: stats.userGrowth.data,
                borderColor: '#2563eb',
                tension: 0.4
              }]
            }}
          />
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Document Distribution</h2>
          <DoughnutChart
            data={{
              labels: stats.documentTypes.labels,
              datasets: [{
                data: stats.documentTypes.data,
                backgroundColor: [
                  '#2563eb',
                  '#7c3aed',
                  '#db2777',
                  '#ea580c',
                  '#65a30d'
                ]
              }]
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Subscription Revenue</h2>
          <BarChart
            data={{
              labels: stats.subscriptionRevenue.labels,
              datasets: [{
                label: 'Revenue',
                data: stats.subscriptionRevenue.data,
                backgroundColor: '#93c5fd'
              }]
            }}
          />
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="rounded-full bg-blue-100 p-2">
                  {activity.type === 'upload' && <FileText className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'subscription' && <CreditCard className="h-4 w-4 text-purple-600" />}
                  {activity.type === 'download' && <BookOpen className="h-4 w-4 text-pink-600" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-500">
                    {activity.type === 'subscription' 
                      ? `Subscribed to ${activity.plan} plan`
                      : activity.type === 'upload'
                      ? `Uploaded ${activity.document}`
                      : `Downloaded ${activity.document}`
                    }
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: number;
  color: 'blue' | 'purple' | 'pink' | 'green';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    pink: 'bg-pink-50 text-pink-600',
    green: 'bg-green-50 text-green-600'
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

function TimeRangeSelector({ value, onChange }: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="1y">Last year</option>
      </select>
    </div>
  );
}