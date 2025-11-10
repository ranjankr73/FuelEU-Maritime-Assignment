import { ShipComplianceRecord } from "../../../shared/types/ShipComplianceRecord";

export interface IShipComplianceRepo {
  create(record: ShipComplianceRecord): Promise<ShipComplianceRecord>;
  findByShipAndYear(shipId: string, year: number): Promise<ShipComplianceRecord | null>;
  findAll(): Promise<ShipComplianceRecord[]>;
  findByYear(year: number): Promise<ShipComplianceRecord[]>;
}
