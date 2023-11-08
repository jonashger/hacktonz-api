import { Router } from "express";
import { pingController } from "../controllers/ping.controller";

const pingRouter = Router();

pingRouter.post("/", pingController.ping);

export { pingRouter };
