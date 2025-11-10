import { Router, Request, Response } from "express";
import { getAdjustedCB } from "../../../core/application/usecases/getAdjustedCB";
import { createPool, PoolMemberInput } from "../../../core/application/usecases/createPool";

const router = Router();

// Types for request/response
interface CreatePoolRequest {
  year: number;
  members: PoolMemberInput[];
}

interface GetAdjustedCBResponse {
  shipId: string;
  cb_gco2eq: number;
}

// Get adjusted compliance balances for a year
router.get("/compliance/adjusted-cb", async (req: Request<{}, {}, {}, { year?: string }>, res: Response<GetAdjustedCBResponse[] | { error: string }>) => {
  try {
    const { year } = req.query;
    if (!year || isNaN(Number(year))) {
      return res.status(400).json({ error: "Missing or invalid year" });
    }

    const result = await getAdjustedCB(Number(year));
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Create a new compliance pool
router.post("/pools", async (req: Request<{}, {}, CreatePoolRequest>, res: Response) => {
  try {
    const { year, members } = req.body;

    if (!year || typeof year !== 'number') {
      return res.status(400).json({ error: "Invalid year" });
    }

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: "Members must be a non-empty array" });
    }

    // Validate member structure
    const isValidMember = (m: any): m is PoolMemberInput => 
      typeof m === 'object' && 
      typeof m.ship_id === 'string' && 
      typeof m.cb_before === 'number';

    if (!members.every(isValidMember)) {
      return res.status(400).json({ 
        error: "Invalid member format. Each member must have ship_id (string) and cb_before (number)" 
      });
    }

    const result = await createPool(year, members);
    res.status(201).json(result);
  } catch (e: any) {
    // Use 400 for validation errors, 500 for unexpected errors
    const status = e.message.includes("Invalid pool") ? 400 : 500;
    res.status(status).json({ error: e.message });
  }
});

export default router;
