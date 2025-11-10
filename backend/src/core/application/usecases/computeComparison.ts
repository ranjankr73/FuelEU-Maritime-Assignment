import { Route } from "../../domain/Route";
import { TARGET_INTENSITY } from "../../../shared/constants";
import { ComparisonResult } from "../../../shared/types/ComparisonResult";
import { EntityNotFoundError } from "../../../shared/errors/DomainError";
import { Comparison } from "../../domain/Comparison";
import { ComputeComparisonResponse } from "../../../shared/types/ComputeComparisonResponse";

export function computeComparison(baseline: Route, others: Route[]): ComputeComparisonResponse {
    if(!baseline) throw new EntityNotFoundError("Route", "baseline");
    if (!others || others.length === 0)
    throw new EntityNotFoundError("Route", "comparison routes");

    const comparisons: ComparisonResult[] = others
        .filter((r) => r.id !== baseline.id)
        .map((r) => {
            const comp = new Comparison(baseline, r);
            const percentDiff = comp.percentDifference();

            return {
                routeId: r.routeId,
                ghgIntensity: r.ghgIntensity,
                percentDiff: Number(percentDiff.toFixed(3)),
                compliant: comp.isCompliant(),
                improved: comp.isImproved(),
            };
        });

        return { baseline: baseline.toJSON(), comparisons, target: TARGET_INTENSITY };
}