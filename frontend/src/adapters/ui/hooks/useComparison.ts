import { useEffect, useState, useCallback } from "react";
import { RoutesApi } from "../../infrastructure/RoutesApi";
import { fetchComparison } from "../../../core/application/fetchComparison";
import type { ComputeComparisonResponse } from "../../../shared/types/ComputeComparisonResponse";

export function useComparison() {
  const api = new RoutesApi();
  const [data, setData] = useState<ComputeComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 1. New state to trigger a reload
  const [refreshKey, setRefreshKey] = useState(0);

  // 2. Function to force a reload
  const reload = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchComparison(api);

        // Your existing normalization logic:
        const normalized = (result as any)?.data && (result as any)?.data.baseline ? (result as any).data : result;

        if (isMounted) {
          setData({
            baseline: normalized?.baseline ?? null,
            comparisons: normalized?.comparisons ?? [],
            target: normalized?.target ?? 0,
          });
        }
      } catch(err: any) {
        if(isMounted) setError(err);
      } finally {
        if(isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    }
  // 3. Include refreshKey in dependencies
  // Now, useEffect runs on mount (0) and whenever reload() is called.
  }, [refreshKey]); 

  // 4. Expose the reload function
  return { data, loading, error, reload };
}