import { prisma } from "./prisma";

async function main() {
    const routes = [
        { route_id: "R001", vessel_type: "Container", fuel_type: "HFO", year: 2024, ghg_intensity: 91.0, fuel_consumption: 5000, distance: 12000, total_emissions: 4500, is_baseline: true },
        { route_id: "R002", vessel_type: "BulkCarrier", fuel_type: "LNG", year: 2024, ghg_intensity: 88.0, fuel_consumption: 4800, distance: 11500, total_emissions: 4200 },
        { route_id: "R003", vessel_type: "Tanker", fuel_type: "MGO", year: 2024, ghg_intensity: 93.5, fuel_consumption: 5100, distance: 12500, total_emissions: 4700 },
        { route_id: "R004", vessel_type: "RoRo", fuel_type: "HFO", year: 2025, ghg_intensity: 89.2, fuel_consumption: 4900, distance: 11800, total_emissions: 4300 },
        { route_id: "R005", vessel_type: "Container", fuel_type: "LNG", year: 2025, ghg_intensity: 90.5, fuel_consumption: 4950, distance: 11900, total_emissions: 4400 }
    ];

    try {
        await prisma.routes.createMany({ data: routes, skipDuplicates: true });
        console.log("✅ Seed data inserted successfully.");
    } catch (err) {
        console.error("❌ Error inserting seed data:", err);
        throw err;
    }
}

main()
    .catch(() => process.exit(1))
    .finally(async () => {
        await prisma.$disconnect();
    });