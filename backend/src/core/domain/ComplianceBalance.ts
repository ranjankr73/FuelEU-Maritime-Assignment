import Big from "big.js";
import { ENERGY_FACTOR, TARGET_INTENSITY } from "../../shared/constants";
import { ValidationError } from "../../shared/errors/DomainError";

export class ComplianceBalance {
  constructor(
    public shipId: string,
    public year: number,
    public actualIntensity: number,
    public fuelConsumption: number,
    public targetIntensity: number = TARGET_INTENSITY
  ) {
    if(this.fuelConsumption <= 0) {
      throw new ValidationError("Fuel consumption must be greater than zero");
    }
  }

  energyInScopeMJ(): number {
    return this.fuelConsumption * ENERGY_FACTOR;
  }

  compute(): number {
    const energy = Big(this.fuelConsumption).times(ENERGY_FACTOR);
    const cb = Big(this.targetIntensity).minus(this.actualIntensity).times(energy);

    return Number(cb.toFixed(6));
  }

  isSurplus(): boolean {
    return this.compute() > 0;
  }

  isDeficit(): boolean {
    return this.compute() < 0;
  }

  toJSON() {
    return {
      shipId: this.shipId,
      year: this.year,
      targetIntensity: this.targetIntensity,
      actualIntensity: this.actualIntensity,
      energyInScopeMJ: this.energyInScopeMJ(),
      cb: this.compute(),
      status: this.isSurplus() ? "Surplus" : this.isDeficit() ? "Deficit" : "Neutral",
    };
  }
}
