import { Router } from "express";
import { integrationController } from "../controllers/integration.controller";

const integrationRouter = Router();

integrationRouter.get("/", integrationController.listIntegrations);

export { integrationRouter };
