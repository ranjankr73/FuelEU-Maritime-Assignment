import { useEffect, useState } from "react";
import { BankingApi, type BankRecord, type CBResult } from "../infrastructure/BankingApi";

const api = new BankingApi();

export default function BankingTab() {
  const [shipId, setShipId] = useState("R001");
  const [year, setYear] = useState(2024);
  const [cbData, setCbData] = useState<CBResult | null>(null);
  const [bankRecords, setBankRecords] = useState<BankRecord[]>([]);
  const [applyAmount, setApplyAmount] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCB = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await api.getComplianceCB(shipId, year);
      setCbData(data);
      const banks = await api.getBankRecords(shipId);
      setBankRecords(banks);
    } catch (err) {
      setMessage("Error fetching CB or records");
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    if (!cbData || Number(bankAmount) <= 0) return;
    try {
      await api.bankSurplus(shipId, year, Number(bankAmount));
      setMessage("✅ Surplus banked successfully!");
      await fetchCB();
    } catch {
      setMessage("❌ Error banking surplus");
    }
  };

  const handleApply = async () => {
    if (Number(applyAmount) <= 0) return;
    try {
      await api.applyBanked(shipId, year, Number(applyAmount));
      setMessage("✅ Banked surplus applied successfully!");
      await fetchCB();
    } catch {
      setMessage("❌ Error applying surplus");
    }
  };

  useEffect(() => {
    fetchCB();
  }, [shipId, year]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Banking</h2>

      {/* Ship + Year selection */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          className="border px-3 py-2 rounded"
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
          placeholder="Ship ID (R001)"
        />
        <input
          type="number"
          className="border px-3 py-2 rounded"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <button
          onClick={fetchCB}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {cbData && (
        <div className="mb-6 bg-gray-50 border p-4 rounded">
          <p><strong>Ship:</strong> {cbData.shipId}</p>
          <p><strong>Year:</strong> {cbData.year}</p>
          <p><strong>Compliance Balance:</strong> {cbData.cb_gco2eq.toFixed(2)} gCO₂eq</p>
          <p><strong>Status:</strong> {cbData.status}</p>
        </div>
      )}

      {/* Banking Actions */}
      {cbData && cbData.cb_gco2eq > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Bank Surplus</h3>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={bankAmount}
              onChange={(e) => setBankAmount(e.target.value)}
              className="border px-3 py-2 rounded w-32"
              placeholder="Amount"
            />
            <button
              onClick={handleBank}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
            >
              Bank
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Apply Banked Surplus</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={applyAmount}
            onChange={(e) => setApplyAmount(e.target.value)}
            className="border px-3 py-2 rounded w-32"
            placeholder="Amount"
          />
          <button
            onClick={handleApply}
            className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
          >
            Apply
          </button>
        </div>
      </div>

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}

      {/* Bank Records */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Banked Records</h3>
        {bankRecords.length === 0 ? (
          <p className="text-gray-500">No records found.</p>
        ) : (
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Year</th>
                <th>Amount (gCO₂eq)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bankRecords.map((r) => (
                <tr key={r.id} className="border-t text-center">
                  <td>{r.year}</td>
                  <td>{r.amount_gco2eq}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
