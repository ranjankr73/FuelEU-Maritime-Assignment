import express from 'express';
import cors from 'cors';
import routesRouter from "../../adapters/inbound/http/routes";
import complianceRouter from "../../adapters/inbound/http/compliance";
import bankingRouter from "../../adapters/inbound/http/banking";
import poolingRouter from "../../adapters/inbound/http/pooling";
import { prisma } from '../db/prisma';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/routes", routesRouter);
app.use("/compliance", complianceRouter);
app.use("/banking", bankingRouter);
app.use("/pools", poolingRouter);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;