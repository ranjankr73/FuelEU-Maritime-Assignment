import { useComparison } from "../hooks/useComparison";
import React from "react";

// --- TYPE DEFINITIONS START (Inferred from component logic) ---
interface RouteComparison {
  routeId: string;
  ghgIntensity: number;
  percentDiff?: number;
  compliant: boolean;
}

interface ComparisonData {
  target: number;
  baseline?: { routeId: string };
  comparisons: RouteComparison[];
}

interface ComparisonHook {
  data: ComparisonData | null;
  loading: boolean;
  error: Error | null;
}
// --- TYPE DEFINITIONS END ---


// Helper component for styled status
const CompliancePill: React.FC<{ isCompliant: boolean }> = ({ isCompliant }) => (
  <span
    className={`
      inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
      ${
        isCompliant
          ? 'bg-green-100 text-green-800 ring-1 ring-green-300'
          : 'bg-red-100 text-red-800 ring-1 ring-red-300'
      }
    `}
  >
    {isCompliant ? '✅ Compliant' : '❌ Non-Compliant'}
  </span>
);

export default function CompareTab() {
  // Explicitly cast the hook result
  const { data, loading, error } = useComparison() as ComparisonHook;

  // --- Early Exit States (Styled) ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-blue-600">
        <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">...</svg>
        <p className="text-xl font-medium">Loading route comparison data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">Data Error</h3>
        <p>Could not load comparison data. Please try again. ({error.message})</p>
      </div>
    );
  }

  if (!data || !data.comparisons) {
    return (
      <div className="p-6 text-center text-gray-500 min-h-[50vh] flex items-center justify-center">
        <p className="text-xl">No comparison data available to display.</p>
      </div>
    );
  }

  // ✅ Normalize response data
  const target = data.target ?? 0;
  const baseline = data.baseline?.routeId ?? "N/A";

  return (
    <div className="space-y-8 max-w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight border-b border-gray-300 pb-4">
        Carbon Intensity Comparison
      </h2>

      {/* --- Baseline & Target Metrics Card --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <p className="text-sm font-medium text-gray-500">Baseline Route</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{baseline}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md col-span-1 sm:col-span-2">
          <p className="text-sm font-medium text-gray-500">Regulatory Target</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">
            {target.toFixed(2)} <span className="text-base font-semibold text-gray-600">gCO₂e/MJ</span>
          </p>
        </div>
      </div>

      {/* --- Comparison Table --- */}
      <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider rounded-tl-xl">Route ID</th>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">GHG Intensity</th>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Difference vs. Baseline</th>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider rounded-tr-xl">Compliance Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.comparisons.map((c) => {
              const diffColor = (c.percentDiff ?? 0) < 0 ? 'text-green-600' : 'text-red-600';
              const isBaseline = c.routeId === baseline;
              
              return (
                <tr 
                  key={c.routeId} 
                  className={`
                    transition-colors duration-150 
                    ${isBaseline ? 'bg-blue-50/70 border-l-4 border-blue-500' : 'hover:bg-gray-50'}
                  `}
                >
                  <td className="p-4 font-semibold text-gray-900">
                    {c.routeId} {isBaseline && <span className="text-blue-500 text-xs font-normal ml-2">(Baseline)</span>}
                  </td>
                  <td className="p-4 text-gray-800 font-mono">{c.ghgIntensity.toFixed(3)}</td>
                  <td className={`p-4 font-bold ${diffColor}`}>
                    {c.percentDiff !== undefined ? `${c.percentDiff.toFixed(2)}%` : "—"}
                  </td>
                  <td className="p-4">
                    <CompliancePill isCompliant={c.compliant} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}