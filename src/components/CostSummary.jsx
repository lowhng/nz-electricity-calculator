import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { TrendingUp, DollarSign, Zap, CheckCircle } from "lucide-react";

export function CostSummary({
  appliances,
  electricityRate,
  dailyFixedRate = 1.0,
  rateIncludesGST = false,
  usageData,
}) {
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

          // Use effective rate based on GST setting
          const effectiveRate = rateIncludesGST
            ? electricityRate
            : electricityRate * 1.15;

          if (appliance.power) {
            let hours = usage;
            // Convert usage to hours based on unit
            if (appliance.unit === "day") {
              hours = usage * 24; // 1 day = 24 hours
            } else if (appliance.unit === "8 hours") {
              hours = usage * 8; // 8 hours per usage
            } else if (appliance.unit === "30 minutes") {
              hours = usage * 0.5; // 30 minutes = 0.5 hours
            }
            const kWh = (appliance.power / 1000) * hours;
            let dailyCost = kWh * effectiveRate;
            let dailyPower = appliance.power * hours;

            // For laundry items, convert weekly usage to daily
            if (category === "laundry") {
              dailyCost = dailyCost / 7;
              dailyPower = dailyPower / 7;
            }

            cost += dailyCost;
            power += dailyPower;
          } else {
            // For appliances without power rating, reverse engineer kWh from cost
            const baseCost = (appliance.cost / 100) * (effectiveRate / 0.25); // Scale based on rate vs default 0.25
            let applCost = baseCost * usage;

            // For laundry items, convert weekly usage to daily
            if (category === "laundry") {
              applCost = applCost / 7;
            }

            cost += applCost;

            // Reverse engineer kWh: cost = kWh * effectiveRate, so kWh = cost / effectiveRate
            const kWhPerUnit = baseCost / effectiveRate;
            let totalKWh = kWhPerUnit * usage;

            // For laundry items, convert weekly usage to daily
            if (category === "laundry") {
              totalKWh = totalKWh / 7;
            }

            power += totalKWh * 1000; // Convert kWh to Wh for consistency
          }
        }
      });
    });

    // Add daily fixed rate to the cost (with GST if rate doesn't include it)
    const effectiveFixedRate = rateIncludesGST
      ? dailyFixedRate
      : dailyFixedRate * 1.15;
    const variableCost = cost;
    const totalDailyCost = variableCost + effectiveFixedRate;

    setTotalCost(totalDailyCost);
    setTotalPower(power / 1000); // Convert to kW
    setActiveAppliances(active);
  }, [appliances, electricityRate, dailyFixedRate, rateIncludesGST, usageData]);

  const dailyCost = totalCost;
  const weeklyCost = totalCost * 7;
  const monthlyCost = totalCost * 30; // Keep 30 days for monthly calculation
  const yearlyCost = totalCost * 365;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Selected */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800">
        <CardContent className="py-2 px-4 md:p-6 md:text-center">
          <div className="flex items-center gap-3 md:flex-col md:gap-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center md:mx-auto md:mb-3 flex-shrink-0">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex-1 md:flex-none">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                Total Selected
              </div>
              <div className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">
                {activeAppliances}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Power */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-orange-200 dark:from-yellow-950/50 dark:to-orange-900/50 dark:border-orange-800">
        <CardContent className="py-2 px-4 md:p-6 md:text-center">
          <div className="flex items-center gap-3 md:flex-col md:gap-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center md:mx-auto md:mb-3 flex-shrink-0">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex-1 md:flex-none">
              <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">
                Total Power per day
              </div>
              <div className="text-xl md:text-2xl font-bold text-orange-700 dark:text-orange-300">
                {totalPower.toFixed(1)} kWh
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Cost */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 dark:from-green-950/50 dark:to-emerald-900/50 dark:border-green-800">
        <CardContent className="py-2 px-4 md:p-6 md:text-center">
          <div className="flex items-center gap-3 md:flex-col md:gap-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center md:mx-auto md:mb-3 flex-shrink-0">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1 md:flex-none">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">
                Daily Cost
              </div>
              <div className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-300">
                ${dailyCost.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Est */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200 dark:from-pink-950/50 dark:to-rose-900/50 dark:border-pink-800">
        <CardContent className="py-2 px-4 md:p-6 md:text-center">
          <div className="flex items-center gap-3 md:flex-col md:gap-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-full flex items-center justify-center md:mx-auto md:mb-3 flex-shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex-1 md:flex-none">
              <div className="text-sm text-pink-600 dark:text-pink-400 mb-1">
                Monthly Est.
              </div>
              <div className="text-xl md:text-2xl font-bold text-pink-700 dark:text-pink-300">
                ${monthlyCost.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
