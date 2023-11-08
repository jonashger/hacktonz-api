import { Router } from "express";
import { playerController } from "../controllers/player.controller";

const playerRouter = Router();

// playerRouter.post("/", playerController.createPlayer);
// playerRouter.put("/:id/confirm", playerController.confirmPresence);
playerRouter.put("/:id/disconfirm", playerController.disconfirmPresence);

export { playerRouter };
