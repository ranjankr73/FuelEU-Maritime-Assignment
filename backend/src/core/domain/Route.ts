import { ENERGY_FACTOR, GRAMS_PER_TONNE, MIN_YEAR, MAX_YEAR_OFFSET } from "../../shared/constants";
import { ValidationError } from "../../shared/errors/DomainError";

export class Route {
  constructor(
    public id: number,
    public routeId: string,
    public vesselType: string,
    public fuelType: string,
    public year: number,
    public ghgIntensity: number,
    public fuelConsumption: number,
    public distance: number,
    public totalEmissions: number,
    public isBaseline: boolean = false
  ) {
    this.validate();
  }

  private validate() {
    if (this.id !== undefined && this.id <= 0) throw new ValidationError("Route must have a valid ID.");
    if (this.year < MIN_YEAR || this.year > new Date().getFullYear() + MAX_YEAR_OFFSET)
      throw new ValidationError(`Invalid year: ${this.year}`);
    if (this.ghgIntensity <= 0) throw new ValidationError("GHG intensity must be positive.");
    if (this.fuelConsumption <= 0) throw new ValidationError("Fuel consumption must be positive.");
    if (this.distance <= 0) throw new ValidationError("Distance must be positive.");
  }

  energyInScopeMJ(): number {
    return this.fuelConsumption * ENERGY_FACTOR;
  }

  totalEmissionsInGrams(): number {
    return this.totalEmissions * GRAMS_PER_TONNE;
  }

  computedIntensity(): number {
    return this.totalEmissionsInGrams() / this.energyInScopeMJ();
  }

  isCompliant(targetIntensity: number): boolean {
    return this.ghgIntensity <= targetIntensity;
  }

  percentDifference(baseline: Route): number {
    if (!baseline) throw new ValidationError("Baseline route required for comparison.");
    return ((this.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
  }

  setAsBaseline(): Route {
    return new Route(
      this.id,
      this.routeId,
      this.vesselType,
      this.fuelType,
      this.year,
      this.ghgIntensity,
      this.fuelConsumption,
      this.distance,
      this.totalEmissions,
      true
    );
  }

  toJSON() {
    return {
      id: this.id,
      routeId: this.routeId,
      vesselType: this.vesselType,
      fuelType: this.fuelType,
      year: this.year,
      ghgIntensity: this.ghgIntensity,
      fuelConsumption: this.fuelConsumption,
      distance: this.distance,
      totalEmissions: this.totalEmissions,
      energyInScopeMJ: this.energyInScopeMJ(),
      isBaseline: this.isBaseline,
    };
  }
}
