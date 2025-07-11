import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Calculator, Zap } from 'lucide-react';

export function ApplianceTable({ 
  appliances, 
  category, 
  categoryId, 
  electricityRate, 
  usageData, 
  onUsageChange 
}) {
  const calculateCost = (appliance, index) => {
    const hours = usageData[index] || 0;
    if (hours === 0) return 0;

    if (appliance.power) {
      // Calculate based on power consumption
      const kWh = (appliance.power / 1000) * hours;
      return kWh * electricityRate;
    } else {
      // Use the base cost and scale by usage
      const baseCost = appliance.cost / 100; // Convert cents to dollars
      if (appliance.unit === 'day') {
        return baseCost * (hours / 24);
      } else if (appliance.unit === 'hour') {
        return baseCost * hours;
      } else {
        // For units like 'load', 'bath', etc., treat hours as quantity
        return baseCost * hours;
      }
    }
  };

  const getCategoryIcon = (categoryId) => {
    const icons = {
      bathroom: '🚿',
      heating: '🔥',
      kitchen: '🍳',
      lighting: '💡',
      laundry: '👕',
      entertainment: '📺'
    };
    return icons[categoryId] || '⚡';
  };

  return (
    <Card className="mb-6 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(categoryId)}</span>
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <span>{category}</span>
          <Badge variant="secondary" className="ml-auto">
            {appliances.length} appliances
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-muted">
                <th className="text-left p-3 font-semibold text-muted-foreground">Appliance</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Power (W)</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Base Cost</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Unit</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Usage</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Your Cost</th>
              </tr>
            </thead>
            <tbody>
              {appliances.map((appliance, index) => {
                const cost = calculateCost(appliance, index);
                const isActive = (usageData[index] || 0) > 0;
                
                return (
                  <tr 
                    key={index} 
                    className={`border-b hover:bg-muted/30 transition-colors ${
                      isActive ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {isActive && <Zap className="h-4 w-4 text-primary" />}
                        <span className={isActive ? 'font-medium' : ''}>{appliance.name}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-sm">
                      {appliance.power ? (
                        <Badge variant="outline" className="font-mono">
                          {appliance.power}W
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-medium">
                        {appliance.cost >= 100 ? `$${(appliance.cost / 100).toFixed(2)}` : `${appliance.cost}c`}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className="text-xs">
                        {appliance.unit}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0"
                        className="w-24 text-center"
                        value={usageData[index] || ''}
                        onChange={(e) => onUsageChange(index, e.target.value)}
                      />
                    </td>
                    <td className="p-3">
                      <span className={`font-bold text-lg ${
                        cost > 0 ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        ${cost.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

