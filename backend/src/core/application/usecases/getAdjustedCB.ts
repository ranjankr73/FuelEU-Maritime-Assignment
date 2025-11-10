import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAdjustedCB(year: number) {
  const compliances = await prisma.ship_compliance.findMany({
    where: { year },
  });

  return compliances.map((c) => ({
    shipId: c.ship_id,
    cb_gco2eq: c.cb_gco2eq,
  }));
}
