import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { SettingsSchema } from '@/types/AutomationTypes';

interface SettingsConfigurationProps {
  settingsSchema: SettingsSchema[];
  initialSettings?: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
  onClose: () => void;
}

export const SettingsConfiguration = ({ 
  settingsSchema, 
  initialSettings = {}, 
  onSettingsChange, 
  onClose 
}: SettingsConfigurationProps) => {
  const [settings, setSettings] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    settingsSchema.forEach(setting => {
      defaults[setting.id] = initialSettings[setting.id] ?? setting.default;
    });
    return defaults;
  });

  const handleSettingChange = (id: string, value: any) => {
    const updatedSettings = { ...settings, [id]: value };
    setSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  const renderSettingInput = (setting: SettingsSchema) => {
    const value = settings[setting.id];

    switch (setting.ui) {
      case 'number_input':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.id, parseFloat(e.target.value) || setting.default)}
            step={setting.type === 'number' ? '0.01' : '1'}
          />
        );

      case 'toggle':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
          />
        );

      case 'text_input':
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          />
        );

      case 'select':
        return (
          <select
            className="w-full p-2 border rounded-md"
            value={value || setting.default}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          />
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Configuration Settings
        </CardTitle>
        <CardDescription>
          Adjust these settings to customize the calculation and processing behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settingsSchema.map((setting) => (
          <div key={setting.id} className="space-y-2">
            <Label htmlFor={setting.id} className="text-sm font-medium">
              {setting.label}
            </Label>
            <div className="flex items-center gap-3">
              {renderSettingInput(setting)}
              {setting.ui === 'toggle' && (
                <span className="text-sm text-muted-foreground">
                  {settings[setting.id] ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </div>
            {setting.type === 'number' && (
              <p className="text-xs text-muted-foreground">
                Default: {setting.default}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose}>
            Apply Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};