import { useState } from 'react';
import { 
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Star,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  ThumbsUp,
  Share2,
  MoreVertical,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Testimonial {
  id: string;
  author: {
    name: string;
    title: string;
    company: string;
    avatar?: string;
  };
  content: string;
  rating: number;
  status: 'published' | 'pending' | 'rejected';
  visibility: 'public' | 'private';
  featured: boolean;
  source: 'website' | 'email' | 'social';
  metadata: {
    likes: number;
    shares: number;
    views: number;
    location?: string;
    verifiedPurchase?: boolean;
  };
  createdAt: string;
  publishedAt?: string;
}

// Mock data - replace with API calls
const mockTestimonials: Testimonial[] = Array.from({ length: 10 }, (_, i) => ({
  id: `t-${i + 1}`,
  author: {
    name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
    title: ['Senior Partner', 'Legal Counsel', 'Managing Director', 'Law Professor'][Math.floor(Math.random() * 4)],
    company: ['Smith & Associates', 'Legal Corp', 'City University', 'Tech Solutions'][Math.floor(Math.random() * 4)],
    avatar: Math.random() > 0.5 ? `https://i.pravatar.cc/150?u=${i}` : undefined
  },
  content: 'Excellent legal document management system. The search functionality and organization features have greatly improved our workflow.',
  rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
  status: ['published', 'pending', 'rejected'][Math.floor(Math.random() * 3)],
  visibility: Math.random() > 0.3 ? 'public' : 'private',
  featured: Math.random() > 0.8,
  source: ['website', 'email', 'social'][Math.floor(Math.random() * 3)],
  metadata: {
    likes: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    views: Math.floor(Math.random() * 1000),
    location: ['Kampala', 'Entebbe', 'Jinja', 'Gulu'][Math.floor(Math.random() * 4)],
    verifiedPurchase: Math.random() > 0.3
  },
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
  publishedAt: Math.random() > 0.3 
    ? new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000)).toISOString()
    : undefined
}));

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTestimonials, setSelectedTestimonials] = useState<string[]>([]);

  // Calculate stats
  const totalTestimonials = testimonials.length;
  const publishedTestimonials = testimonials.filter(t => t.status === 'published').length;
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const featuredTestimonials = testimonials.filter(t => t.featured).length;

  const handleSelectTestimonial = (id: string, checked: boolean) => {
    setSelectedTestimonials(prev => 
      checked ? [...prev, id] : prev.filter(tid => tid !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedTestimonials(checked ? filteredTestimonials.map(t => t.id) : []);
  };

  const handleBulkAction = (action: 'publish' | 'reject' | 'delete') => {
    // Implement bulk actions
    console.log(`Bulk ${action}:`, selectedTestimonials);
  };

  const handleExport = (format: 'csv' | 'excel') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = 
      testimonial.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.author.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || testimonial.status === selectedStatus;
    const matchesSource = selectedSource === 'all' || testimonial.source === selectedSource;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage client testimonials and reviews
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/dashboard/content/testimonials/add'}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Testimonials"
          value={totalTestimonials}
          trend={8}
          icon={<MessageSquare className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Published"
          value={publishedTestimonials}
          trend={5}
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          suffix="/5"
          trend={2}
          icon={<Star className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Featured"
          value={featuredTestimonials}
          trend={10}
          icon={<ThumbsUp className="h-6 w-6" />}
          color="purple"
        />
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
                placeholder="Search testimonials..."
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
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="website">Website</option>
                <option value="email">Email</option>
                <option value="social">Social Media</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <select
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Testimonials List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Bulk Actions */}
        {selectedTestimonials.length > 0 && (
          <div className="bg-blue-50 px-6 py-3 flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedTestimonials.length} testimonials selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkAction('publish')}
                className="flex items-center"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Publish Selected
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction('reject')}
                className="flex items-center"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Selected
              </Button>
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

        {/* Testimonials Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTestimonials.length === filteredTestimonials.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestimonials.map((testimonial) => (
                <tr key={testimonial.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTestimonials.includes(testimonial.id)}
                      onChange={(e) => handleSelectTestimonial(testimonial.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {testimonial.author.avatar ? (
                        <img
                          src={testimonial.author.avatar}
                          alt={testimonial.author.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {testimonial.author.name}
                          {testimonial.metadata.verifiedPurchase && (
                            <CheckCircle className="inline-block ml-1 h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimonial.author.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimonial.author.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {testimonial.content}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      via {testimonial.source}
                      {testimonial.metadata.location && ` • ${testimonial.metadata.location}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${testimonial.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                        ${testimonial.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${testimonial.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {testimonial.status === 'published' && <CheckCircle className="mr-1 h-3 w-3" />}
                        {testimonial.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                        {testimonial.status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
                        {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                      </span>
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${testimonial.visibility === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        {testimonial.visibility === 'public' ? (
                          <Globe className="mr-1 h-3 w-3" />
                        ) : (
                          <Lock className="mr-1 h-3 w-3" />
                        )}
                        {testimonial.visibility.charAt(0).toUpperCase() + testimonial.visibility.slice(1)}
                      </span>
                      {testimonial.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Star className="mr-1 h-3 w-3" />
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {testimonial.metadata.likes}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="mr-1 h-4 w-4" />
                        {testimonial.metadata.shares}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-4 w-4" />
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <div className="relative">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
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
  value: number | string;
  suffix?: string;
  trend: number;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'yellow' | 'purple';
}

function StatCard({ title, value, suffix = '', trend, icon, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
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
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {value}{suffix}
        </p>
      </div>
    </div>
  );
}