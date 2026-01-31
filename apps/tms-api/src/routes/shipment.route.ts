import express from "express";
import ShipmentController from "@controllers/shipment.controller";
import validator from "@middlewares/validator.middleware";
import { createShipment, updateShipment } from "@validators/shipment.validator";

const route = express.Router();

route.get("/count", ShipmentController.count);
route.get("/", ShipmentController.getShipments);
route.get("/:id", ShipmentController.getShipment);
route.post("/", validator(createShipment), ShipmentController.createShipment);
route.patch("/:id", validator(updateShipment), ShipmentController.updateShipment);
route.delete("/:id", ShipmentController.deleteShipment);

export default route;
