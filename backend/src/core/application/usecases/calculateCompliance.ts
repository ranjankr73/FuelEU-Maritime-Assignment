import { ComplianceBalance } from "../../domain/ComplianceBalance";
import { Route } from "../../domain/Route";
import { IShipComplianceRepo } from "../../ports/outbound/IShipComplianceRepo";
import { ValidationError } from "../../../shared/errors/DomainError";

export class CalculateCompliance {
  constructor(private complianceRepository: IShipComplianceRepo) {}

  async execute(route: Route): Promise<{
    shipId: string;
    year: number;
    cbGco2eq: number;
    status: "Surplus" | "Deficit" | "Neutral";
  }> {
    if (!route) throw new ValidationError("Route data is required.");

    const compliance = new ComplianceBalance(
      route.routeId,
      route.year,
      route.ghgIntensity,
      route.fuelConsumption
    );

    const cbValue = compliance.compute();

    await this.complianceRepository.create({
      shipId: compliance.shipId,
      year: compliance.year,
      cbGco2eq: cbValue,
    });

    return {
      shipId: compliance.shipId,
      year: compliance.year,
      cbGco2eq: cbValue,
      status: compliance.isSurplus()
        ? "Surplus"
        : compliance.isDeficit()
        ? "Deficit"
        : "Neutral",
    };
  }
}
