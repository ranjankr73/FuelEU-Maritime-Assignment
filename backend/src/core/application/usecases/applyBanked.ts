import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function applyBanked(
  ship_id: string,
  year: number,
  apply_amount: number
) {
  const banked = await prisma.bank_entries.findMany({
    where: { ship_id }
  });

  const totalAvailable = banked.reduce(
    (sum, b) => sum + b.amount_gco2eq,
    0
  );

  if (apply_amount > totalAvailable)
    throw new Error("Insufficient banked balance.");

  let remaining = apply_amount;
  for (const b of banked.sort((a, b) => a.year - b.year)) {
    if (remaining <= 0) break;
    const used = Math.min(b.amount_gco2eq, remaining);
    await prisma.bank_entries.update({
      where: { id: b.id },
      data: { amount_gco2eq: b.amount_gco2eq - used }
    });
    remaining -= used;
  }

  const cbRecord = await prisma.ship_compliance.findFirst({
    where: { ship_id, year }
  });

  if (!cbRecord) throw new Error("No compliance record found for given year.");

  const cb_after = cbRecord.cb_gco2eq + apply_amount;
  await prisma.ship_compliance.update({
    where: { id: cbRecord.id },
    data: { cb_gco2eq: cb_after }
  });

  return {
    cb_before: cbRecord.cb_gco2eq,
    applied: apply_amount,
    cb_after
  };
}
