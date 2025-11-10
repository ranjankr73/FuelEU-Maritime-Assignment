import { useState } from "react";
import { PoolsApi } from "../../infrastructure/PoolingApi";
import { fetchAdjustedCB } from "../../../core/application/fetchAdjustedCB";
import { createPool } from "../../../core/application/createPool";
import { ComplianceApi } from "../../infrastructure/ComplianceApi";
import type { PoolMember } from "../../../shared/types/PoolMember";

export function usePooling() {
  const poolsApi = new PoolsApi();
  const complianceApi = new ComplianceApi();

  const [adjusted, setAdjusted] = useState<PoolMember[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function loadAdjusted(year: number) {
    setLoading(true);
    try {
      const data = await fetchAdjustedCB(complianceApi, year);
      setAdjusted(
        data.map((d) => ({ shipId: d.shipId, cbBefore: d.cbGco2eq }))
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePool(year: number, members: PoolMember[]) {
    setLoading(true);
    try {
      const res = await createPool(poolsApi, year, members);
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  return { adjusted, result, loading, loadAdjusted, handleCreatePool };
}
