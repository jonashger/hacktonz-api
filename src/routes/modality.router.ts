import { Router } from "express";
import { modalityController } from "../controllers/modality.controller";

const modalityRouter = Router();

modalityRouter.get("/", modalityController.listModalities);

export { modalityRouter };
