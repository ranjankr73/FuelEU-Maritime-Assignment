import Big from "big.js";
import { TARGET_INTENSITY, ENERGY_FACTOR } from "../../shared/constants";

export class ComplianceBalance {
  constructor(
    public shipId: string,
    public year: number,
    public actualIntensity: number,
    public fuelConsumption: number
  ) {}

  energyInMJ(): number {
    return this.fuelConsumption * ENERGY_FACTOR;
  }

  compute(): number {
    const cb = Big(TARGET_INTENSITY)
      .minus(this.actualIntensity)
      .times(this.energyInMJ());
    return Number(cb.toFixed(6));
  }

  isSurplus(): boolean {
    return this.compute() > 0;
  }

  isDeficit(): boolean {
    return this.compute() < 0;
  }

  status(): "Surplus" | "Deficit" | "Neutral" {
    if (this.isSurplus()) return "Surplus";
    if (this.isDeficit()) return "Deficit";
    return "Neutral";
  }
}
