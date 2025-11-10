import type { IRoutes } from "../ports/IRoutes";
import type { Route } from "../domain/Route";

export async function setBaseline(repo: IRoutes, routeId: number): Promise<Route> {
  return await repo.setBaseline(routeId);
}
