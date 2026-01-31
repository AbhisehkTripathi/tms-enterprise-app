import { Request, Response } from "express";
import StorageService from '@services/storage.service'
import Controller from "@libs/controller";
export default class RoleController extends Controller {

static async  count (req: Request, res: Response) {
    let storageService=new StorageService();
    const result = await storageService.count()
    res.status(result.statusCode).json(result);
}

static async getStorages(req: Request, res: Response)  {
  let storageService=new StorageService();
  const record = await storageService.list()
  res.status(record.statusCode).json(record);
}

static async getStorage(req: Request, res: Response) {
  let id = req.params.id
  let storageService=new StorageService();
  const records = await storageService.retrieve(id)
  res.status(records.statusCode).json(records);
}
static async getStorageByFilename(req: Request, res: Response) {
  const fileName = req.params.fileName;
  const storageService = new StorageService();
  const list = await storageService.list();
  const record = list.data?.find((s) => s.name === fileName);
  res.status(list.statusCode).json(list.success ? { ...list, data: record } : list);
}

static async upload(req: Request, res: Response) {
    const file = req.file;
    const storageService = new StorageService();
    const data = file
      ? { name: file.originalname ?? "", path: `document/${file.originalname ?? ""}` }
      : (req.body as { name: string; path: string });
    const result = await storageService.create(data);
    res.status(result.statusCode).json(result);
}

static async delete(req: Request, res: Response)  {
    let id = req.params.id;
    let storageService=new StorageService();
    const result = await storageService.delete(id)
    res.status(result.statusCode).json(result);
}

static async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body as { name?: string; path?: string };
    const storageService = new StorageService();
    const result = await storageService.update(id, data);
    res.status(result.statusCode).json(result);
  }

static async datatable(req: Request, res: Response) {
    const storageService = new StorageService();
    const records = await storageService.datatable(req.query as { page?: number; limit?: number });
    res.status(records.statusCode).json(records);
  }
}
