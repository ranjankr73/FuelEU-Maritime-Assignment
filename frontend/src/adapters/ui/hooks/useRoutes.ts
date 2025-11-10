import { useEffect, useState } from "react";
import { RoutesApi } from "../../infrastructure/RoutesApi";
import { fetchRoutes } from "../../../core/application/fetchRoutes";
import { setBaseline } from "../../../core/application/setBaseline";
import type { Route } from "../../../core/domain/Route";

export function useRoutes() {
  const api = new RoutesApi();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRoutes() {
    setLoading(true);
    try {
      const data = await fetchRoutes(api);
      setRoutes(data);
    } finally {
      setLoading(false);
    }
  }

  async function markAsBaseline(id: number) {
    await setBaseline(api, id);
    await loadRoutes();
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  return { routes, loading, markAsBaseline, reload: loadRoutes };
}
