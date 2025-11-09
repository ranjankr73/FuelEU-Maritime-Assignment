import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteRepoPrisma } from "../../outbound/postgres/RouteRepoPrisma";
import { calculateCompliance } from "../../../core/application/usecases/calculateCompliance";

const prisma = new PrismaClient();
const repo = new RouteRepoPrisma(prisma);
const router = Router();

router.get("/cb", async (req, res) => {
  try {
    const { routeId, year } = req.query;

    if (!routeId || !year) {
      return res.status(400).json({ error: "Missing routeId or year" });
    }

    const route = await prisma.routes.findFirst({
      where: { route_id: String(routeId), year: Number(year) },
    });

    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    const result = await calculateCompliance(route);
    res.status(200).json({ routeId, year, ...result });
  } catch (error) {
    console.error("Error computing CB:", error);
    res.status(500).json({ error: "Failed to compute compliance balance" });
  }
});

export default router;
