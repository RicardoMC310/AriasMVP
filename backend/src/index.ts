import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/healthy", (_req: Request, res: Response) => {
    res.status(200).json({
        message: "OK",
        status: 200
    });
});