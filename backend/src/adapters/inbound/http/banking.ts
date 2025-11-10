import { Router, Request, Response } from "express";
import { PrismaClient, bank_entries } from "@prisma/client";
import { bankSurplus } from "../../../core/application/usecases/bankSurplus";
import { applyBanked } from "../../../core/application/usecases/applyBanked";

const prisma = new PrismaClient();
const router = Router();

// Request/Response types
interface BankQueryParams {
  shipId?: string;
  year?: string;
}

interface BankSurplusRequest {
  shipId: string;
  year: number;
  amount_gco2eq: number;
}

interface ApplyBankedRequest {
  shipId: string;
  year: number;
  applyAmount: number;
}

interface ApplyBankedResponse {
  cb_before: number;
  applied: number;
  cb_after: number;
}

interface ErrorResponse {
  error: string;
}

// Custom error for validation
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

router.get("/records", async (
  req: Request<{}, {}, {}, BankQueryParams>,
  res: Response<bank_entries[] | ErrorResponse>
) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId) {
      throw new ValidationError("shipId required");
    }

    const records = await prisma.bank_entries.findMany({
      where: {
        ship_id: String(shipId),
        ...(year ? { year: Number(year) } : {})
      }
    });
    res.json(records);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

router.post("/bank", async (
  req: Request<{}, {}, BankSurplusRequest>,
  res: Response<bank_entries | ErrorResponse>
) => {
  try {
    const { shipId, year, amount_gco2eq } = req.body;
    if (!shipId || !year || amount_gco2eq == null) {
      throw new ValidationError("shipId, year, amount_gco2eq required");
    }

    const entry = await bankSurplus(shipId, Number(year), Number(amount_gco2eq));
    res.status(201).json(entry);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

router.post("/apply", async (
  req: Request<{}, {}, ApplyBankedRequest>,
  res: Response<ApplyBankedResponse | ErrorResponse>
) => {
  try {
    const { shipId, year, applyAmount } = req.body;
    if (!shipId || !year || applyAmount == null) {
      throw new ValidationError("shipId, year, applyAmount required");
    }

    const result = await applyBanked(shipId, Number(year), Number(applyAmount));
    res.json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

export default router;
