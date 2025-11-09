import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteRepoPrisma } from "../../outbound/postgres/RouteRepoPrisma";

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

export default router;