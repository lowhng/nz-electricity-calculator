import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { TrendingUp, DollarSign, Zap } from 'lucide-react';

export function CostSummary({ appliances, electricityRate, usageData }) {
  const [totalCost, setTotalCost] = useState(0);
  const [totalPower, setTotalPower] = useState(0);
  const [activeAppliances, setActiveAppliances] = useState(0);

  useEffect(() => {
    let cost = 0;
    let power = 0;
    let active = 0;

    Object.entries(usageData).forEach(([category, categoryUsage]) => {
      appliances[category]?.forEach((appliance, index) => {
        const usage = categoryUsage?.[index] || 0;
        if (usage > 0) {
          active++;
          
          if (appliance.power) {
            const kWh = (appliance.power / 1000) * usage;
            cost += kWh * electricityRate;
            power += appliance.power * usage;
          } else {
            const baseCost = appliance.cost / 100;
            if (appliance.unit === 'day') {
              cost += baseCost * (usage / 24);
            } else if (appliance.unit === 'hour') {
              cost += baseCost * usage;
            } else {
              cost += baseCost * usage;
            }
          }
        }
      });
    });

    setTotalCost(cost);
    setTotalPower(power / 1000); // Convert to kW
    setActiveAppliances(active);
  }, [appliances, electricityRate, usageData]);

  const dailyCost = totalCost;
  const weeklyCost = totalCost * 7;
  const monthlyCost = totalCost * 30;
  const yearlyCost = totalCost * 365;

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Cost Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-4 bg-background rounded-lg border">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              ${dailyCost.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Daily</div>
          </div>
          
          <div className="text-center p-4 bg-background rounded-lg border">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">
              ${weeklyCost.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Weekly</div>
          </div>
          
          <div className="text-center p-4 bg-background rounded-lg border">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">
              ${monthlyCost.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Monthly</div>
          </div>
          
          <div className="text-center p-4 bg-background rounded-lg border">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-600">
              ${yearlyCost.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Yearly</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {totalPower.toFixed(1)} kW total power
          </Badge>
          <Badge variant="outline">
            {activeAppliances} active appliances
          </Badge>
          <Badge variant="outline">
            ${electricityRate.toFixed(3)}/kWh rate
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

