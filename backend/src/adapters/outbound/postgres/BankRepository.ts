import { IBankRepo } from "../../../core/ports/outbound/IBankRepo";
import { Bank } from "../../../core/domain/Bank";
import { prisma } from "../../../infrastructure/db/prisma";

export class BankRepository implements IBankRepo {
  async create(bank: Bank): Promise<Bank> {
    const record = await prisma.bank_entries.create({
      data: {
        ship_id: bank.shipId,
        year: bank.year,
        amount_gco2eq: bank.amount,
      },
    });
    return new Bank(record.ship_id, record.year, record.amount_gco2eq);
  }

  async findByShipAndYear(shipId: string, year: number): Promise<Bank | null> {
    const record = await prisma.bank_entries.findFirst({ where: { ship_id: shipId, year } });
    return record ? new Bank(record.ship_id, record.year, record.amount_gco2eq) : null;
  }

  async update(bank: Bank): Promise<Bank> {
    await prisma.bank_entries.updateMany({
      where: { ship_id: bank.shipId, year: bank.year },
      data: { amount_gco2eq: bank.amount },
    });
    return bank;
  }

  async findAll(): Promise<Bank[]> {
    const records = await prisma.bank_entries.findMany();
    return records.map((r) => new Bank(r.ship_id, r.year, r.amount_gco2eq));
  }
}
