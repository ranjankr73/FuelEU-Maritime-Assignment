import { Route
 } from "../../core/domain/Route";
import { ComparisonResult } from "./ComparisonResult";

export interface ComputeComparisonResponse {
  baseline: ReturnType<Route["toJSON"]>;
  comparisons: ComparisonResult[];
  target: number;
}