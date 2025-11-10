import api from "./apiClient";
import type { IRoutes } from "../../core/ports/IRoutes";
import type { Route } from "../../core/domain/Route";
import type { ComparisonResult } from "../../shared/types/ComparisonResult";

export class RoutesApi implements IRoutes {
  async getAll(): Promise<Route[]> {
    const { data } = await api.get<{ data: Route[] }>("/routes");
    return data.data;
  }

  async setBaseline(routeId: number): Promise<Route> {
    const { data } = await api.post<{ data: Route }>(
      `/routes/${routeId}/baseline`
    );
    return data.data;
  }

  async getComparison(): Promise<{
    baseline: Route;
    comparisons: ComparisonResult[];
    target: number;
  }> {
    const { data } = await api.get<{
      baseline: Route;
      comparisons: ComparisonResult[];
      target: number;
    }>("/routes/comparison");

    return data;
  }
}
