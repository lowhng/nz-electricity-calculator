import { useState, useEffect } from 'react';
import { ApplianceTable } from './components/ApplianceTable.jsx';
import { SettingsPanel } from './components/SettingsPanel.jsx';
import { CostSummary } from './components/CostSummary.jsx';
import { applianceData, categories } from './data/appliances.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Zap, Calculator, Info } from 'lucide-react';
import './App.css';

function App() {
  const [electricityRate, setElectricityRate] = useState(0.25);
  const [theme, setTheme] = useState('light');
  const [usageData, setUsageData] = useState({});

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleUsageChange = (category, applianceIndex, value) => {
    setUsageData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [applianceIndex]: parseFloat(value) || 0
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              NZ Electricity Usage Calculator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate how much your appliances cost to run based on your electricity rate. 
            Data sourced from Consumer NZ to help you estimate your power bill.
          </p>
        </div>

        {/* Settings Panel */}
        <SettingsPanel
          electricityRate={electricityRate}
          onRateChange={setElectricityRate}
          theme={theme}
          onThemeChange={setTheme}
        />

        {/* Cost Summary */}
        <CostSummary
          appliances={applianceData}
          electricityRate={electricityRate}
          usageData={usageData}
        />

        {/* Info Card */}
        <Card className="mb-6 bg-muted/30 border-muted">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-primary/10 rounded-full">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">How to use this calculator:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Enter your electricity rate (check your power bill or use the NZ average of $0.25/kWh)</li>
                  <li>• Input usage hours or quantities for each appliance you use</li>
                  <li>• See real-time cost calculations and summary above</li>
                  <li>• Use this to estimate your daily, weekly, monthly, or yearly power costs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appliance Tables */}
        {categories.map(category => (
          <ApplianceTable
            key={category.id}
            appliances={applianceData[category.id]}
            category={category.name}
            categoryId={category.id}
            electricityRate={electricityRate}
            usageData={usageData[category.id] || {}}
            onUsageChange={(applianceIndex, value) => 
              handleUsageChange(category.id, applianceIndex, value)
            }
          />
        ))}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Data sourced from{' '}
            <a 
              href="https://www.consumer.org.nz/articles/appliance-running-costs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors"
            >
              Consumer NZ
            </a>
            {' '}• Built for New Zealand households • Open source calculator
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

