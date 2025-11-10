import { useState } from "react";
import { BankingApi } from "../../infrastructure/BankingApi";
import { bankSurplus } from "../../../core/application/bankSurplus";
import { applyBanked } from "../../../core/application/applyBanked";

export function useBanking() {
  const api = new BankingApi();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function parseErrorMessage(err: any): string {
    if (!err) return "An unknown error occurred.";
    const raw = err?.response?.data || err?.message || String(err);

    if (typeof raw === "string") {
      if (raw.includes("EntityNotFoundError")) return "No compliance record found for this ship and year.";
      if (raw.includes("Insufficient banked balance")) return "Insufficient banked balance. Please bank surplus before applying.";
      if (raw.includes("<html")) return "Server error: Unexpected response from backend.";
      return raw;
    }

    return raw?.message || "Something went wrong. Please try again.";
  }

  async function handleBank(shipId: string, year: number, amount: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await bankSurplus(api, shipId, year, amount);
      setResult(res);
    } catch (err: any) {
      console.error("❌ Banking error:", err);
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(shipId: string, year: number, amount: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await applyBanked(api, shipId, year, amount);
      setResult(res);
    } catch (err: any) {
      console.error("❌ Apply error:", err);
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { loading, result, error, handleBank, handleApply };
}
