export interface ShipComplianceRecord {
  id?: number;
  shipId: string;
  year: number;
  cbGco2eq: number;
  createdAt?: Date;
}