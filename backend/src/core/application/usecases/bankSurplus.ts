import { Bank } from "../../domain/Bank";
import { ValidationError } from "../../../shared/errors/DomainError";
import { IBankRepo } from "../../ports/outbound/IBankRepo";

export class BankSurplus {
  constructor(private bankRepository: IBankRepo) {}

  async execute(
    shipId: string,
    year: number,
    amountGco2eq: number
  ) {
    if (!shipId) throw new ValidationError("Ship ID is required.");
    if (!year) throw new ValidationError("Year is required.");
    if (amountGco2eq <= 0)
      throw new ValidationError("Only positive CB can be banked.");

    const bank = new Bank(shipId, year, amountGco2eq);

    const saved = await this.bankRepository.create(bank);

    return {
      shipId: saved.shipId,
      year: saved.year,
      amount: saved.amount,
    };
  }
}