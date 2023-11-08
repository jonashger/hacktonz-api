import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";

const createPlayer = async (cpf: string, name: string) => {
  try {
    const newPlayer = await prisma.player.create({
      data: {
        cpf,
        name,
        active: true,
      },
    });

    return newPlayer;
  } catch (error) {
    console.error("Erro ao criar jogador: " + error);
  }
};

const confirmPresence = async (eventId: string, playerId: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return;
    }

    const newEventPlayer = await prisma.event_player.create({
      data: {
        playerId,
        eventId,
        active: true,
      },
    });

    return newEventPlayer;
  } catch (error) {
    console.error(error);
    return;
  }
};

const disconfirmPresence = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  const eventId = req.body.eventId;

  try {
    const player = await prisma.player.findUnique({
      where: { id: playerId },
    });
    if (!player) {
      return res.status(404).json({ error: "Jogador não encontrado" });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    const eventPlayer = await prisma.event_player.findFirst({
      where: { playerId, eventId },
    });
    if (!eventPlayer) {
      return res
        .status(404)
        .json({ error: "Registro de presença não encontrado" });
    }

    const updatedEventPlayer = await prisma.event_player.update({
      where: { id: eventPlayer.id },
      data: {
        active: false,
      },
    });

    res.json(updatedEventPlayer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao desconfirmar presença no evento" });
  }
};

export const playerController = {
  createPlayer,
  confirmPresence,
  disconfirmPresence,
};
