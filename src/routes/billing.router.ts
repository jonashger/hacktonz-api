import { Router } from "express";
import { billingController } from "../controllers/billing.controller";

const billingRouter = Router();

billingRouter.get("/:id", billingController.billingById);
billingRouter.post("/:eventId", billingController.createBilling);
billingRouter.post("/sulcredi", billingController.webhookSulcredi);

export { billingRouter };
