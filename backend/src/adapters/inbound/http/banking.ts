import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { bankSurplus } from "../../../core/application/usecases/bankSurplus";
import { applyBanked } from "../../../core/application/usecases/applyBanked";

const prisma = new PrismaClient();
const router = Router();

router.get("/records", async (req, res) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId) return res.status(400).json({ error: "shipId required" });

    const records = await prisma.bank_entries.findMany({
      where: {
        ship_id: String(shipId),
        ...(year ? { year: Number(year) } : {})
      }
    });
    res.json(records);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/bank", async (req, res) => {
  try {
    const { shipId, year, amount_gco2eq } = req.body;
    if (!shipId || !year || amount_gco2eq == null)
      return res.status(400).json({ error: "shipId, year, amount_gco2eq required" });

    const entry = await bankSurplus(shipId, Number(year), Number(amount_gco2eq));
    res.status(201).json(entry);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/apply", async (req, res) => {
  try {
    const { shipId, year, applyAmount } = req.body;
    if (!shipId || !year || applyAmount == null)
      return res.status(400).json({ error: "shipId, year, applyAmount required" });

    const result = await applyBanked(shipId, Number(year), Number(applyAmount));
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
