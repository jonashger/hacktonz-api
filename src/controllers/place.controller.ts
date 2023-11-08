import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";

const listPlaces = async (req: Request, res: Response) => {
  const modalityId = req.query.modalityId as string;

  if (!modalityId)
    return res.status(400).json({ error: "Modality is required" });
  try {
    const places = await prisma.place.findMany({
      where: {
        modalityPlace: {
          some: {
            modalityId: modalityId,
          },
        },
      },
    });
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar os locais" });
  }
};

export const placeController = {
  listPlaces,
};
