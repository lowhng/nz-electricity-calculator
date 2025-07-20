import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import { ApplianceTable } from "./components/ApplianceTable.jsx";
import { SettingsPanel } from "./components/SettingsPanel.jsx";
import { CostSummary } from "./components/CostSummary.jsx";
import { QuickCalculator } from "./components/QuickCalculator.jsx";
import { applianceData, categories } from "./data/appliances.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  Zap,
  Calculator,
  Info,
  Settings,
  Moon,
  Sun,
  ArrowUp,
  Heart,
} from "lucide-react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import routes from "tempo-routes";
import "./App.css";

function MainApp() {
  const [electricityRate, setElectricityRate] = useState(0.25);
  const [dailyFixedRate, setDailyFixedRate] = useState(1.0);
  const [rateIncludesGST, setRateIncludesGST] = useState(false);
  const [theme, setTheme] = useState("light");
  const [usageData, setUsageData] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUsageChange = (category, applianceIndex, value) => {
    setUsageData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [applianceIndex]: parseFloat(value) || 0,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          ></div>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="relative container mx-auto px-4 py-16 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                NZ Electricity Calculator
              </h1>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Calculate Your Power Costs
            </h2>

            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-4">
              Estimate your electricity usage and costs for New Zealand
              households
            </p>
            <div className="text-center space-y-2">
              <p className="text-sm text-white/80">
                Data sourced from{" "}
                <a
                  href="https://www.consumer.org.nz/articles/appliance-running-costs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 underline transition-colors"
                >
                  Consumer NZ
                </a>
              </p>
            </div>
          </div>

          {/* Quick Calculator */}
          <div className="max-w-md mx-auto">
            <QuickCalculator
              electricityRate={electricityRate}
              onRateChange={setElectricityRate}
              dailyFixedRate={dailyFixedRate}
              onDailyFixedRateChange={setDailyFixedRate}
              rateIncludesGST={rateIncludesGST}
              onRateIncludesGSTChange={setRateIncludesGST}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Cost Summary */}
        <div className="mb-8">
          <CostSummary
            appliances={applianceData}
            electricityRate={electricityRate}
            dailyFixedRate={dailyFixedRate}
            rateIncludesGST={rateIncludesGST}
            usageData={usageData}
          />
        </div>

        {/* Info Card */}
        <Card className="mb-6 bg-muted/30 border-muted">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-primary/10 rounded-full">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  How to use this calculator:
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Enter your electricity rate (check your power bill or use
                    the NZ average of $0.25/kWh)
                  </li>
                  <li>
                    • Input usage hours or quantities for each appliance you use
                  </li>
                  <li>• See real-time cost calculations and summary above</li>
                  <li>
                    • Use this to estimate your daily, weekly, monthly, or
                    yearly power costs
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appliance Tables */}
        {categories.map((category) => (
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

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}

        {/* Scroll to Top Button (Desktop) */}
        <div className="text-center mt-8 mb-2">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-md mb-4"
          >
            <ArrowUp className="h-4 w-4" />
            Back to Top
          </button>
        </div>

        {/* Donation Button */}
        <div className="text-center mb-6">
          <a
            href="https://ko-fi.com/weihongdev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Heart className="h-4 w-4" />
            Buy me a coffee
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Data sourced from{" "}
            <a
              href="https://www.consumer.org.nz/articles/appliance-running-costs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors"
            >
              Consumer NZ
            </a>{" "}
            • Built for New Zealand households • Open source calculator
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Another product made with ❤️ by
            <a
              href="https://www.weihong.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors"
            >
              Wei Hong
            </a>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Got feedback? Contact me at{" "}
            <a
              href="mailto:hello@weihong.dev"
              className="text-primary hover:underline transition-colors"
            >
              hello@weihong.dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const tempoRoutes = import.meta.env.VITE_TEMPO ? useRoutes(routes) : null;

  if (tempoRoutes) {
    return tempoRoutes;
  }

  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
