import type { Route } from "../domain/Route";
import type { ComparisonResult } from "../domain/Comparison";

export interface RoutesPort {
  getAll(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<{
    baseline: Route;
    comparisons: ComparisonResult[];
    target: number;
  }>;
}
