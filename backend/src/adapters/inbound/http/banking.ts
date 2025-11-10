import { Router, Request, Response, NextFunction } from "express";
import { BankRepository } from "../../outbound/postgres/BankRepository";
import { ShipComplianceRepository } from "../../outbound/postgres/ShipComplianceRepository";
import { BankSurplus } from "../../../core/application/usecases/bankSurplus";
import { ApplyBanked } from "../../../core/application/usecases/applyBanked";
import { ValidationError } from "../../../shared/errors/DomainError";

const router = Router();

const bankRepo = new BankRepository();
const complianceRepo = new ShipComplianceRepository();

router.get(
  "/records",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId)
        throw new ValidationError("Missing required query parameter: shipId");

      const yearNum = year ? Number(year) : undefined;

      let records = [];
      if (yearNum) {
        const record = await bankRepo.findByShipAndYear(String(shipId), yearNum);
        records = record ? [record] : [];
      } else {
        const all = await bankRepo.findAll();
        records = all.filter((b) => b.shipId === String(shipId));
      }

      if (records.length === 0)
        return res
          .status(404)
          .json({ error: "No bank records found for given parameters" });

      res.status(200).json({ count: records.length, data: records });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/bank",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipId, year, amountGco2eq } = req.body;
      if (!shipId || !year || amountGco2eq === undefined)
        throw new ValidationError("shipId, year, and amountGco2eq are required");

      const useCase = new BankSurplus(bankRepo);
      const result = await useCase.execute(
        String(shipId),
        Number(year),
        Number(amountGco2eq)
      );

      res.status(201).json({
        message: "Surplus CB banked successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/apply",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipId, year, applyAmount } = req.body;
      if (!shipId || !year || applyAmount === undefined)
        throw new ValidationError("shipId, year, and applyAmount are required");

      const useCase = new ApplyBanked(bankRepo, complianceRepo);
      const result = await useCase.execute(
        String(shipId),
        Number(year),
        Number(applyAmount)
      );

      res.status(200).json({
        message: "Banked surplus applied successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
