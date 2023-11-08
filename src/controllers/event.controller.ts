import { Request, Response } from "express";
import { clientAuth } from "../auth/clientAuth";
import prisma from "../prisma/prismaClient";

const createEvent = async (req: Request, res: Response) => {
  const {
    title,
    description,
    placeId,
    modalityId,
    password,
    value,
    individualValue,
    date,
    dateEnd,
    maxPlayers,
    minPlayers,
    clientId,
    clientSecret,
    keyPix,
  } = req.body;

  clientAuth
    .auth(clientId, clientSecret)
    .then(async (data) => {
      if (!data.access_token) {
        res.status(500).json({
          error: "Erro ao criar o Evento. Token inválido.",
        });
      }

      const http = await clientAuth.httpClient();

      // const internWebHook = "https://api.fut.hger.com.br/billing/sulcredi";
      const internWebHook =
        "https://webhook.site/ecc92544-db89-4004-9326-7800d55f77d3";

      return http
        .put(
          `/webhook/${keyPix}`,
          { webhookUrl: internWebHook },
          { headers: { Authorization: "Bearer " + data.access_token } }
        )
        .then((response) => response.data)
        .catch((error) => {
          throw error;
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: error.message,
      });
    });

  const modalityPlace = await prisma.modalityPlace.findFirst({
    where: {
      placeId,
      modalityId,
    },
  });

  if (!modalityPlace) {
    return res.status(400).json({
      error: "O Local informado não possui a Modalidade selecionada.",
    });
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        password,
        value,
        individualValue,
        date,
        modalityPlaceId: modalityPlace.id,
        dateEnd,
        active: true,
        maxPlayers,
        minPlayers,
        clientId,
        clientSecret,
        keyPix,
      },
    });
    res.json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar o Evento" });
  }
};

const validatePassword = async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const password = req.body.password;

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    if (event.password === password) {
      res.json({ message: "Senha correta" });
    } else {
      res.status(403).json({ error: "Senha incorreta" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao validar a senha do evento" });
  }
};

const eventsById = async (req: Request, res: Response) => {
  const eventId = req.params.id;

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        dateEnd: true,
        individualValue: true,
        maxPlayers: true,
        modalityPlace: {
          select: {
            place: {
              select: {
                description: true,
              },
            },
            modality: {
              select: {
                description: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    const eventPlayerCount = await prisma.event_player.count({
      where: {
        eventId: eventId,
      },
    });

    const vacancies = event.maxPlayers - eventPlayerCount;

    const players = await prisma.event_player.findMany({
      where: {
        eventId: eventId,
      },
      select: {
        player: {
          select: {
            name: true,
          },
        },
      },
    });

    const eventWithPlayers = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      finalDate: event.dateEnd,
      individualValue: event.individualValue,
      maxPlayers: event.maxPlayers,
      vacancies: vacancies,
      modality: event.modalityPlace.modality.description,
      place: event.modalityPlace.place.description,
      players: players.map((player) => player.player.name),
    };

    res.json(eventWithPlayers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter detalhes do evento" });
  }
};

const listEvents = async (req: Request, res: Response) => {
  try {
    const availableEvents = await prisma.event.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        dateEnd: true,
        individualValue: true,
        maxPlayers: true,
        modalityPlace: {
          select: {
            place: {
              select: {
                description: true,
              },
            },
            modality: {
              select: {
                description: true,
              },
            },
          },
        },
      },
    });

    const eventsWithVacancies = await Promise.all(
      availableEvents.map(async (event) => {
        if (!event) {
          return res.status(404).json({ error: "Evento não encontrado" });
        }
        const eventPlayerCount = await prisma.event_player.count({
          where: {
            eventId: event.id,
          },
        });

        const vacancies = event.maxPlayers - eventPlayerCount;

        return {
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          finalDate: event.dateEnd,
          individualValue: event.individualValue,
          maxPlayers: event.maxPlayers,
          vacancies: vacancies,
          modality: event.modalityPlace.modality.description,
          place: event.modalityPlace.place.description,
        };
      })
    );

    res.json(eventsWithVacancies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar eventos disponíveis" });
  }
};

const finishEvent = async (req: Request, res: Response) => {
  const eventId = req.params.id;

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    // Atualiza o evento
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        active: false,
      },
    });

    // Atualiza os registros da tabela event_player
    await prisma.event_player.updateMany({
      where: {
        eventId: eventId,
      },
      data: {
        active: false,
      },
    });

    // Atualiza o campo active dos jogadores
    const eventPlayers = await prisma.event_player.findMany({
      where: {
        eventId: eventId,
      },
    });

    const playerIds = eventPlayers.map((eventPlayer) => eventPlayer.playerId);

    await prisma.player.updateMany({
      where: {
        id: {
          in: playerIds,
        },
      },
      data: {
        active: false,
      },
    });

    res.json({ message: "Evento encerrado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao encerrar o evento" });
  }
};

export const eventController = {
  createEvent,
  validatePassword,
  eventsById,
  listEvents,
  finishEvent,
};
