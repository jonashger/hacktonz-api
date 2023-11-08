import { Router } from "express";
import { placeController } from "../controllers/place.controller";

const placesRouter = Router();

placesRouter.get("/", placeController.listPlaces);

export { placesRouter };
