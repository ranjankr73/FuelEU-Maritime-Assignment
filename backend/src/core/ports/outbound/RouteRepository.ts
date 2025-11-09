import { Route } from "../../domain/Route";

export interface RouteRepository {
    findAll(): Promise<Route[]>
    findById(id: number): Promise<Route | null>
    findBaseline(): Promise<Route | null>
    setBaseline(id: number): Promise<Route>
}