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

router.get("/adjusted-cb", async (req, res) => {
  try {
    const { shipId, year } = req.query;

    if (!year) {
      return res.status(400).json({ error: "Missing required query parameter: year" });
    }

    const yearNum = Number(year);
    if (Number.isNaN(yearNum)) {
      return res.status(400).json({ error: "Invalid year value" });
    }

    if (shipId) {
      const record = await prisma.ship_compliance.findFirst({
        where: { ship_id: String(shipId), year: yearNum },
        orderBy: { created_at: "desc" },
      });

      if (!record) {
        return res.status(404).json({ error: "No compliance record found for ship/year" });
      }

      return res.json({
        shipId: record.ship_id,
        year: record.year,
        cb_gco2eq: record.cb_gco2eq,
        createdAt: record.created_at,
      });
    } else {
      const records = await prisma.ship_compliance.findMany({
        where: { year: yearNum },
        orderBy: { created_at: "desc" },
      });

      const latestMap = new Map<string, { shipId: string; year: number; cb_gco2eq: number; createdAt: Date }>();
      for (const r of records) {
        if (!latestMap.has(r.ship_id)) {
          latestMap.set(r.ship_id, {
            shipId: r.ship_id,
            year: r.year,
            cb_gco2eq: r.cb_gco2eq,
            createdAt: r.created_at,
          });
        }
      }

      const result = Array.from(latestMap.values());
      return res.json(result);
    }
  } catch (err: any) {
    console.error("Error in GET /compliance/adjusted-cb:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
