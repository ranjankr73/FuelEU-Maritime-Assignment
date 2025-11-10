import { Route } from "../../domain/Route";

export interface IRouteRepo {
  findAll(): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  setBaseline(id: number): Promise<Route>;
  save(route: Route): Promise<Route>;
}
