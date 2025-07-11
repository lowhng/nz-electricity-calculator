import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Calculator } from "lucide-react";

export function QuickCalculator({ electricityRate, onRateChange }) {
  const [dailyBudget, setDailyBudget] = useState(10);
  const [allowance, setAllowance] = useState(0);

  useEffect(() => {
    // Calculate daily kWh allowance based on budget and rate
    const kWhAllowance = dailyBudget / electricityRate;
    setAllowance(kWhAllowance);
  }, [dailyBudget, electricityRate]);

  const handleRateChange = (value) => {
    const rate = parseFloat(value) || 0.25;
    onRateChange(rate);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Quick Calculator</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="kwh-rate" className="text-white/90 text-sm">
              kWh Rate (¢)
            </Label>
            <Input
              id="kwh-rate"
              type="number"
              min="0"
              step="1"
              value={Math.round(electricityRate * 100)}
              onChange={(e) => handleRateChange(e.target.value / 100)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mt-1"
              placeholder="25"
            />
          </div>

          <div>
            <Label htmlFor="daily-budget" className="text-white/90 text-sm">
              Daily Budget ($)
            </Label>
            <Input
              id="daily-budget"
              type="number"
              min="0"
              step="1"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(parseFloat(e.target.value) || 0)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mt-1"
              placeholder="10"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/80 text-sm mb-1">Daily kWh allowance:</p>
          <p className="text-3xl font-bold text-white">
            {allowance.toFixed(1)} kWh
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
