import { useEffect, useState } from "react";
import { RoutesApi } from "../infrastructure/RoutesApi";
import type { Route } from "../../core/domain/Route";

const api = new RoutesApi();

export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAll().then((data) => {
      setRoutes(data);
      setLoading(false);
    });
  }, []);

  const handleSetBaseline = async (id: string) => {
    await api.setBaseline(id);
    alert(`Baseline set to route ${id}`);
    const refreshed = await api.getAll();
    setRoutes(refreshed);
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Routes</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Route ID</th>
            <th>Vessel Type</th>
            <th>Fuel Type</th>
            <th>Year</th>
            <th>GHG Intensity</th>
            <th>Baseline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.route_id} className="border-t">
              <td className="p-2">{r.route_id}</td>
              <td>{r.vessel_type}</td>
              <td>{r.fuel_type}</td>
              <td>{r.year}</td>
              <td>{r.ghg_intensity}</td>
              <td>{r.is_baseline ? "✅" : ""}</td>
              <td>
                <button
                  onClick={() => handleSetBaseline(r.id.toString())}
                  disabled={r.is_baseline}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  Set Baseline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
