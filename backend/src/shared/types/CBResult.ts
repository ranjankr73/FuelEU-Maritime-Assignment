export interface CBResult {
  cb: number;
  status: "Surplus" | "Deficit" | "Neutral";
  targetIntensity: number;
  actualIntensity: number;
  energyInScopeMJ: number;
}