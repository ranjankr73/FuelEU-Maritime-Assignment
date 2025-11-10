export interface ComplianceRecord {
  shipId: string;
  year: number;
  cbGco2eq: number;
  status: "Surplus" | "Deficit" | "Neutral";
  createdAt?: string | Date;
}
