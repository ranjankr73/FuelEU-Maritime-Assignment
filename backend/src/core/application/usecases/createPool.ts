import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface PoolMemberInput {
  ship_id: string;
  cb_before: number;
}

export async function createPool(year: number, members: PoolMemberInput[]) {
  // Sum of all compliance balances
  const totalCB = members.reduce((sum, m) => sum + m.cb_before, 0);

  if (totalCB < 0)
    throw new Error("Invalid pool: sum of CBs must be >= 0");

  // Sort ships: surplus first, deficits last
  const sorted = [...members].sort((a, b) => b.cb_before - a.cb_before);

  const adjusted: { ship_id: string; cb_before: number; cb_after: number }[] = members.map(
    (m) => ({ ...m, cb_after: m.cb_before })
  );

  // Redistribute CBs: greedy matching
  for (let i = 0; i < sorted.length; i++) {
    const donor = adjusted.find((m) => m.ship_id === sorted[i]?.ship_id);
    if (!donor) continue;
    if (donor.cb_after <= 0) continue;

    for (let j = adjusted.length - 1; j >= 0; j--) {
      const receiver = adjusted[j]!;
      if (receiver.cb_after >= 0) continue;

      const transfer = Math.min(donor.cb_after, Math.abs(receiver.cb_after));
      donor.cb_after -= transfer;
      receiver.cb_after += transfer;

      if (donor.cb_after <= 0) break;
    }
  }

  // Validation after redistribution
  const finalSum = adjusted.reduce((sum, m) => sum + m.cb_after, 0);
  if (Math.abs(finalSum) > 1e-6) {
    console.warn("⚠️ Pool rounding imbalance detected.");
  }

  // Save pool + members
  const pool = await prisma.pools.create({
    data: {
      year,
      members: {
        create: adjusted.map((m) => ({
          ship_id: m.ship_id,
          cb_before: m.cb_before,
          cb_after: m.cb_after,
        })),
      },
    },
    include: { members: true },
  });

  return {
    poolId: pool.id,
    year,
    members: pool.members,
    poolSum: totalCB,
  };
}
