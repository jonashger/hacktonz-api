import { Router } from "express";
import { billingRouter } from "./billing.router";
import { eventRouter } from "./event.router";
import { integrationRouter } from "./integration.router";
import { modalityRouter } from "./modality.router";
import { pingRouter } from "./ping.router";
import { placesRouter } from "./place.router";
import { playerRouter } from "./player.router";

const allRoutes = Router();

allRoutes.use("/billings", billingRouter);
allRoutes.use("/events", eventRouter);
allRoutes.use("/integrations", integrationRouter);
allRoutes.use("/modalities", modalityRouter);
allRoutes.use("/ping", pingRouter);
allRoutes.use("/places", placesRouter);
allRoutes.use("/players", playerRouter);

export { allRoutes };
