import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteRepoPrisma } from "../../outbound/postgres/RouteRepoPrisma";
import { computeComparison } from "../../../core/application/usecases/computeComparison";

const prisma = new PrismaClient();
const repo = new RouteRepoPrisma(prisma);
const router = Router();

router.get("/", async (_req, res) => {
    const routes = await repo.findAll();
    res.json(routes);
});

router.post("/:id/baseline", async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = await repo.setBaseline(id);
    res.json(updated);
});

router.get("/comparison", async (req, res) => {
    try {
        const baseline = await repo.findBaseline();
        const allRoutes = await repo.findAll();

        if(!baseline){
            return res.status(404).json({ error: "No baseline route found" });
        }

        const result = computeComparison(baseline, allRoutes);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to compute comparison" });
    }
});

export default router;