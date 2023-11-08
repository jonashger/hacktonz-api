import { Request, Response } from "express";

export const pingController = {
  ping: async (req: Request, res: Response) => {
    try {
      console.log("Ping");
      res.json({ message: "Pong" });
    } catch (error) {
      console.error("Erro no controlador ping:", error);
      res.status(500).json({ error: "Erro no servidor" });
    }
  },
};
