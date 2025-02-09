import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, 
  Plus, 
  X, 
  ArrowLeft, 
  AlertCircle,
  CheckCircle,
  Info,
  Folder
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface CategoryForm {
  name: string;
  description: string;
  subcategories: string[];
  isPublic: boolean;
}

export default function AddCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    description: '',
    subcategories: [],
    isPublic: true
  });
  const [newSubcategory, setNewSubcategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Category name is required');
      }

      if (formData.subcategories.length === 0) {
        throw new Error('At least one subcategory is required');
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/documents/categories');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.trim()) return;

    // Check for duplicates
    if (formData.subcategories.includes(newSubcategory.trim())) {
      setError('Subcategory already exists');
      return;
    }

    setFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, newSubcategory.trim()]
    }));
    setNewSubcategory('');
  };

  const handleRemoveSubcategory = (subcategory: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(s => s !== subcategory)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/documents/categories')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Add New Category</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new document category with subcategories
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2">
                <FolderPlus className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Category Details</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-sm text-green-700">
                  Category created successfully! Redirecting...
                </p>
              </div>
            )}

            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the category's purpose"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Visibility
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Make this category public
                  </span>
                </label>
              </div>
            </div>

            {/* Subcategories */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subcategories
              </label>
              <div className="mt-2 space-y-4">
                {/* Add Subcategory */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter subcategory name"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSubcategory}
                    disabled={!newSubcategory.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Subcategories List */}
                <div className="space-y-2">
                  {formData.subcategories.map((subcategory) => (
                    <div
                      key={subcategory}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
                    >
                      <div className="flex items-center">
                        <Folder className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{subcategory}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubcategory(subcategory)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/documents/categories')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Category'}
              </Button>
            </div>
          </form>
        </div>

        {/* Help Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">
              Creating Categories
            </h2>
          </div>
          <div className="prose prose-sm text-gray-500">
            <p>
              Categories help organize documents in a hierarchical structure.
              Follow these guidelines when creating a new category:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Choose a clear and descriptive category name</li>
              <li>Add at least one subcategory for organization</li>
              <li>Provide a helpful description of the category's purpose</li>
              <li>Consider visibility settings for access control</li>
            </ul>
            <div className="mt-6 rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Note
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Category names must be unique and cannot be changed once documents
                      are assigned to them. Choose your category structure carefully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}