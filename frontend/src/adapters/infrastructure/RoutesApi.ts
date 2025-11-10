import api from "./apiClient";
import type { Route } from "../../core/domain/Route";
import type { RoutesPort } from "../../core/ports/RoutesPort";
import type { ComparisonResult } from "../../core/domain/Comparison";

export class RoutesApi implements RoutesPort {
  async getAll(): Promise<Route[]> {
    const res = await api.get("/routes");
    return res.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const res = await api.post(`/routes/${routeId}/baseline`);
    return res.data;
  }

  async getComparison(): Promise<{
    baseline: Route;
    comparisons: ComparisonResult[];
    target: number;
  }> {
    const res = await api.get("/routes/comparison");
    return res.data;
  }
}
