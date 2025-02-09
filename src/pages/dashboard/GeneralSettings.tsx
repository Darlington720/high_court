</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Allowed File Types
                    </label>
                    <input
                      type="text"
                      value={settings.uploads.allowedTypes.join(', ')}
                      onChange={(e) => setSettings({
                        ...settings,
                        uploads: { ...settings.uploads, allowedTypes: e.target.value.split(',').map(type => type.trim()) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder=".pdf, .doc, .docx, .txt"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.uploads.compressionEnabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        uploads: { ...settings.uploads, compressionEnabled: e.target.checked }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Enable File Compression
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Database className="mr-2 h-5 w-5 text-gray-500" />
                  Backup Settings
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Backup Frequency
                    </label>
                    <select
                      value={settings.backup.backupFrequency}
                      onChange={(e) => setSettings({
                        ...settings,
                        backup: { ...settings.backup, backupFrequency: e.target.value as 'daily' | 'weekly' | 'monthly' }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Retention Period (days)
                    </label>
                    <input
                      type="number"
                      value={settings.backup.retentionDays}
                      onChange={(e) => setSettings({
                        ...settings,
                        backup: { ...settings.backup, retentionDays: parseInt(e.target.value) }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.backup.autoBackup}
                      onChange={(e) => setSettings({
                        ...settings,
                        backup: { ...settings.backup, autoBackup: e.target.checked }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Enable Automatic Backups
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.backup.includeUploads}
                      onChange={(e) => setSettings({
                        ...settings,
                        backup: { ...settings.backup, includeUploads: e.target.checked }
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Include Uploaded Files
                    </span>
                  </label>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={handleBackup}
                    disabled={backupInProgress}
                    className="flex items-center"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    {backupInProgress ? 'Creating Backup...' : 'Create Backup Now'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}