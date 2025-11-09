import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function bankSurplus(
  ship_id: string,
  year: number,
  amount_gco2eq: number
) {
  if (amount_gco2eq <= 0)
    throw new Error("Only positive CB can be banked.");

  const entry = await prisma.bank_entries.create({
    data: { ship_id, year, amount_gco2eq }
  });

  return entry;
}
