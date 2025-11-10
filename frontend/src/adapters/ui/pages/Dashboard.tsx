import { useState } from "react";
import RoutesTab from "../components/RoutesTab";
import CompareTab from "../components/CompareTab";
import BankingTab from "../components/BankingTab";
import PoolingTab from "../components/PoolingTab";

const tabs = [
  { name: "Routes", icon: "🗺️" },
  { name: "Compare", icon: "⚖️" },
  { name: "Banking", icon: "🏦" },
  { name: "Pooling", icon: "🔗" },
] as const;

type TabName = (typeof tabs)[number]["name"];

export default function Dashboard() {
  const [active, setActive] = useState<TabName>("Routes");

  const renderTabContent = () => {
    switch (active) {
      case "Routes":
        return <RoutesTab />;
      case "Compare":
        return <CompareTab />;
      case "Banking":
        return <BankingTab />;
      case "Pooling":
        return <PoolingTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
        ✨ Dashboard
      </h1>

      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center space-x-1 bg-white p-2 rounded-xl shadow-lg border border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActive(tab.name)}
              className={`
                flex items-center justify-center space-x-2 px-5 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out
                ${
                  active === tab.name
                    ? "bg-blue-600 text-white shadow-md shadow-blue-300 transform scale-105" 
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50" 
                }
              `}
              aria-pressed={active === tab.name}
            >
              <span className="text-xl">{tab.icon}</span> 
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 bg-white p-8 rounded-xl shadow-2xl border border-gray-200 min-h-[70vh]">
          <div className="transition-opacity duration-500">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}