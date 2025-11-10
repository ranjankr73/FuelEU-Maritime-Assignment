import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routesRouter from "../adapters/inbound/http/routes";
import complianceRouter from "../adapters/inbound/http/compliance";
import bankingRouter from "../adapters/inbound/http/banking";
import poolingRouter from "../adapters/inbound/http/pooling";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/routes", routesRouter);
app.use("/compliance", complianceRouter);
app.use("/banking", bankingRouter);
app.use("/pooling", poolingRouter);

app.get("/health", (req, res) => {
    res.status(200).send("Server is healthy");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});