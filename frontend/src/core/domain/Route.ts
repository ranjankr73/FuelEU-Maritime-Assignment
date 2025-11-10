import { ENERGY_FACTOR } from "../../shared/constants";

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
  ) {}

  energyInMJ(): number {
    return this.fuelConsumption * ENERGY_FACTOR;
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
      isBaseline: this.isBaseline,
    };
  }
}
