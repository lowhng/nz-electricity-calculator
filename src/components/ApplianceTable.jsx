import { Input } from "@/components/ui/input.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Calculator, Zap } from "lucide-react";

export function ApplianceTable({
  appliances,
  category,
  categoryId,
  electricityRate,
  usageData,
  onUsageChange,
}) {
  const calculateCost = (appliance, index) => {
    const usage = usageData[index] || 0;
    if (usage === 0) return 0;

    if (appliance.power) {
      // Calculate based on power consumption
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
      return kWh * electricityRate;
    } else {
      // Use the dynamic base cost and scale by usage
      const baseCost = (appliance.cost / 100) * (electricityRate / 0.25); // Scale based on rate vs default 0.25
      // For appliances without power rating, usage directly multiplies the scaled base cost
      return baseCost * usage;
    }
  };

  const calculateBaseCost = (appliance) => {
    if (appliance.power) {
      // Calculate base cost per unit based on power consumption and electricity rate
      let hours = 1;
      // Convert unit to hours
      if (appliance.unit === "day") {
        hours = 24; // 1 day = 24 hours
      } else if (appliance.unit === "8 hours") {
        hours = 8; // 8 hours per usage
      } else if (appliance.unit === "30 minutes") {
        hours = 0.5; // 30 minutes = 0.5 hours
      }
      const kWh = (appliance.power / 1000) * hours;
      return kWh * electricityRate;
    } else {
      // Return the dynamic cost for appliances without power rating, scaled by electricity rate
      const baseCost = appliance.cost / 100; // Convert cents to dollars
      return baseCost * (electricityRate / 0.25); // Scale based on rate vs default 0.25
    }
  };

  const getCategoryIcon = (categoryId) => {
    const icons = {
      bathroom: "🚿",
      heating: "🔥",
      kitchen: "🍳",
      lighting: "💡",
      laundry: "👕",
      entertainment: "📺",
    };
    return icons[categoryId] || "⚡";
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
                <th className="text-left p-3 font-semibold text-muted-foreground w-2/5">
                  Appliance
                </th>
                <th className="text-left p-3 font-semibold text-muted-foreground">
                  Power (W)
                </th>
                <th className="text-left p-3 font-semibold text-muted-foreground">
                  Base Cost
                </th>
                <th className="text-left p-3 font-semibold text-muted-foreground">
                  Unit
                </th>
                <th className="text-center p-3 font-semibold text-muted-foreground w-40">
                  Usage (per day)
                </th>
                <th className="text-left p-3 font-semibold text-muted-foreground">
                  Your Cost
                </th>
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
                      isActive ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="p-3 w-2/5">
                      <div className="flex items-center gap-2">
                        {isActive && <Zap className="h-4 w-4 text-primary" />}
                        <span className={isActive ? "font-medium" : ""}>
                          {appliance.name}
                        </span>
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
                        {(() => {
                          const baseCost = calculateBaseCost(appliance);
                          return baseCost >= 1
                            ? `${baseCost.toFixed(2)}`
                            : `${Math.round(baseCost * 100)}c`;
                        })()}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className="text-xs">
                        {appliance.unit}
                      </Badge>
                    </td>
                    <td className="p-3 w-20">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          className="w-24 text-center text-sm"
                          value={usageData[index] || ""}
                          onChange={(e) => onUsageChange(index, e.target.value)}
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {appliance.unit}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold text-lg ${
                          cost > 0 ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
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
