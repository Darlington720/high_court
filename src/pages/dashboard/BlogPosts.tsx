import { useState } from 'react';
import { 
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  Tag,
  User,
  MessageSquare,
  ThumbsUp,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Image as ImageIcon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft' | 'archived';
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  categories: string[];
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    readTime: number;
  };
}

// Mock data - replace with API calls
const mockPosts: BlogPost[] = Array.from({ length: 10 }, (_, i) => ({
  id: `post-${i + 1}`,
  title: ['Understanding Legal Research Methods', 'Recent Supreme Court Decisions', 'Legal Tech Trends', 'Law Practice Management'][Math.floor(Math.random() * 4)],
  slug: `post-${i + 1}`,
  excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  content: 'Full blog post content...',
  status: ['published', 'draft', 'archived'][Math.floor(Math.random() * 3)],
  author: {
    name: ['John Doe', 'Jane Smith', 'Mike Johnson'][Math.floor(Math.random() * 3)],
    email: 'author@example.com'
  },
  categories: ['Legal Research', 'Case Law', 'Legal Technology', 'Practice Management'][Math.floor(Math.random() * 4)].split(),
  tags: ['research', 'technology', 'management', 'cases'].slice(0, Math.floor(Math.random() * 4) + 1),
  featuredImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=200',
  publishedAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 100 * 24 * 60 * 60 * 1000)).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString(),
  metadata: {
    views: Math.floor(Math.random() * 10000),
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 500),
    readTime: Math.floor(Math.random() * 15) + 5
  }
}));

const categories = ['Legal Research', 'Case Law', 'Legal Technology', 'Practice Management'];
const tags = ['research', 'technology', 'management', 'cases', 'supreme-court', 'legal-tech'];

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>('publishedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectPost = (id: string, checked: boolean) => {
    setSelectedPosts(prev => 
      checked ? [...prev, id] : prev.filter(postId => postId !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedPosts(checked ? filteredPosts.map(post => post.id) : []);
  };

  const handleBulkAction = (action: 'delete' | 'publish' | 'archive') => {
    // Implement bulk actions
    console.log(`Bulk ${action}:`, selectedPosts);
  };

  const handleExport = (format: 'csv' | 'excel') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || post.categories.includes(selectedCategory);
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);

      return matchesSearch && matchesStatus && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'publishedAt') {
        return (new Date(a.publishedAt || '').getTime() - new Date(b.publishedAt || '').getTime()) * direction;
      }
      if (sortField === 'views') {
        return (a.metadata.views - b.metadata.views) * direction;
      }
      return 0;
    });

  // Calculate stats
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const totalViews = posts.reduce((sum, post) => sum + post.metadata.views, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.metadata.comments, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and publish blog content
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/dashboard/content/blog/add'}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Post
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Posts"
          value={totalPosts}
          trend={8}
          icon={<FileText className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Published Posts"
          value={publishedPosts}
          trend={5}
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Total Views"
          value={totalViews}
          trend={12}
          icon={<Eye className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Total Comments"
          value={totalComments}
          trend={-3}
          icon={<MessageSquare className="h-6 w-6" />}
          color="yellow"
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
                placeholder="Search posts..."
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
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Tags</option>
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="bg-blue-50 px-6 py-3 flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedPosts.length} posts selected
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
                onClick={() => handleBulkAction('archive')}
                className="flex items-center"
              >
                <Clock className="mr-2 h-4 w-4" />
                Archive Selected
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

        {/* Posts Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === filteredPosts.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('views')}
                >
                  Engagement
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('publishedAt')}
                >
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={(e) => handleSelectPost(post.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.excerpt.substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {post.author.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${post.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                      ${post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${post.status === 'archived' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {post.status === 'published' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {post.status === 'draft' && <Clock className="mr-1 h-3 w-3" />}
                      {post.status === 'archived' && <XCircle className="mr-1 h-3 w-3" />}
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="mr-1 h-4 w-4" />
                        {post.metadata.views}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {post.metadata.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {post.metadata.comments}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="mr-1 h-4 w-4" />
                        {post.metadata.shares}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-4 w-4" />
                      {post.publishedAt 
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : 'Not published'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
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
  value: number;
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