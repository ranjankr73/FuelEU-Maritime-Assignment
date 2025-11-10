import { useState } from "react";
// Assuming the hook is available and correctly typed
import { usePooling } from "../hooks/usePooling"; 
import React from "react";

// --- TYPE DEFINITIONS START ---
interface Adjusted {
  shipId: string;
  cbBefore: number; // Carbon Balance Before Pooling (gCO₂eq)
}

interface PoolResult {
  year: number;
  poolSum: number; // Total pooled carbon (gCO₂eq)
}

interface PoolingHook {
  adjusted: Adjusted[];
  result: PoolResult | null;
  loading: boolean;
  loadAdjusted: (year: number) => void;
  handleCreatePool: (year: number, adjusted: Adjusted[]) => void;
}
// --- TYPE DEFINITIONS END ---

// Helper component for a modern loading spinner (reused from other tabs)
const Spinner: React.FC = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);


export default function PoolingTab() {
  // Explicitly cast the hook result
  const { adjusted, result, loadAdjusted, handleCreatePool, loading } = usePooling() as PoolingHook;
  const [year, setYear] = useState<number>(new Date().getFullYear() + 1); // Default to next year

  // --- Early Exit States (Styled) ---
  if (loading && adjusted.length === 0 && !result) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-blue-600">
        <Spinner />
        <p className="text-xl font-medium">Loading pooling dashboard...</p>
      </div>
    );
  }

  // Calculate the total carbon balance before pooling
  const totalCbBefore = adjusted.reduce((sum, item) => sum + item.cbBefore, 0);

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight border-b border-gray-300 pb-4">
        Carbon Pooling & Compliance
      </h2>

      {/* --- Load Controls Card --- */}
      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Select Pooling Year
        </h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <input
            type="number"
            value={year}
            min={2024}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full sm:w-auto p-3 border-2 border-gray-300 rounded-lg shadow-inner
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            aria-label="Target Year"
          />
          <button
            onClick={() => loadAdjusted(year)}
            disabled={loading}
            className="flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-lg font-bold shadow-md
                       hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? <Spinner /> : 'Load Adjusted Carbon Balance'}
          </button>
        </div>
      </div>

      {/* --- Adjusted CB Data and Create Pool Action --- */}
      {adjusted.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Ships Eligible for Pooling ({adjusted.length})
          </h3>

          <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider rounded-tl-xl">Ship ID</th>
                  <th className="text-right p-4 text-sm font-bold text-gray-600 uppercase tracking-wider rounded-tr-xl">CB Before Pool (gCO₂eq)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {adjusted.map((m, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{m.shipId}</td>
                    <td className="p-4 font-mono text-right text-gray-800">
                        {m.cbBefore.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Table Footer for Summary */}
              <tfoot>
                <tr className="bg-gray-200 font-bold text-gray-900">
                    <td className="p-4 rounded-bl-xl">TOTAL BALANCE</td>
                    <td className="p-4 text-right rounded-br-xl">
                        {totalCbBefore.toLocaleString('en-US', { maximumFractionDigits: 0 })} gCO₂eq
                    </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button
            disabled={loading}
            onClick={() => handleCreatePool(year, adjusted)}
            className="flex items-center justify-center w-full px-6 py-4 bg-green-600 text-white font-extrabold text-lg rounded-xl shadow-xl shadow-green-300/50
                       hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.005] disabled:opacity-50"
          >
            {loading ? <Spinner /> : '🚀 Initiate Carbon Pool for Year ' + year}
          </button>
        </div>
      )}

      {/* --- Pool Result Display Card --- */}
      {result && (
        <div className="p-6 bg-green-50 border-l-4 border-green-500 text-green-900 rounded-lg shadow-xl">
          <h3 className="text-xl font-bold mb-3 flex items-center">
            <span className="mr-3 text-2xl">✅</span> Pooling Successful
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Pooling Year</p>
                <p className="text-lg font-semibold">{result.year}</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Total Pooled Balance</p>
                <p className="text-2xl font-extrabold text-green-700">
                    {result.poolSum.toLocaleString('en-US', { maximumFractionDigits: 0 })} gCO₂eq
                </p>
            </div>
          </div>
          <p className="mt-4 text-sm italic text-green-800">
            The pooled balance is now available for intra-company allocation.
          </p>
        </div>
      )}
    </div>
  );
}