import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).send("Server is healthy");
});

const prisma = new PrismaClient();

app.get("/routes", async (req, res) => {
    const routes = await prisma.routes.findMany();
    res.json(routes);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});