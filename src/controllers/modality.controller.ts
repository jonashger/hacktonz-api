import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";

const listModalities = async (req: Request, res: Response) => {
  try {
    const modalities = await prisma.modality.findMany({});
    res.json(modalities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar os locais" });
  }
};

export const modalityController = {
  listModalities,
};
