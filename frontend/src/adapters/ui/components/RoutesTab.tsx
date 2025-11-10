import { useRoutes } from "../hooks/useRoutes";

// --- TYPE DEFINITIONS START ---
interface Route {
  // CHANGED: ID is now a number to match the external hook's definition.
  id: number; 
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO₂e/MJ
  fuelConsumption: number; // tonnes or similar
  distance: number; // km or similar
  totalEmissions: number; // tonnes CO₂e
  isBaseline: boolean; // Assuming the hook also provides this status
}

interface RoutesHook {
  routes: Route[];
  loading: boolean;
  // CHANGED: The function now expects a number ID.
  markAsBaseline: (routeId: number) => void; 
}
// --- TYPE DEFINITIONS END ---

export default function RoutesTab() {
  // The type casting is now valid as the local interface matches the hook's return type structure.
  const { routes, loading, markAsBaseline } = useRoutes() as RoutesHook;

  // --- Early Exit States (Styled) ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-blue-600">
        <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-medium">Loading route data...</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 min-h-[50vh] flex items-center justify-center">
        <p className="text-xl">No routes have been registered yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight border-b border-gray-300 pb-4">
        All Registered Routes
      </h2>

      {/* --- Responsive Table Container --- */}
      <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider rounded-tl-xl">Route ID</th>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Vessel</th>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Fuel</th>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Year</th>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">GHG Intensity (gCO₂e/MJ)</th>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Fuel Cons. (t)</th>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Distance (km)</th>
              <th className="text-left p-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Total Emissions (tCO₂e)</th>
              <th className="text-center p-4 text-sm font-bold text-gray-600 uppercase tracking-wider rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {routes.map((r) => {
                const isBaseline = r.isBaseline;
                return (
                    <tr 
                        // Use the numerical ID for the key
                        key={r.id} 
                        className={`
                            transition-colors duration-150 
                            ${isBaseline ? 'bg-blue-50/70 border-l-4 border-blue-500' : 'hover:bg-gray-50'}
                        `}
                    >
                        {/* Data Cells */}
                        <td className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                            {r.routeId}
                            {isBaseline && <span className="text-blue-600 text-xs font-normal ml-2 py-0.5 px-2 bg-blue-100 rounded-full">CURRENT BASELINE</span>}
                        </td>
                        <td className="p-4 text-gray-700">{r.vesselType}</td>
                        <td className="p-4 text-gray-700">{r.fuelType}</td>
                        <td className="p-4 text-gray-700">{r.year}</td>
                        <td className="p-4 font-mono text-right">{r.ghgIntensity.toFixed(2)}</td>
                        <td className="p-4 font-mono text-right">{r.fuelConsumption.toFixed(0)}</td>
                        <td className="p-4 font-mono text-right">{r.distance.toLocaleString()}</td>
                        <td className="p-4 font-mono text-right">{r.totalEmissions.toFixed(2)}</td>

                        {/* Action Cell */}
                        <td className="p-4 text-center">
                            {isBaseline ? (
                                <span className="text-gray-500 italic text-sm">Active</span>
                            ) : (
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                    // Pass the numerical ID to the function
                                    onClick={() => markAsBaseline(r.id)}
                                >
                                    Set Baseline
                                </button>
                            )}
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