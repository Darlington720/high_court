import { useEffect, useState } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { BarChart, LineChart, DoughnutChart } from '../components/charts';
import { User, DocumentStats } from '../types';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Loader
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Mock data for when Supabase is not connected
const MOCK_STATS: DocumentStats = {
  totalDocuments: 156,
  recentUploads: 23,
  activeUsers: 45,
  documentsPerCategory: {
    'Hansards': 45,
    'Courts': 38,
    'Tribunals': 28,
    'Acts': 25,
    'Statutory': 20
  },
  uploadTrends: Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10)
    };
  }).reverse()
};

const MOCK_USER = {
  id: '1',
  email: 'demo@example.com'
};

export default function Dashboard() {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchStats() {
      if (!mounted) return;

      try {
        // Since we're skipping Supabase connection for now, use mock data
        if (mounted) {
          setStats(MOCK_STATS);
          setUser(MOCK_USER);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        if (mounted) {
          setError('An error occurred while loading the dashboard data');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // Simulate network delay for more realistic behavior
    setTimeout(fetchStats, 500);

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-red-50 p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-400 mr-2" />
              <h3 className="text-lg font-medium text-red-800">Error loading dashboard</h3>
            </div>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.email}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Here's what's happening with your documents
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Documents"
              value={stats?.totalDocuments || 0}
              icon={<FileText className="h-6 w-6" />}
              trend={10}
            />
            <StatCard
              title="Recent Uploads"
              value={stats?.recentUploads || 0}
              icon={<Calendar className="h-6 w-6" />}
              trend={5}
            />
            <StatCard
              title="Active Users"
              value={stats?.activeUsers || 0}
              icon={<Users className="h-6 w-6" />}
              trend={-2}
            />
            <StatCard
              title="Categories Used"
              value={Object.keys(stats?.documentsPerCategory || {}).length}
              icon={<TrendingUp className="h-6 w-6" />}
              trend={0}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold">Upload Trends</h2>
              <LineChart
                data={{
                  labels: stats?.uploadTrends.map(t => t.date) || [],
                  datasets: [{
                    label: 'Uploads',
                    data: stats?.uploadTrends.map(t => t.count) || [],
                    borderColor: '#2563eb',
                    tension: 0.4,
                  }]
                }}
              />
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold">Documents by Category</h2>
              <DoughnutChart
                data={{
                  labels: Object.keys(stats?.documentsPerCategory || {}),
                  datasets: [{
                    data: Object.values(stats?.documentsPerCategory || {}),
                    backgroundColor: [
                      '#2563eb',
                      '#7c3aed',
                      '#db2777',
                      '#ea580c',
                      '#65a30d'
                    ],
                  }]
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
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