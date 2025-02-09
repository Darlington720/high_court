import { useState } from 'react';
import { 
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Globe,
  Lock,
  Calendar,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  Clock,
  LayoutTemplate,
  Settings,
  Save
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  visibility: 'public' | 'private';
  template: 'default' | 'full-width' | 'sidebar';
  author: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  meta: {
    description?: string;
    keywords?: string[];
    og_title?: string;
    og_description?: string;
    og_image?: string;
  };
}

// Mock data - replace with API calls
const mockPages: Page[] = [
  {
    id: 'about',
    title: 'About Us',
    slug: 'about',
    status: 'published',
    visibility: 'public',
    template: 'default',
    author: 'Admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    published_at: '2024-01-15T00:00:00Z',
    meta: {
      description: 'Learn about our mission and values',
      keywords: ['about', 'mission', 'values']
    }
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    slug: 'terms',
    status: 'published',
    visibility: 'public',
    template: 'sidebar',
    author: 'Admin',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z',
    published_at: '2024-01-16T00:00:00Z',
    meta: {
      description: 'Our terms of service and legal information'
    }
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    slug: 'privacy',
    status: 'draft',
    visibility: 'private',
    template: 'default',
    author: 'Admin',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-17T00:00:00Z',
    meta: {
      description: 'Our privacy policy and data practices'
    }
  }
];

export default function ManagePages() {
  const [pages, setPages] = useState<Page[]>(mockPages);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDeletePage = async (pageId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPages(pages.filter(page => page.id !== pageId));
      setSuccess('Page deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete page');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSavePage = async (page: Page) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPages(prev => prev.map(p => p.id === page.id ? page : p));
      setEditingPage(null);
      setSuccess('Page saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save page');
      setTimeout(() => setError(null), 3000);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || page.status === selectedStatus;
    const matchesVisibility = selectedVisibility === 'all' || page.visibility === selectedVisibility;

    return matchesSearch && matchesStatus && matchesVisibility;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage website content pages
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/dashboard/content/pages/add'}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Page
        </Button>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

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
                placeholder="Search pages..."
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
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                Visibility
              </label>
              <select
                value={selectedVisibility}
                onChange={(e) => setSelectedVisibility(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Visibilities</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          /{page.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${page.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                      ${page.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${page.status === 'archived' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {page.status === 'published' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {page.status === 'draft' && <Clock className="mr-1 h-3 w-3" />}
                      {page.status === 'archived' && <Archive className="mr-1 h-3 w-3" />}
                      {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${page.visibility === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {page.visibility === 'public' ? (
                        <Globe className="mr-1 h-3 w-3" />
                      ) : (
                        <Lock className="mr-1 h-3 w-3" />
                      )}
                      {page.visibility.charAt(0).toUpperCase() + page.visibility.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <LayoutTemplate className="mr-1.5 h-4 w-4" />
                      {page.template.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-4 w-4" />
                      {new Date(page.updated_at).toLocaleDateString()}
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
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePage(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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