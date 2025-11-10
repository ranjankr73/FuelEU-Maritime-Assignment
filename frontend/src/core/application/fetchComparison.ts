import type { IRoutes } from "../ports/IRoutes";
import type { ComputeComparisonResponse } from "../../shared/types/ComputeComparisonResponse";

export async function fetchComparison(repo: IRoutes): Promise<ComputeComparisonResponse> {
  return await repo.getComparison();
}
