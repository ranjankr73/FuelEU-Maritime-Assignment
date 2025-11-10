import type { IRoutes } from "../ports/IRoutes";
import type { Route } from "../domain/Route";

export async function fetchRoutes(repo: IRoutes): Promise<Route[]> {
  return await repo.getAll();
}
