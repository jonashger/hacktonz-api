import { Router } from "express";
import { eventController } from "../controllers/event.controller";

const eventRouter = Router();

eventRouter.post("/", eventController.createEvent);
eventRouter.get("/", eventController.listEvents);
eventRouter.get("/:id", eventController.eventsById);
eventRouter.put("/:id/finish", eventController.finishEvent);
eventRouter.get("/:id/access", eventController.validatePassword);

export { eventRouter };
