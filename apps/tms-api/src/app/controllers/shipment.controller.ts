import { Request, Response } from "express";
import ShipmentService from "@services/shipment.service";

export default class ShipmentController {
  static async count(req: Request, res: Response): Promise<void> {
    const shipmentService = new ShipmentService();
    const result = await shipmentService.count();
    res.status(result.statusCode).json(result);
  }

  static async getShipments(req: Request, res: Response): Promise<void> {
    const shipmentService = new ShipmentService();
    const result = await shipmentService.list(req.query as Record<string, string | number | undefined>);
    res.status(result.statusCode).json(result);
  }

  static async getShipment(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const shipmentService = new ShipmentService();
    const result = await shipmentService.retrieve(id);
    res.status(result.statusCode).json(result);
  }

  static async createShipment(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const shipmentService = new ShipmentService();
    const result = await shipmentService.create(data);
    res.status(result.statusCode).json(result);
  }

  static async updateShipment(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const data = req.body;
    const shipmentService = new ShipmentService();
    const result = await shipmentService.update(id, data);
    res.status(result.statusCode).json(result);
  }

  static async deleteShipment(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const shipmentService = new ShipmentService();
    const result = await shipmentService.delete(id);
    res.status(result.statusCode).json(result);
  }
}
