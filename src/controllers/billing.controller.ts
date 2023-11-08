import { Request, Response } from "express";
import { clientAuth } from "../auth/clientAuth";
import prisma from "../prisma/prismaClient";
import { playerController } from "./player.controller";

const createCob = async (
  value: string,
  keyPix: string,
  clientId: string,
  clientSecret: string
) => {
  const jsonData = {
    calendario: {
      expiracao: 3600,
    },
    valor: {
      original: value,
    },
    chave: keyPix,
    solicitacaoPagador: "Pagamento de inscrição.",
  };

  return clientAuth.auth(clientId, clientSecret).then(async (data) => {
    const http = await clientAuth.httpClient();

    return http
      .post(`/cob/`, jsonData, {
        headers: {
          Authorization: "Bearer " + data.access_token,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  });
};

const createBilling = async (req: Request, res: Response) => {
  const eventId = req.params.eventId;

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ error: "Evento não encontrado" });
  }

  const cob = await createCob(
    event.individualValue.toString(),
    event.keyPix,
    event.clientId!,
    event.clientSecret!
  );
  if (!cob) {
    return res.status(400).json({ error: "Erro ao criar a Cobrança" });
  }

  const newBilling = await prisma.billing.create({
    data: {
      eventId,
      status: 0,
      txId: cob.txid,
    },
  });
  if (!newBilling) {
    return res.status(400).json({ error: "Erro ao criar a Cobrança/Billing" });
  }

  // RETORNA O BRCODE
  return res.json({ cob, eventId });
};

const webhookSulcredi = async (req: Request, res: Response) => {
  try {
    const { endToEndId, txid, valor, pagador } = req.body;

    const newPlayer = await playerController.createPlayer(
      pagador.nome,
      pagador.cpf || pagador.cnpj
    );
    if (!newPlayer) {
      return;
    }

    await prisma.billing.updateMany({
      where: {
        txId: txid,
      },
      data: {
        endToEnd: endToEndId,
        value: valor,
        status: 1,
        playerId: newPlayer.id,
      },
    });

    const event = await prisma.billing.findFirst({
      where: {
        txId: txid,
      },
      select: {
        eventId: true,
      },
    });
    if (!event) {
      throw new Error("Evento não encontrado");
    }

    playerController.confirmPresence(newPlayer.id, event?.eventId || "1");

    res.json({ message: "Cobrança paga e jogador confirmado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar o webhook" });
  }
};

const billingById = async (req: Request, res: Response) => {
  const billingId = req.params.id;

  try {
    const billing = await prisma.event.findUnique({
      where: {
        id: billingId,
      },
    });

    if (!billing) {
      return res.status(404).json({ error: "Cobrança não encontrada" });
    }

    res.json(billing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter detalhes da cobrança" });
  }
};

export const billingController = {
  billingById,
  createBilling,
  webhookSulcredi,
};
