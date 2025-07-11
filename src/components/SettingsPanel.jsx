import { useState } from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Settings, Sun, Moon } from 'lucide-react';

export function SettingsPanel({ electricityRate, onRateChange, theme, onThemeChange }) {
  const [tempRate, setTempRate] = useState(electricityRate);

  const handleRateUpdate = () => {
    onRateChange(parseFloat(tempRate) || 0.25);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="electricity-rate">Electricity Rate ($/kWh)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="electricity-rate"
                type="number"
                min="0"
                step="0.01"
                value={tempRate}
                onChange={(e) => setTempRate(e.target.value)}
                placeholder="0.25"
                className="flex-1"
              />
              <Button onClick={handleRateUpdate} variant="outline">
                Update
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Default: $0.25/kWh (NZ average)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label>Theme</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-2"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === 'light' ? 'Dark' : 'Light'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

