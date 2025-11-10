import { useEffect, useState } from "react";
import { PoolingApi, type AdjustedCB, type PoolMember, type PoolResult } from "../infrastructure/PoolingApi";

const api = new PoolingApi();

export default function PoolingTab() {
  const [year, setYear] = useState(2024);
  const [adjustedCBs, setAdjustedCBs] = useState<AdjustedCB[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [poolResult, setPoolResult] = useState<PoolResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchAdjustedCB = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await api.getAdjustedCB(year);
      setAdjustedCBs(data);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching adjusted CB data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustedCB();
  }, [year]);

  const toggleSelection = (shipId: string) => {
    setSelected((prev) => ({ ...prev, [shipId]: !prev[shipId] }));
  };

  const handleCreatePool = async () => {
    const members: PoolMember[] = adjustedCBs
      .filter((cb) => selected[cb.shipId])
      .map((cb) => ({
        shipId: cb.shipId,
        cb_before: cb.cb_gco2eq,
      }));

    const total = members.reduce((sum, m) => sum + m.cb_before, 0);
    if (members.length === 0) {
      setMessage("⚠️ Please select at least one ship.");
      return;
    }
    if (total < 0) {
      setMessage("❌ Invalid pool: total CB must be ≥ 0.");
      return;
    }

    try {
      const result = await api.createPool(year, members);
      setPoolResult(result);
      setMessage("✅ Pool created successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create pool.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pooling</h2>

      {/* Year selection */}
      <div className="flex gap-4 mb-4 items-center">
        <label className="font-medium">Year:</label>
        <input
          type="number"
          className="border px-3 py-2 rounded w-28"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <button
          onClick={fetchAdjustedCB}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {/* Adjusted CB table */}
      {loading ? (
        <p>Loading adjusted CBs...</p>
      ) : (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Select</th>
                <th>Ship ID</th>
                <th>Adjusted CB (gCO₂eq)</th>
              </tr>
            </thead>
            <tbody>
              {adjustedCBs.map((cb) => (
                <tr key={cb.shipId} className="border-t text-center">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={!!selected[cb.shipId]}
                      onChange={() => toggleSelection(cb.shipId)}
                    />
                  </td>
                  <td>{cb.shipId}</td>
                  <td
                    className={`${
                      cb.cb_gco2eq < 0 ? "text-red-600" : "text-green-600"
                    } font-medium`}
                  >
                    {cb.cb_gco2eq.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleCreatePool}
        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        Create Pool
      </button>

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}

      {/* Pool result display */}
      {poolResult && (
        <div className="mt-6 bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold mb-2">
            Pool Created (ID: {poolResult.poolId}) — Year {poolResult.year}
          </h3>
          <p>
            <strong>Total Pool CB:</strong>{" "}
            <span
              className={`${
                poolResult.poolSum < 0 ? "text-red-600" : "text-green-600"
              } font-semibold`}
            >
              {poolResult.poolSum.toFixed(2)}
            </span>
          </p>
          <table className="min-w-full mt-3 border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Ship ID</th>
                <th>Before CB</th>
                <th>After CB</th>
              </tr>
            </thead>
            <tbody>
              {poolResult.members.map((m) => (
                <tr key={m.shipId} className="border-t text-center">
                  <td>{m.shipId}</td>
                  <td>{m.cb_before.toFixed(2)}</td>
                  <td
                    className={`${
                      m.cb_after < 0 ? "text-red-600" : "text-green-600"
                    } font-medium`}
                  >
                    {m.cb_after.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
