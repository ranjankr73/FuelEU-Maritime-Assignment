import { prisma } from "../../../infrastructure/db/prisma";
import { IRouteRepo } from "../../../core/ports/outbound/IRouteRepo";
import { Route } from "../../../core/domain/Route";

export class RouteRepository implements IRouteRepo {
  async findAll(): Promise<Route[]> {
    const records = await prisma.routes.findMany();
    return records.map(
      (r) =>
        new Route(
          r.id,
          r.route_id,
          r.vessel_type,
          r.fuel_type,
          r.year,
          r.ghg_intensity,
          r.fuel_consumption,
          r.distance,
          r.total_emissions,
          r.is_baseline
        )
    );
  }

  async findById(id: number): Promise<Route | null> {
    const r = await prisma.routes.findUnique({ where: { id } });
    return r
      ? new Route(
          r.id,
          r.route_id,
          r.vessel_type,
          r.fuel_type,
          r.year,
          r.ghg_intensity,
          r.fuel_consumption,
          r.distance,
          r.total_emissions,
          r.is_baseline
        )
      : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const r = await prisma.routes.findUnique({
      where: { route_id: routeId },
    });

    return r
      ? new Route(
          r.id,
          r.route_id,
          r.vessel_type,
          r.fuel_type,
          r.year,
          r.ghg_intensity,
          r.fuel_consumption,
          r.distance,
          r.total_emissions,
          r.is_baseline
        )
      : null;
  }

  async findBaseline(): Promise<Route | null> {
    const r = await prisma.routes.findFirst({
      where: { is_baseline: true },
    });
    return r
      ? new Route(
          r.id,
          r.route_id,
          r.vessel_type,
          r.fuel_type,
          r.year,
          r.ghg_intensity,
          r.fuel_consumption,
          r.distance,
          r.total_emissions,
          r.is_baseline
        )
      : null;
  }

  async setBaseline(routeId: number): Promise<Route> {
    await prisma.routes.updateMany({ data: { is_baseline: false } });

    const updated = await prisma.routes.update({
      where: { id: routeId },
      data: { is_baseline: true },
    });

    return new Route(
      updated.id,
      updated.route_id,
      updated.vessel_type,
      updated.fuel_type,
      updated.year,
      updated.ghg_intensity,
      updated.fuel_consumption,
      updated.distance,
      updated.total_emissions,
      updated.is_baseline
    );
  }

  async save(route: Route): Promise<Route> {
    const record = await prisma.routes.upsert({
      where: { id: route.id },
      update: {
        vessel_type: route.vesselType,
        fuel_type: route.fuelType,
        year: route.year,
        ghg_intensity: route.ghgIntensity,
        fuel_consumption: route.fuelConsumption,
        distance: route.distance,
        total_emissions: route.totalEmissions,
        is_baseline: route.isBaseline,
      },
      create: {
        route_id: route.routeId,
        vessel_type: route.vesselType,
        fuel_type: route.fuelType,
        year: route.year,
        ghg_intensity: route.ghgIntensity,
        fuel_consumption: route.fuelConsumption,
        distance: route.distance,
        total_emissions: route.totalEmissions,
        is_baseline: route.isBaseline,
      },
    });

    return new Route(
      record.id,
      record.route_id,
      record.vessel_type,
      record.fuel_type,
      record.year,
      record.ghg_intensity,
      record.fuel_consumption,
      record.distance,
      record.total_emissions,
      record.is_baseline
    );
  }
}
