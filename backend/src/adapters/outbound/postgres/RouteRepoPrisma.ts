import { PrismaClient } from "@prisma/client";
import { RouteRepository } from "../../../core/ports/outbound/RouteRepository";
import { Route } from "../../../core/domain/Route";

export class RouteRepoPrisma implements RouteRepository {
    constructor(private prisma: PrismaClient) {}

    async findAll(): Promise<Route[]> {
        return this.prisma.routes.findMany();
    }

    async findById(id: number): Promise<Route | null> {
        return this.prisma.routes.findUnique({ where: { id }});
    }

    async findBaseline(): Promise<Route | null> {
        return this.prisma.routes.findFirst({ where: { is_baseline: true }});
    }

    async setBaseline(id: number): Promise<Route> {
        await this.prisma.routes.updateMany({ data: { is_baseline: false }, where: { is_baseline: true }});
        return this.prisma.routes.update({ where: { id }, data: { is_baseline: true }});
    }
}