import axios from "axios";
import https from "https";
import prisma from "../prisma/prismaClient";
import { authResponse } from "../types/auth.type";

async function getIntegrationInfo() {
  const integration = await prisma.integrations.findFirst();

  if (!integration) {
    throw new Error(
      "Nenhuma informação de integração encontrada no banco de dados."
    );
  }

  return integration;
}

const httpClient = async () => {
  const integration = await getIntegrationInfo();

  return await axios.create({
    baseURL: integration.endpoint as string,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      passphrase: integration.passphraseMtls || undefined,
      pfx: integration.pfxMtls || undefined,
    }),
  });
};

const auth = async (client_id: string, client_secret: string) => {
  const http = await httpClient();

  if (!http) {
    console.error("Erro ao criar o cliente HTTP.");
    throw new Error("Erro ao criar o cliente HTTP.");
  }

  const { data } = await http
    .post("/oauth/token", {
      grant_type: "client_credentials",
      client_id,
      client_secret,
    })
    .catch((error) => {
      console.error("Erro ao realizar a autenticação: ", error.message);
      throw new Error(
        "Erro ao realizar a autenticação. Error: " + error.message
      );
    });

  console.log("Autenticação criada: ", data);

  return data as authResponse;
};

export const clientAuth = {
  auth,
  httpClient,
};
