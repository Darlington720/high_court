import { useState } from 'react';
import { 
  Shield,
  Lock,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Users
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isDefault?: boolean;
  isSystem?: boolean;
}

// Mock data - replace with API calls
const mockPermissions: Permission[] = [
  // Document Permissions
  { id: 'doc_view', name: 'View Documents', description: 'Can view documents', category: 'Documents' },
  { id: 'doc_create', name: 'Create Documents', description: 'Can create new documents', category: 'Documents' },
  { id: 'doc_edit', name: 'Edit Documents', description: 'Can edit existing documents', category: 'Documents' },
  { id: 'doc_delete', name: 'Delete Documents', description: 'Can delete documents', category: 'Documents' },
  { id: 'doc_download', name: 'Download Documents', description: 'Can download documents', category: 'Documents' },
  
  // User Management
  { id: 'user_view', name: 'View Users', description: 'Can view user list', category: 'User Management' },
  { id: 'user_create', name: 'Create Users', description: 'Can create new users', category: 'User Management' },
  { id: 'user_edit', name: 'Edit Users', description: 'Can edit user profiles', category: 'User Management' },
  { id: 'user_delete', name: 'Delete Users', description: 'Can delete users', category: 'User Management' },
  
  // Subscription Management
  { id: 'sub_view', name: 'View Subscriptions', description: 'Can view subscriptions', category: 'Subscriptions' },
  { id: 'sub_create', name: 'Create Subscriptions', description: 'Can create subscriptions', category: 'Subscriptions' },
  { id: 'sub_edit', name: 'Edit Subscriptions', description: 'Can modify subscriptions', category: 'Subscriptions' },
  { id: 'sub_cancel', name: 'Cancel Subscriptions', description: 'Can cancel subscriptions', category: 'Subscriptions' },
  
  // System Settings
  { id: 'settings_view', name: 'View Settings', description: 'Can view system settings', category: 'Settings' },
  { id: 'settings_edit', name: 'Edit Settings', description: 'Can modify system settings', category: 'Settings' }
];

const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: mockPermissions.map(p => p.id),
    userCount: 5,
    isSystem: true
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage users and content',
    permissions: ['doc_view', 'doc_create', 'doc_edit', 'user_view', 'user_edit', 'sub_view'],
    userCount: 12
  },
  {
    id: 'subscriber',
    name: 'Subscriber',
    description: 'Standard user with basic access',
    permissions: ['doc_view', 'doc_download'],
    userCount: 156,
    isDefault: true
  },
  {
    id: 'guest',
    name: 'Guest',
    description: 'Limited access to public content',
    permissions: ['doc_view'],
    userCount: 243,
    isSystem: true
  }
];

export default function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [permissions] = useState<Permission[]>(mockPermissions);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showNewRoleForm, setShowNewRoleForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role });
    setShowNewRoleForm(false);
  };

  const handleNewRole = () => {
    setEditingRole({
      id: '',
      name: '',
      description: '',
      permissions: [],
      userCount: 0
    });
    setShowNewRoleForm(true);
  };

  const handleSaveRole = async (role: Role) => {
    try {
      setError(null);
      
      // Validation
      if (!role.name.trim()) {
        throw new Error('Role name is required');
      }

      if (role.permissions.length === 0) {
        throw new Error('Select at least one permission');
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (showNewRoleForm) {
        // Add new role
        const newRole = {
          ...role,
          id: `role_${Date.now()}`,
          userCount: 0
        };
        setRoles([...roles, newRole]);
      } else {
        // Update existing role
        setRoles(roles.map(r => r.id === role.id ? role : r));
      }

      setSuccess('Role saved successfully');
      setEditingRole(null);
      setShowNewRoleForm(false);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save role');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      setError(null);

      const role = roles.find(r => r.id === roleId);
      if (role?.isSystem) {
        throw new Error('Cannot delete system roles');
      }

      if (role?.userCount > 0) {
        throw new Error('Cannot delete role with assigned users');
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setRoles(roles.filter(r => r.id !== roleId));
      setSuccess('Role deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role');
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    if (!editingRole) return;

    setEditingRole(prev => {
      if (!prev) return prev;

      const permissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId];

      return { ...prev, permissions };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user roles and their associated permissions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleNewRole}
          className="flex items-center"
          disabled={!!editingRole}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Role
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
        {/* Roles List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">User Roles</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {roles.map(role => (
              <li 
                key={role.id}
                className={`p-6 hover:bg-gray-50 ${
                  editingRole?.id === role.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {role.name}
                      </h3>
                      {role.isSystem && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          System
                        </span>
                      )}
                      {role.isDefault && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {role.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {role.userCount} users
                      </div>
                      <div className="flex items-center">
                        <Lock className="mr-1 h-4 w-4" />
                        {role.permissions.length} permissions
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRole(role)}
                      disabled={!!editingRole}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={!!editingRole || role.isSystem}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Role Editor */}
        {editingRole && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {showNewRoleForm ? 'Create New Role' : 'Edit Role'}
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Role Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={editingRole.description}
                    onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Describe the role's purpose"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Permissions</h3>
                <div className="space-y-6">
                  {Object.entries(
                    permissions.reduce((acc, curr) => ({
                      ...acc,
                      [curr.category]: [...(acc[curr.category] || []), curr]
                    }), {} as Record<string, Permission[]>)
                  ).map(([category, perms]) => (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {perms.map(permission => (
                          <label
                            key={permission.id}
                            className="relative flex items-start"
                          >
                            <div className="flex h-5 items-center">
                              <input
                                type="checkbox"
                                checked={editingRole.permissions.includes(permission.id)}
                                onChange={() => handleTogglePermission(permission.id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-700">
                                {permission.name}
                              </div>
                              <p className="text-xs text-gray-500">
                                {permission.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingRole(null);
                    setShowNewRoleForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSaveRole(editingRole)}
                >
                  {showNewRoleForm ? 'Create Role' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Help Card */}
        {!editingRole && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">
                About Roles & Permissions
              </h2>
            </div>
            <div className="prose prose-sm text-gray-500">
              <p>
                Roles define what users can do within the system. Each role has a set of permissions
                that determine the actions users with that role can perform.
              </p>
              <ul className="mt-4 space-y-2">
                <li>System roles cannot be modified or deleted</li>
                <li>Roles with assigned users cannot be deleted</li>
                <li>Each user must have at least one role</li>
                <li>The default role is automatically assigned to new users</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}