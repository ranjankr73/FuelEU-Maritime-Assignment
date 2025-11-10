import type { Route } from "../../core/domain/Route";
import type { ComparisonResult } from "./ComparisonResult";

export interface ComputeComparisonResponse {
  baseline: Route;
  comparisons: ComparisonResult[];
  target: number;
}
