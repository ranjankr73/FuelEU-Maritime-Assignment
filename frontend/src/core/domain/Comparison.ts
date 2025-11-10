import { Route } from "./Route";
import { TARGET_INTENSITY } from "../../shared/constants";

export class Comparison {
  constructor(private baseline: Route, private candidate: Route) {}

  percentDifference(): number {
    return ((this.candidate.ghgIntensity / this.baseline.ghgIntensity) - 1) * 100;
  }

  isCompliant(): boolean {
    return this.candidate.ghgIntensity <= TARGET_INTENSITY;
  }

  isImproved(): boolean {
    return this.candidate.ghgIntensity < this.baseline.ghgIntensity;
  }
}

