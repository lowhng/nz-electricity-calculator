import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Calculator } from "lucide-react";

export function QuickCalculator({
  electricityRate,
  onRateChange,
  dailyFixedRate = 1.0,
  onDailyFixedRateChange,
  rateIncludesGST = false,
  onRateIncludesGSTChange,
}) {
  const [monthlyBudget, setMonthlyBudget] = useState(300);
  const [allowance, setAllowance] = useState(0);

  useEffect(() => {
    // Calculate daily kWh allowance based on monthly budget, rate, and fixed costs
    // Monthly budget is always GST inclusive
    const dailyBudget = monthlyBudget / 30;

    // If rate doesn't include GST, add 15% to the rates for calculation
    const effectiveRate = rateIncludesGST
      ? electricityRate
      : electricityRate * 1.15;
    const effectiveFixedRate = rateIncludesGST
      ? dailyFixedRate
      : dailyFixedRate * 1.15;

    const availableForVariable = Math.max(0, dailyBudget - effectiveFixedRate);
    const kWhAllowance = availableForVariable / effectiveRate;
    setAllowance(kWhAllowance);
  }, [monthlyBudget, electricityRate, dailyFixedRate, rateIncludesGST]);

  const handleRateChange = (value) => {
    const rate = parseFloat(value) || 0.25;
    onRateChange(rate);
  };

  return (
    <Card className="bg-white/30 backdrop-blur-sm border-white/20 text-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Quick Calculator</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="kwh-rate" className="text-white/90 text-sm">
              kWh Rate (cents)
            </Label>
            <Input
              id="kwh-rate"
              type="number"
              min="0"
              step="0.01"
              defaultValue={(electricityRate * 100).toFixed(2)}
              onChange={(e) => handleRateChange(e.target.value / 100)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mt-1"
              placeholder="25.00"
            />
          </div>

          <div>
            <Label htmlFor="daily-fixed-rate" className="text-white/90 text-sm">
              Daily Fixed Rate ($)
            </Label>
            <Input
              id="daily-fixed-rate"
              type="number"
              min="0"
              step="0.1"
              defaultValue={dailyFixedRate}
              onChange={(e) =>
                onDailyFixedRateChange(parseFloat(e.target.value) || 0)
              }
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mt-1"
              placeholder="1.0"
            />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="monthly-budget" className="text-white/90 text-sm">
              Monthly Budget ($, incl. GST)
            </Label>
            <Input
              id="monthly-budget"
              type="number"
              min="0"
              step="10"
              defaultValue={monthlyBudget}
              onChange={(e) =>
                setMonthlyBudget(parseFloat(e.target.value) || 0)
              }
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mt-1"
              placeholder="300"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rate-includes-gst"
              checked={rateIncludesGST}
              onCheckedChange={onRateIncludesGSTChange}
              className="border-white/30 data-[state=checked]:bg-white/30 data-[state=checked]:border-white/50"
            />
            <Label
              htmlFor="rate-includes-gst"
              className="text-white/90 text-sm"
            >
              Rate Includes GST
            </Label>
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
