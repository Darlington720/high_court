import { useState } from 'react';
import { 
  Mail,
  Send,
  Settings,
  AlertCircle,
  CheckCircle,
  Save,
  RefreshCw,
  Download,
  Upload,
  FileText,
  Edit2,
  Trash2,
  Plus,
  Play
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  lastModified: string;
}

interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'none' | 'tls' | 'ssl';
  fromName: string;
  fromEmail: string;
  replyTo: string;
}

// Mock data - replace with API calls
const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Educite Virtual Library',
    body: 'Dear {{name}},\n\nWelcome to Educite Virtual Library...',
    variables: ['name', 'loginUrl'],
    lastModified: '2024-02-20T10:00:00Z'
  },
  {
    id: '2',
    name: 'Password Reset',
    subject: 'Reset Your Password',
    body: 'Hello {{name}},\n\nYou requested a password reset...',
    variables: ['name', 'resetLink'],
    lastModified: '2024-02-19T15:30:00Z'
  },
  {
    id: '3',
    name: 'Subscription Renewal',
    subject: 'Your Subscription is Due for Renewal',
    body: 'Dear {{name}},\n\nYour subscription will expire on {{expiryDate}}...',
    variables: ['name', 'expiryDate', 'renewalLink'],
    lastModified: '2024-02-18T09:15:00Z'
  }
];

const initialSMTPSettings: SMTPSettings = {
  host: 'smtp.example.com',
  port: 587,
  username: 'smtp_user',
  password: '********',
  encryption: 'tls',
  fromName: 'Educite System',
  fromEmail: 'noreply@educite.com',
  replyTo: 'support@educite.com'
};

export default function EmailConfiguration() {
  const [smtpSettings, setSmtpSettings] = useState<SMTPSettings>(initialSMTPSettings);
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('SMTP settings saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save SMTP settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('SMTP connection test successful');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to connect to SMTP server');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      setError('Please enter a test email address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Test email sent successfully');
      setTestEmail('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (template: EmailTemplate) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingTemplate) {
        setTemplates(prev => prev.map(t => 
          t.id === template.id ? { ...template, lastModified: new Date().toISOString() } : t
        ));
      } else {
        setTemplates(prev => [...prev, { 
          ...template, 
          id: Date.now().toString(),
          lastModified: new Date().toISOString()
        }]);
      }

      setSuccess('Email template saved successfully');
      setEditingTemplate(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save email template');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      setSuccess('Email template deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete email template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Configuration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure SMTP settings and manage email templates
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setTemplates(mockTemplates)}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => {/* Implement export */}}
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
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

      {/* SMTP Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">SMTP Settings</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SMTP Host
              </label>
              <input
                type="text"
                value={smtpSettings.host}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="smtp.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SMTP Port
              </label>
              <input
                type="number"
                value={smtpSettings.port}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, port: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="587"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={smtpSettings.username}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="SMTP username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={smtpSettings.password}
                  onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="SMTP password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Encryption
              </label>
              <select
                value={smtpSettings.encryption}
                onChange={(e) => setSmtpSettings({ 
                  ...smtpSettings, 
                  encryption: e.target.value as 'none' | 'tls' | 'ssl'
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From Name
              </label>
              <input
                type="text"
                value={smtpSettings.fromName}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, fromName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="System Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From Email
              </label>
              <input
                type="email"
                value={smtpSettings.fromEmail}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, fromEmail: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="noreply@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reply-To Email
              </label>
              <input
                type="email"
                value={smtpSettings.replyTo}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, replyTo: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="support@example.com"
              />
            </div>
          </div>

          {/* Test Connection */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={loading}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
            </div>

            {/* Send Test Email */}
            <div className="flex items-center gap-4">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter test email address"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                variant="outline"
                onClick={handleSendTestEmail}
                disabled={loading || !testEmail}
                className="flex items-center whitespace-nowrap"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Test Email
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Email Templates</h2>
            </div>
            <Button
              variant="outline"
              onClick={() => setEditingTemplate({
                id: '',
                name: '',
                subject: '',
                body: '',
                variables: [],
                lastModified: new Date().toISOString()
              })}
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          </div>
        </div>
        <div className="p-6">
          {editingTemplate ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Template Name
                </label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    name: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Welcome Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    subject: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Welcome to Our Platform"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Body
                </label>
                <textarea
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    body: e.target.value
                  })}
                  rows={10}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Dear {{name}},&#10;&#10;Welcome to our platform..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Variables (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingTemplate.variables.join(', ')}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    variables: e.target.value.split(',').map(v => v.trim())
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="name, loginUrl"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingTemplate(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSaveTemplate(editingTemplate)}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Template'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {template.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {template.subject}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        Last modified: {new Date(template.lastModified).toLocaleString()}
                      </span>
                      <span>
                        Variables: {template.variables.join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}