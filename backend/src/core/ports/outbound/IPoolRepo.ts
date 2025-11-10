import { Pool } from "../../domain/Pool";

export interface IPoolRepo {
  create(pool: Pool): Promise<Pool>;
  findAll(): Promise<Pool[]>;
  findByYear(year: number): Promise<Pool[]>;
}
