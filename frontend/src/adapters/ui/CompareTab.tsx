import { useEffect, useState } from "react";
import { RoutesApi } from "../infrastructure/RoutesApi";
import type { ComparisonResult } from "../../core/domain/Comparison";
import type { Route } from "../../core/domain/Route";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const api = new RoutesApi();

export default function CompareTab() {
  const [baseline, setBaseline] = useState<Route | null>(null);
  const [comparisons, setComparisons] = useState<ComparisonResult[]>([]);
  const [target, setTarget] = useState<number>(89.3368);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getComparison();
        setBaseline(data.baseline);
        setComparisons(data.comparisons);
        setTarget(data.target);
      } catch (err) {
        console.error("Error fetching comparison:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading comparison data...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Compare Routes</h2>

      {baseline && (
        <div className="mb-4 text-gray-700">
          <p>
            <span className="font-semibold">Baseline:</span> {baseline.route_id} —{" "}
            {baseline.ghg_intensity.toFixed(2)} gCO₂e/MJ
          </p>
          <p>
            <span className="font-semibold">Target:</span> {target.toFixed(2)} gCO₂e/MJ
          </p>
        </div>
      )}

      {/* --- Table --- */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Route ID</th>
              <th>GHG Intensity (gCO₂e/MJ)</th>
              <th>% Diff vs Baseline</th>
              <th>Compliant</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c) => (
              <tr key={c.route_id} className="border-t text-center">
                <td className="p-2">{c.route_id}</td>
                <td>{c.ghg_intensity.toFixed(2)}</td>
                <td
                  className={`${
                    c.percent_diff < 0 ? "text-green-600" : "text-red-600"
                  } font-medium`}
                >
                  {c.percent_diff.toFixed(2)}%
                </td>
                <td>{c.compliant ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Chart --- */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">GHG Intensity Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={comparisons}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="routeId" />
            <YAxis domain={[80, 100]} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={target} label="Target" stroke="blue" strokeDasharray="3 3" />
            <Bar dataKey="ghgIntensity" name="GHG Intensity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
