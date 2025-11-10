import { Route } from "./Route";
import { TARGET_INTENSITY } from "../../shared/constants";
import { ValidationError } from "../../shared/errors/DomainError";

export class Comparison {
  constructor(private baseline: Route, private candidate: Route) {
    if (!baseline.isBaseline)
      throw new ValidationError("Baseline route must be marked as baseline.");
  }

  percentDifference(): number {
    return ((this.candidate.ghgIntensity / this.baseline.ghgIntensity) - 1) * 100;
  }

  isCompliant(target: number = TARGET_INTENSITY): boolean {
    return this.candidate.ghgIntensity <= target;
  }

  isImproved(): boolean {
    return this.candidate.ghgIntensity < this.baseline.ghgIntensity;
  }

  toJSON() {
    return {
      baselineRouteId: this.baseline.routeId,
      candidateRouteId: this.candidate.routeId,
      baselineIntensity: this.baseline.ghgIntensity,
      candidateIntensity: this.candidate.ghgIntensity,
      percentDiff: this.percentDifference(),
      compliant: this.isCompliant(),
      improved: this.isImproved(),
    };
  }
}
