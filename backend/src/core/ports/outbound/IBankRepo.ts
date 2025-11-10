import { Bank } from "../../domain/Bank";

export interface IBankRepo {
  create(bank: Bank): Promise<Bank>;
  findByShipAndYear(shipId: string, year: number): Promise<Bank | null>;
  update(bank: Bank): Promise<Bank>;
  findAll(): Promise<Bank[]>;
}

