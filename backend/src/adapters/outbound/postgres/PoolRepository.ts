import { IPoolRepo } from "../../../core/ports/outbound/IPoolRepo";
import { Pool } from "../../../core/domain/Pool";
import { PoolMember } from "../../../shared/types/PoolMemberInterface";
import { prisma } from "../../../infrastructure/db/prisma";

export class PoolRepository implements IPoolRepo {
  async create(pool: Pool): Promise<Pool> {
    const result = await prisma.pools.create({
      data: {
        year: pool.year,
        members: {
          create: pool.members.map((m) => ({
            ship_id: m.shipId,
            cb_before: m.cbBefore,
            cb_after: m.cbAfter ?? m.cbBefore,
          })),
        },
      },
      include: { members: true },
    });

    const members: PoolMember[] = result.members.map((m) => ({
      shipId: m.ship_id,
      cbBefore: m.cb_before,
      cbAfter: m.cb_after,
    }));

    return new Pool(result.year, members, result.id);
  }

  async findAll(): Promise<Pool[]> {
    const records = await prisma.pools.findMany({ include: { members: true } });
    return records.map(
      (r) =>
        new Pool(
          r.year,
          r.members.map((m) => ({
            shipId: m.ship_id,
            cbBefore: m.cb_before,
            cbAfter: m.cb_after,
          }))
        )
    );
  }

  async findByYear(year: number): Promise<Pool[]> {
    const records = await prisma.pools.findMany({
      where: { year },
      include: { members: true },
    });
    return records.map(
      (r) =>
        new Pool(
          r.year,
          r.members.map((m) => ({
            shipId: m.ship_id,
            cbBefore: m.cb_before,
            cbAfter: m.cb_after,
          })),
          r.id
        )
    );
  }
}
