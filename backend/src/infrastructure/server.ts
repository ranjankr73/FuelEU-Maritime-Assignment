import express from 'express';
import dotenv from 'dotenv';
import routesRouter from "../adapters/inbound/http/routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/routes", routesRouter);

app.get("/health", (req, res) => {
    res.status(200).send("Server is healthy");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});