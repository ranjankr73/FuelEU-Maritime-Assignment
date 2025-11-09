import Big from "big.js";

const TARGET_INTENSITY = Big(89.3368);
const ENERGY_CONSTANT = Big(41000);

export const computeCB = (ghgIntensity: number, fuelConsumption: number): string => {
    const energy = Big(fuelConsumption).times(ENERGY_CONSTANT);
    const cb = TARGET_INTENSITY.minus(ghgIntensity).times(energy);

    return cb.toFixed(6);
}