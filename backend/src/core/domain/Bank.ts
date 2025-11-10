import { BusinessRuleViolationError, ValidationError } from "../../shared/errors/DomainError";

export class Bank {
  constructor(
    public shipId: string,
    public year: number,
    public amount: number
  ) {
    if (amount < 0)
      throw new ValidationError("Bank amount cannot be negative.");
  }

  canApply(requested: number): boolean {
    return requested <= this.amount;
  }

  apply(requested: number): void {
    if (!this.canApply(requested)) {
      throw new BusinessRuleViolationError("Insufficient banked CB available.");
    }
    this.amount -= requested;
  }

  addSurplus(amount: number): void {
    if (amount <= 0)
      throw new ValidationError("Only positive surplus can be banked.");
    this.amount += amount;
  }

  toJSON() {
    return {
      shipId: this.shipId,
      year: this.year,
      amount: this.amount,
    };
  }
}
