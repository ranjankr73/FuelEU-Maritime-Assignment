export class Bank {
  constructor(
    public shipId: string,
    public year: number,
    public amount: number
  ) {}

  isPositive(): boolean {
    return this.amount > 0;
  }

  toJSON() {
    return {
      shipId: this.shipId,
      year: this.year,
      amount: this.amount,
    };
  }
}
