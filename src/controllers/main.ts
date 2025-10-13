import { Request, Response } from 'express';

export const mainController = (req: Request, res: Response) => {
    res.status(200).send("API is running");
}