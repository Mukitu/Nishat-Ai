import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Globe, Bell, Shield, Palette, Save, RotateCcw, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    marketing: false,
  });
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load saved webhook URL on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('n8n_webhook_url');
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    // Save webhook URL to localStorage
    if (webhookUrl.trim()) {
      localStorage.setItem('n8n_webhook_url', webhookUrl.trim());
    } else {
      localStorage.removeItem('n8n_webhook_url');
    }
    
    // Save notifications preferences
    localStorage.setItem('notifications_prefs', JSON.stringify(notifications));
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved!', {
        description: webhookUrl ? 'n8n webhook URL configured' : 'Preferences updated',
      });
    }, 500);
  };

  const handleReset = () => {
    setWebhookUrl('');
    localStorage.removeItem('n8n_webhook_url');
    toast.info('Webhook URL cleared');
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-3xl mx-auto">
        <PageHeader
          title="Settings"
          description="Customize your dashboard experience"
        />

        <div className="space-y-8">
          {/* Appearance */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Appearance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Theme</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      'flex-1 p-4 rounded-lg border-2 transition-all',
                      theme === 'light'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'flex-1 p-4 rounded-lg border-2 transition-all',
                      theme === 'dark'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Language
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  'flex-1 p-4 rounded-lg border-2 transition-all',
                  language === 'en'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <span className="text-2xl mb-2 block">🇬🇧</span>
                <span className="text-sm font-medium">English</span>
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={cn(
                  'flex-1 p-4 rounded-lg border-2 transition-all',
                  language === 'bn'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <span className="text-2xl mb-2 block">🇧🇩</span>
                <span className="text-sm font-medium">বাংলা</span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </h3>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{key} Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive {key} notifications about your activity
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({ ...prev, [key]: !value }))
                    }
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      value ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                        value ? 'translate-x-7' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* n8n Integration */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              n8n Integration
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your n8n instance for AI-powered features. Your webhook URL is stored locally.
            </p>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/..."
              className="input-field mb-4"
            />
            <div className="flex gap-3">
              <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
            {webhookUrl && (
              <div className="mt-4 flex items-center gap-2 text-sm text-success">
                <CheckCircle className="w-4 h-4" />
                Webhook URL configured
              </div>
            )}
          </div>

          {/* Data */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Data Management
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              All your data is stored locally in your browser. No data is sent to any server except through your n8n webhooks.
            </p>
            <div className="flex gap-3">
              <button className="btn-secondary">Export Data</button>
              <button className="btn-secondary text-destructive hover:bg-destructive/10">
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
