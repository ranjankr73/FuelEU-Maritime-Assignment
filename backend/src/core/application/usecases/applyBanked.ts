import { IBankRepo } from "../../ports/outbound/IBankRepo";
import { IShipComplianceRepo } from "../../ports/outbound/IShipComplianceRepo";

import {
  EntityNotFoundError,
  ValidationError,
  BusinessRuleViolationError,
} from "../../../shared/errors/DomainError";

export class ApplyBanked {
  constructor(
    private bankRepository: IBankRepo,
    private complianceRepository: IShipComplianceRepo
  ) {}

  async execute(
    shipId: string,
    year: number,
    applyAmount: number
  ): Promise<{ cbBefore: number; applied: number; cbAfter: number }> {
    if (!shipId) throw new ValidationError("Ship ID is required.");
    if (!year) throw new ValidationError("Year is required.");
    if (applyAmount <= 0)
      throw new ValidationError("Apply amount must be positive.");

    const bankedEntries = await this.bankRepository.findAll();
    const shipBanked = bankedEntries.filter((b) => b.shipId === shipId);

    if (shipBanked.length === 0)
      throw new EntityNotFoundError("Bank entries", shipId);

    const totalAvailable = shipBanked.reduce((sum, b) => sum + b.amount, 0);
    if (applyAmount > totalAvailable)
      throw new BusinessRuleViolationError("Insufficient banked balance.");

    let remaining = applyAmount;
    const sorted = [...shipBanked].sort((a, b) => a.year - b.year);

    for (const entry of sorted) {
      if (remaining <= 0) break;
      const used = Math.min(entry.amount, remaining);
      entry.amount -= used;
      remaining -= used;
      await this.bankRepository.update(entry);
    }

    const complianceRecord = await this.complianceRepository.findByShipAndYear(
      shipId,
      year
    );
    if (!complianceRecord)
      throw new EntityNotFoundError("ShipCompliance", `${shipId}-${year}`);

    const cbBefore = complianceRecord.cbGco2eq;
    const cbAfter = cbBefore + applyAmount;

    await this.complianceRepository.create({
      shipId,
      year,
      cbGco2eq: cbAfter,
    });

    return {
      cbBefore,
      applied: applyAmount,
      cbAfter,
    };
  }
}
