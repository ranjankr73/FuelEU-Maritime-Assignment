import type { Route } from "../domain/Route";
import type { ComparisonResult } from "../../shared/types/ComparisonResult";

export interface IRoutes {
  getAll(): Promise<Route[]>;
  setBaseline(routeId: number): Promise<Route>;
  getComparison(): Promise<{
    baseline: Route;
    comparisons: ComparisonResult[];
    target: number;
  }>;
}
