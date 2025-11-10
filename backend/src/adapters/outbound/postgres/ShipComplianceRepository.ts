import { IShipComplianceRepo } from "../../../core/ports/outbound/IShipComplianceRepo";
import { ShipComplianceRecord } from "../../../shared/types/ShipComplianceRecord";
import { prisma } from "../../../infrastructure/db/prisma";

export class ShipComplianceRepository implements IShipComplianceRepo {
  async create(record: ShipComplianceRecord): Promise<ShipComplianceRecord> {
    const result = await prisma.ship_compliance.create({
      data: {
        ship_id: record.shipId,
        year: record.year,
        cb_gco2eq: record.cbGco2eq,
      },
    });
    return {
      id: result.id,
      shipId: result.ship_id,
      year: result.year,
      cbGco2eq: result.cb_gco2eq,
      createdAt: result.created_at,
    };
  }

  async findByShipAndYear(shipId: string, year: number): Promise<ShipComplianceRecord | null> {
    const r = await prisma.ship_compliance.findFirst({ where: { ship_id: shipId, year } });
    return r
      ? {
          id: r.id,
          shipId: r.ship_id,
          year: r.year,
          cbGco2eq: r.cb_gco2eq,
          createdAt: r.created_at,
        }
      : null;
  }

  async findAll(): Promise<ShipComplianceRecord[]> {
    const rows = await prisma.ship_compliance.findMany();
    return rows.map((r) => ({
      id: r.id,
      shipId: r.ship_id,
      year: r.year,
      cbGco2eq: r.cb_gco2eq,
      createdAt: r.created_at,
    }));
  }

  async findByYear(year: number): Promise<ShipComplianceRecord[]> {
      const records = await prisma.ship_compliance.findMany({ where: { year } });
    return records.map((r) => ({
      id: r.id,
      shipId: r.ship_id,
      year: r.year,
      cbGco2eq: r.cb_gco2eq,
      createdAt: r.created_at,
    }));
  }
}
