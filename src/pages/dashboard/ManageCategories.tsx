import { useState } from 'react';
import { 
  Folder,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  FolderPlus,
  FolderTree,
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { DOCUMENT_CATEGORIES } from '../../lib/constants';

interface Category {
  id: string;
  name: string;
  subcategories: string[];
  documentCount?: number;
}

// Mock data - replace with API calls
const mockCategories: Category[] = Object.entries(DOCUMENT_CATEGORIES).map(([name, subcategories], index) => ({
  id: `cat-${index + 1}`,
  name,
  subcategories,
  documentCount: Math.floor(Math.random() * 1000)
}));

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newSubcategory, setNewSubcategory] = useState('');

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
    setShowNewCategoryForm(false);
  };

  const handleNewCategory = () => {
    setEditingCategory({
      id: '',
      name: '',
      subcategories: [],
      documentCount: 0
    });
    setShowNewCategoryForm(true);
  };

  const handleSaveCategory = async () => {
    try {
      setError(null);
      
      if (!editingCategory) return;

      // Validation
      if (!editingCategory.name.trim()) {
        throw new Error('Category name is required');
      }

      if (editingCategory.subcategories.length === 0) {
        throw new Error('At least one subcategory is required');
      }

      // Check for duplicate category names
      if (showNewCategoryForm && categories.some(c => c.name === editingCategory.name)) {
        throw new Error('Category name already exists');
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (showNewCategoryForm) {
        // Add new category
        const newCategory = {
          ...editingCategory,
          id: `cat-${Date.now()}`
        };
        setCategories([...categories, newCategory]);
      } else {
        // Update existing category
        setCategories(categories.map(c => 
          c.id === editingCategory.id ? editingCategory : c
        ));
      }

      setSuccess('Category saved successfully');
      setEditingCategory(null);
      setShowNewCategoryForm(false);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setError(null);

      const category = categories.find(c => c.id === categoryId);
      if (!category) return;

      // Check if category has documents
      if (category.documentCount && category.documentCount > 0) {
        throw new Error('Cannot delete category with existing documents');
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCategories(categories.filter(c => c.id !== categoryId));
      setSuccess('Category deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleAddSubcategory = () => {
    if (!editingCategory || !newSubcategory.trim()) return;

    // Check for duplicate subcategory
    if (editingCategory.subcategories.includes(newSubcategory.trim())) {
      setError('Subcategory already exists');
      return;
    }

    setEditingCategory({
      ...editingCategory,
      subcategories: [...editingCategory.subcategories, newSubcategory.trim()]
    });
    setNewSubcategory('');
  };

  const handleRemoveSubcategory = (subcategory: string) => {
    if (!editingCategory) return;

    setEditingCategory({
      ...editingCategory,
      subcategories: editingCategory.subcategories.filter(s => s !== subcategory)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage document categories and subcategories
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleNewCategory}
          className="flex items-center"
          disabled={!!editingCategory}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Categories List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Document Categories</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {categories.map(category => (
              <li 
                key={category.id}
                className={`p-6 hover:bg-gray-50 ${
                  editingCategory?.id === category.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Folder className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category.subcategories.length} subcategories
                          {category.documentCount !== undefined && (
                            <> • {category.documentCount} documents</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {category.subcategories.map(sub => (
                        <span
                          key={sub}
                          className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                      disabled={!!editingCategory}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={!!editingCategory || (category.documentCount || 0) > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Category Editor */}
        {editingCategory && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {showNewCategoryForm ? 'Create New Category' : 'Edit Category'}
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Category Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ 
                    ...editingCategory,
                    name: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter category name"
                />
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
                      variant="outline"
                      onClick={handleAddSubcategory}
                      disabled={!newSubcategory.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Subcategories List */}
                  <div className="space-y-2">
                    {editingCategory.subcategories.map((subcategory) => (
                      <div
                        key={subcategory}
                        className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
                      >
                        <span className="text-sm text-gray-700">{subcategory}</span>
                        <button
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
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCategory(null);
                    setShowNewCategoryForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveCategory}
                >
                  {showNewCategoryForm ? 'Create Category' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Help Card */}
        {!editingCategory && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                Managing Categories
              </h2>
            </div>
            <div className="prose prose-sm text-gray-500">
              <p>
                Categories help organize documents in a hierarchical structure.
                Each category can have multiple subcategories for better organization.
              </p>
              <ul className="mt-4 space-y-2">
                <li>Categories with existing documents cannot be deleted</li>
                <li>Each category must have at least one subcategory</li>
                <li>Category and subcategory names must be unique</li>
                <li>Changes to categories affect document organization</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}