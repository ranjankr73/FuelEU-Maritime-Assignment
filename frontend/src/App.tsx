import { useState } from "react";
import RoutesTab from "./adapters/ui/RoutesTab";
import CompareTab from "./adapters/ui/CompareTab";
import BankingTab from "./adapters/ui/BankingTab";

export default function App() {
  const [activeTab, setActiveTab] = useState("routes");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex gap-4 p-4 bg-white border-b">
        {["routes", "compare", "banking", "pooling"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-2 rounded-md ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === "routes" && <RoutesTab />}
        {activeTab === "compare" && <p className="p-4"><CompareTab/></p>}
        {activeTab === "banking" && <p className="p-4"><BankingTab/></p>}
        {activeTab === "pooling" && <p className="p-4">Pooling tab coming soon</p>}
      </main>
    </div>
  );
}
