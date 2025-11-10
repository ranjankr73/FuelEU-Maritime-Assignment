import { Router, Request, Response, NextFunction } from "express";
import { RouteRepository } from "../../outbound/postgres/RouteRepository";
import { ShipComplianceRepository } from "../../outbound/postgres/ShipComplianceRepository";
import { CalculateCompliance } from "../../../core/application/usecases/calculateCompliance";
import { ValidationError } from "../../../shared/errors/DomainError";

const router = Router();

const routeRepo = new RouteRepository();
const complianceRepo = new ShipComplianceRepository();

router.get(
  "/cb",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year)
        throw new ValidationError("Missing required query parameters: shipId and year");

      const route = await routeRepo.findByRouteId(String(shipId));
      if (!route)
        return res.status(404).json({ error: "Route not found for given shipId" });

      const useCase = new CalculateCompliance(complianceRepo);
      const result = await useCase.execute(route);

      res.status(200).json({
        message: "Compliance balance calculated successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/adjusted-cb",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipId, year } = req.query;
      if (!year)
        throw new ValidationError("Missing required query parameter: year");

      const yearNum = Number(year);
      if (Number.isNaN(yearNum))
        throw new ValidationError("Invalid year value");

      if (shipId) {
        const record = await complianceRepo.findByShipAndYear(
          String(shipId),
          yearNum
        );
        if (!record)
          return res
            .status(404)
            .json({ error: "No compliance record found for ship/year" });

        return res.status(200).json({ data: record });
      }

      const records = await complianceRepo.findByYear(yearNum);
      res.status(200).json({ count: records.length, data: records });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
