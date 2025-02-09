import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, 
  ArrowLeft, 
  AlertCircle,
  CheckCircle,
  Info,
  Folder,
  FolderTree
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { DOCUMENT_CATEGORIES } from '../../lib/constants';

interface SubcategoryForm {
  parentCategory: string;
  name: string;
  description: string;
  isPublic: boolean;
}

export default function AddSubcategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SubcategoryForm>({
    parentCategory: '',
    name: '',
    description: '',
    isPublic: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.parentCategory) {
        throw new Error('Parent category is required');
      }

      if (!formData.name.trim()) {
        throw new Error('Subcategory name is required');
      }

      // Check if subcategory already exists in parent category
      const existingSubcategories = DOCUMENT_CATEGORIES[formData.parentCategory as keyof typeof DOCUMENT_CATEGORIES] || [];
      if (existingSubcategories.includes(formData.name.trim())) {
        throw new Error('Subcategory already exists in this category');
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/documents/categories');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subcategory');
    } finally {
      setLoading(false);
    }
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
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Add New Subcategory</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new subcategory within an existing document category
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Subcategory Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2">
                <FolderPlus className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Subcategory Details</h2>
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
                  Subcategory created successfully! Redirecting...
                </p>
              </div>
            )}

            {/* Parent Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Parent Category
              </label>
              <select
                value={formData.parentCategory}
                onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Parent Category</option>
                {Object.keys(DOCUMENT_CATEGORIES).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subcategory Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter subcategory name"
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
                placeholder="Describe the subcategory's purpose"
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
                    Make this subcategory public
                  </span>
                </label>
              </div>
            </div>

            {/* Current Subcategories */}
            {formData.parentCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Existing Subcategories
                </label>
                <div className="mt-2 space-y-2">
                  {DOCUMENT_CATEGORIES[formData.parentCategory as keyof typeof DOCUMENT_CATEGORIES]?.map((subcategory) => (
                    <div
                      key={subcategory}
                      className="flex items-center rounded-md bg-gray-50 px-3 py-2"
                    >
                      <Folder className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{subcategory}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                {loading ? 'Creating...' : 'Create Subcategory'}
              </Button>
            </div>
          </form>
        </div>

        {/* Help Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <FolderTree className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">
              Creating Subcategories
            </h2>
          </div>
          <div className="prose prose-sm text-gray-500">
            <p>
              Subcategories help further organize documents within main categories.
              Follow these guidelines when creating a new subcategory:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Select the appropriate parent category</li>
              <li>Choose a clear and descriptive subcategory name</li>
              <li>Ensure the subcategory name is unique within its parent category</li>
              <li>Provide a helpful description of the subcategory's purpose</li>
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
                      Subcategory names must be unique within their parent category and
                      cannot be changed once documents are assigned to them.
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