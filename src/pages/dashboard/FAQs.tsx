import { useState } from 'react';
import { 
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit2,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  FileText,
  Settings,
  Users,
  CreditCard,
  Lock,
  Mail,
  Download,
  Upload,
  RefreshCw,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  helpful?: number;
  notHelpful?: number;
}

// Mock data - replace with API calls
const mockFAQs: FAQ[] = [
  // Account & Access
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address and follow the instructions sent to your inbox. For security reasons, password reset links expire after 24 hours.',
    category: 'Account & Access',
    tags: ['password', 'login', 'security'],
    lastUpdated: '2024-02-20T10:00:00Z',
    helpful: 45,
    notHelpful: 3
  },
  {
    id: '2',
    question: 'What are the different user roles available?',
    answer: 'We offer several user roles with different permissions:\n\n- Admin: Full system access\n- Subscriber: Access to subscribed content\n- Guest: Limited access to public content\n\nContact your system administrator to request role changes.',
    category: 'Account & Access',
    tags: ['roles', 'permissions', 'access'],
    lastUpdated: '2024-02-19T15:30:00Z',
    helpful: 32,
    notHelpful: 1
  },

  // Subscriptions
  {
    id: '3',
    question: 'How do I upgrade my subscription?',
    answer: 'To upgrade your subscription:\n\n1. Go to Account Settings\n2. Click on "Subscription"\n3. Choose "Upgrade Plan"\n4. Select your new plan\n5. Complete the payment process\n\nYour new benefits will be available immediately after upgrade.',
    category: 'Subscriptions',
    tags: ['upgrade', 'plans', 'payment'],
    lastUpdated: '2024-02-18T09:15:00Z',
    helpful: 28,
    notHelpful: 2
  },
  {
    id: '4',
    question: 'What payment methods do you accept?',
    answer: 'We accept the following payment methods:\n\n- Credit/Debit Cards (Visa, Mastercard)\n- Mobile Money (MTN, Airtel)\n- Bank Transfer\n\nAll payments are processed securely through our payment partners.',
    category: 'Subscriptions',
    tags: ['payment', 'billing'],
    lastUpdated: '2024-02-17T14:20:00Z',
    helpful: 35,
    notHelpful: 0
  },

  // Document Access
  {
    id: '5',
    question: 'How do I download documents?',
    answer: 'To download documents:\n\n1. Navigate to the document\n2. Click the download icon\n3. Choose your preferred format\n\nNote: Download permissions depend on your subscription level.',
    category: 'Document Access',
    tags: ['download', 'documents'],
    lastUpdated: '2024-02-16T11:45:00Z',
    helpful: 52,
    notHelpful: 4
  },
  {
    id: '6',
    question: 'What file formats are supported?',
    answer: 'We support the following file formats:\n\n- PDF\n- DOC/DOCX\n- TXT\n\nAll documents are optimized for viewing in our online reader.',
    category: 'Document Access',
    tags: ['formats', 'files'],
    lastUpdated: '2024-02-15T16:30:00Z',
    helpful: 41,
    notHelpful: 2
  },

  // Technical Support
  {
    id: '7',
    question: 'How do I report technical issues?',
    answer: 'To report technical issues:\n\n1. Click "Support" in the navigation menu\n2. Select "Report Issue"\n3. Fill out the form with details\n4. Attach screenshots if relevant\n\nOur support team typically responds within 24 hours.',
    category: 'Technical Support',
    tags: ['support', 'issues', 'help'],
    lastUpdated: '2024-02-14T13:25:00Z',
    helpful: 38,
    notHelpful: 1
  },
  {
    id: '8',
    question: 'What browsers are supported?',
    answer: 'Our platform is optimized for:\n\n- Chrome (recommended)\n- Firefox\n- Safari\n- Edge\n\nFor the best experience, use the latest version of your browser.',
    category: 'Technical Support',
    tags: ['browsers', 'compatibility'],
    lastUpdated: '2024-02-13T10:10:00Z',
    helpful: 29,
    notHelpful: 2
  }
];

const categories = [
  { name: 'Account & Access', icon: Lock },
  { name: 'Subscriptions', icon: CreditCard },
  { name: 'Document Access', icon: FileText },
  { name: 'Technical Support', icon: Settings }
];

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setExpandedFAQ(null);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setExpandedFAQ(null);
  };

  const handleVote = async (faqId: string, isHelpful: boolean) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFaqs(prev => prev.map(faq => {
        if (faq.id === faqId) {
          return {
            ...faq,
            helpful: (faq.helpful || 0) + (isHelpful ? 1 : 0),
            notHelpful: (faq.notHelpful || 0) + (isHelpful ? 0 : 1)
          };
        }
        return faq;
      }));
    } catch (err) {
      setError('Failed to record your feedback');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFAQ = async (faq: FAQ) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingFAQ) {
        setFaqs(prev => prev.map(f => f.id === faq.id ? { ...faq, lastUpdated: new Date().toISOString() } : f));
      } else {
        setFaqs(prev => [...prev, { ...faq, id: Date.now().toString(), lastUpdated: new Date().toISOString() }]);
      }

      setSuccess('FAQ saved successfully');
      setEditingFAQ(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFaqs(prev => prev.filter(f => f.id !== faqId));
      setSuccess('FAQ deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete FAQ');
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const found = categories.find(c => c.name === category);
    const Icon = found?.icon || HelpCircle;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Find answers to frequently asked questions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setFaqs(mockFAQs)}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => setEditingFAQ({
              id: '',
              question: '',
              answer: '',
              category: categories[0].name,
              tags: [],
              lastUpdated: new Date().toISOString()
            })}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </div>
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

      {/* Search and Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Categories</h2>
          <div className="space-y-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${
                selectedCategory === null
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-3" />
                <span>All Categories</span>
              </div>
              <span className="text-sm">{faqs.length}</span>
            </button>
            {categories.map((category) => {
              const count = faqs.filter(faq => faq.category === category.name).length;
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${
                    selectedCategory === category.name
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-sm">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ List */}
        <div className="md:col-span-3 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* FAQ Editor */}
          {editingFAQ && (
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h2 className="text-lg font-medium text-gray-900">
                {editingFAQ.id ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <input
                    type="text"
                    value={editingFAQ.question}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Answer
                  </label>
                  <textarea
                    value={editingFAQ.answer}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                    rows={6}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={editingFAQ.category}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, category: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingFAQ.tags.join(', ')}
                    onChange={(e) => setEditingFAQ({
                      ...editingFAQ,
                      tags: e.target.value.split(',').map(tag => tag.trim())
                    })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditingFAQ(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleSaveFAQ(editingFAQ)}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save FAQ'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* FAQs */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'No FAQs available in this category'}
                </p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow"
                >
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getCategoryIcon(faq.category)}
                        <h3 className="text-lg font-medium text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedFAQ === faq.id && (
                    <>
                      <div className="px-6 py-4 border-t border-gray-200">
                        <div className="prose prose-sm max-w-none text-gray-500">
                          {faq.answer.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">{paragraph}</p>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Last updated: {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(faq.id, true)}
                              className="text-green-600"
                            >
                              👍 {faq.helpful || 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(faq.id, false)}
                              className="text-red-600"
                            >
                              👎 {faq.notHelpful || 0}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingFAQ(faq)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFAQ(faq.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}