import { PrismaClient } from "@prisma/client";
import { Route } from "../../domain/Route";
import { computeCB } from "./computeCB";

const prisma = new PrismaClient();

export const calculateCompliance = async (route: Route): Promise<{ cb_gco2eq: number, status: "Surplus" | "Deficit" | "Neutral" }> => {
    const cbValue = Number(computeCB(route.ghg_intensity, route.fuel_consumption));

    let status: "Surplus" | "Deficit" | "Neutral" = "Neutral";
    if (cbValue > 0) status = "Surplus";
    else if (cbValue < 0) status = "Deficit";

    await prisma.ship_compliance.create({
        data: {
            ship_id: route.route_id,
            year: route.year,
            cb_gco2eq: cbValue,
        },
    });

    return { cb_gco2eq: cbValue, status };
}