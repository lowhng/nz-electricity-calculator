import { Input } from "@/components/ui/input.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Slider } from "@/components/ui/slider.jsx";
import { Calculator, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile.js";

export function ApplianceTable({
  appliances,
  category,
  categoryId,
  electricityRate,
  usageData,
  onUsageChange,
}) {
  const isMobile = useIsMobile();

  const getUsageLabel = (appliance) => {
    if (appliance.unit === "day") {
      // Extract the appliance type from the name for quantity-based labeling
      const applianceName = appliance.name.toLowerCase();
      if (applianceName.includes("heated towel rail")) {
        return "Number of heated towel rails";
      } else if (applianceName.includes("cupboard heater")) {
        return "Number of cupboard heaters";
      } else {
        // Generic fallback for day-unit appliances
        return `Quantity`;
      }
    } else if (appliance.unit === "8 hours") {
      // Extract the appliance type from the name for quantity-based labeling
      const applianceName = appliance.name.toLowerCase();
      if (applianceName.includes("bulb")) {
        return "Number of bulbs";
      } else if (applianceName.includes("downlight")) {
        return "Number of downlights";
      } else {
        // Generic fallback for 8-hour unit appliances
        return `Quantity`;
      }
    }
    // For laundry category, show per week
    if (categoryId === "laundry") {
      return "Usage (per week)";
    }
    return "Usage (per day)";
  };

  const getSliderProps = (appliance) => {
    if (appliance.unit === "day" || appliance.unit === "8 hours") {
      return {
        max: 5,
        min: 0,
        step: 0.5,
      };
    }
    return {
      max: 10,
      min: 0,
      step: 0.5,
    };
  };
  const calculateCost = (appliance, index) => {
    const usage = usageData[index] || 0;
    if (usage === 0) return 0;

    // For time-based units with power ratings, calculate from power consumption
    if (
      appliance.power &&
      (appliance.unit === "day" ||
        appliance.unit === "8 hours" ||
        appliance.unit === "30 minutes" ||
        appliance.unit === "hour")
    ) {
      let hours = usage;
      // Convert usage to hours based on unit
      if (appliance.unit === "day") {
        hours = usage * 24; // 1 day = 24 hours
      } else if (appliance.unit === "8 hours") {
        hours = usage * 8; // 8 hours per usage
      } else if (appliance.unit === "30 minutes") {
        hours = usage * 0.5; // 30 minutes = 0.5 hours
      } else if (appliance.unit === "hour") {
        hours = usage * 1; // 1 hour per usage
      }
      const kWh = (appliance.power / 1000) * hours;
      let dailyCost = kWh * electricityRate;

      // For laundry items, convert weekly usage to daily for consistent calculation
      if (categoryId === "laundry") {
        dailyCost = dailyCost / 7; // Convert weekly to daily
      }

      return dailyCost;
    } else {
      // For non-time-based units (boil, load, 2 cups, etc.) or appliances without power rating,
      // use the appliance's cost data scaled by usage
      const baseCost = (appliance.cost / 100) * (electricityRate / 0.25); // Scale based on rate vs default 0.25
      let cost = baseCost * usage;

      // For laundry items, convert weekly usage to daily for consistent calculation
      if (categoryId === "laundry") {
        cost = cost / 7; // Convert weekly to daily
      }

      return cost;
    }
  };

  const calculateBaseCost = (appliance) => {
    // For time-based units with power ratings, calculate from power consumption
    if (
      appliance.power &&
      (appliance.unit === "day" ||
        appliance.unit === "8 hours" ||
        appliance.unit === "30 minutes" ||
        appliance.unit === "hour")
    ) {
      let hours = 1;
      // Convert unit to hours
      if (appliance.unit === "day") {
        hours = 24; // 1 day = 24 hours
      } else if (appliance.unit === "8 hours") {
        hours = 8; // 8 hours per usage
      } else if (appliance.unit === "30 minutes") {
        hours = 0.5; // 30 minutes = 0.5 hours
      } else if (appliance.unit === "hour") {
        hours = 1; // 1 hour
      }
      const kWh = (appliance.power / 1000) * hours;
      return kWh * electricityRate;
    } else {
      // For non-time-based units (boil, load, 2 cups, etc.) or appliances without power rating,
      // use the appliance's cost data scaled by electricity rate
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
        {isMobile ? (
          // Mobile Card Layout
          <div className="space-y-4">
            {appliances.map((appliance, index) => {
              const cost = calculateCost(appliance, index);
              const isActive = (usageData[index] || 0) > 0;
              const baseCost = calculateBaseCost(appliance);

              return (
                <Card
                  key={index}
                  className={`p-4 transition-colors ${
                    isActive ? "bg-primary/5 border-primary/20" : "bg-muted/20"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Appliance Name */}
                    <div className="flex items-center gap-2">
                      {isActive && <Zap className="h-4 w-4 text-primary" />}
                      <h4
                        className={`font-medium text-sm leading-tight ${
                          isActive ? "text-primary" : ""
                        }`}
                      >
                        {appliance.name}
                      </h4>
                    </div>

                    {/* Top Row: Power, Base Cost, Unit, Your Cost */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">
                          Power
                        </span>
                        {appliance.power ? (
                          <Badge
                            variant="outline"
                            className="font-mono text-xs px-1 py-0.5"
                          >
                            {appliance.power}W
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">
                          Base Cost
                        </span>
                        <span className="font-medium text-xs">
                          {baseCost >= 1
                            ? `${baseCost.toFixed(2)}`
                            : `${Math.round(baseCost * 100)}c`}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">
                          Unit
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs px-1 py-0.5"
                        >
                          {appliance.unit}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">
                          Your Cost
                        </span>
                        <span
                          className={`font-bold text-sm ${
                            cost > 0 ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          ${cost.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Usage Slider and Input */}
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground block">
                        {getUsageLabel(appliance)}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Slider
                            value={[
                              Math.min(
                                getSliderProps(appliance).max,
                                usageData[index] ||
                                  getSliderProps(appliance).min,
                              ),
                            ]}
                            onValueChange={(value) => {
                              onUsageChange(index, value[0].toString());
                            }}
                            max={getSliderProps(appliance).max}
                            min={getSliderProps(appliance).min}
                            step={getSliderProps(appliance).step}
                            className="w-full"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder={appliance.unit === "day" ? "1" : "0"}
                            className="w-12 text-center p-1 h-7"
                            style={{ fontSize: "16px" }}
                            value={usageData[index] || ""}
                            onChange={(e) =>
                              onUsageChange(index, e.target.value)
                            }
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {appliance.unit === "day" ? "unit" : appliance.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          // Desktop Table Layout
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
                    {categoryId === "laundry"
                      ? "Usage (per week)"
                      : "Usage (per day)"}
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
                            placeholder={appliance.unit === "day" ? "1" : "0"}
                            className="w-24 text-center"
                            style={{ fontSize: "16px" }}
                            value={usageData[index] || ""}
                            onChange={(e) =>
                              onUsageChange(index, e.target.value)
                            }
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {appliance.unit === "day" ? "unit" : appliance.unit}
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
        )}
      </CardContent>
    </Card>
  );
}
