import { ComplianceBalance } from "../../domain/ComplianceBalance";
import { TARGET_INTENSITY } from "../../../shared/constants";
import { CBResult } from "../../../shared/types/CBResult";
import { ValidationError } from "../../../shared/errors/DomainError";

export function computeCB(shipId: string, year: number, ghgIntensity: number, fuelConsumption: number): CBResult {

    if (!shipId) throw new ValidationError("shipId is required.");
  if (!year) throw new ValidationError("year is required.");
  if (ghgIntensity <= 0) throw new ValidationError("Invalid GHG intensity.");
  if (fuelConsumption <= 0) throw new ValidationError("Fuel consumption must be positive.");

    const cbEntity = new ComplianceBalance(shipId, year, ghgIntensity, fuelConsumption);
    const cb = cbEntity.compute();

    return {
        cb,
        status: cbEntity.isSurplus() ? "Surplus" : cbEntity.isDeficit() ? "Deficit" : "Neutral",
        targetIntensity: TARGET_INTENSITY,
        actualIntensity: ghgIntensity,
        energyInScopeMJ: cbEntity.energyInScopeMJ(),
    }
}