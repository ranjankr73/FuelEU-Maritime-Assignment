import { Router, Request, Response, NextFunction } from "express";
import { RouteRepository } from "../../outbound/postgres/RouteRepository";
import { computeComparison } from "../../../core/application/usecases/computeComparison";

const router = Router();

const routeRepo = new RouteRepository();

router.get("/", async (_req:Request, res: Response, next: NextFunction) => {
    try {
        const routes = await routeRepo.findAll();
        res.json({ data: routes });
    } catch (error) {
        next(error);
    }
});

router.post("/:id/baseline", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid route ID." });
    }

    const updated = await routeRepo.setBaseline(id);
    if (!updated) {
      return res.status(404).json({ error: "Route not found." });
    }

    res.json({ message: "Baseline route updated successfully.", data: updated });
  } catch (err) {
    next(err);
  }
});


router.get("/comparison", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const baseline = await routeRepo.findBaseline();
    const allRoutes = await routeRepo.findAll();

    if (!baseline) {
      return res.status(404).json({ error: "No baseline route found." });
    }

    const { baseline: b, comparisons, target } = computeComparison(baseline, allRoutes);
    res.json({
      baseline: b,
      targetIntensity: target,
      totalRoutes: allRoutes.length,
      comparisons,
    });
  } catch (err) {
    next(err);
  }
});

export default router;