import { Router, Request, Response, NextFunction } from "express";
import { PoolRepository } from "../../outbound/postgres/PoolRepository";
import { CreatePool } from "../../../core/application/usecases/createPool";
import { ValidationError } from "../../../shared/errors/DomainError";
import { PoolMember } from "../../../shared/types/PoolMemberInterface";

const router = Router();

const poolRepo = new PoolRepository();

router.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year, members } = req.body;

      if (!year || !Array.isArray(members) || members.length === 0) {
        throw new ValidationError("year and non-empty members[] are required");
      }

      for (const m of members) {
        if (typeof m.shipId !== "string" || typeof m.cbBefore !== "number") {
          throw new ValidationError(
            "Each pool member must include 'shipId' (string) and 'cbBefore' (number)"
          );
        }
      }

      const useCase = new CreatePool(poolRepo);
      const result = await useCase.execute(Number(year), members as PoolMember[]);

      return res.status(201).json({
        message: "Pool created successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
