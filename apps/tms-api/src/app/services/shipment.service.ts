import { v4 as uuid } from "uuid";
import Response from "@libs/response";
import type { IShipment, IShipmentCreate, IShipmentUpdate } from "@models/shipment.schema";
import {
  getShipmentClient,
  isSpringBootEnabled,
  fetchShipmentsFromSpring,
  fetchShipmentById,
  createShipmentViaSpring,
  updateShipmentViaSpring,
  deleteShipmentViaSpring,
} from "@libs/shipmentClient";

const store: IShipment[] = [];

export default class ShipmentService {
  async list(query: {
    status?: string;
    shipperName?: string;
    carrierName?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<Response<{ records: IShipment[]; totalCount: number; totalPages: number; currentPage: number; filterCount: number }>> {
    try {
      const client = getShipmentClient();
      if (client && isSpringBootEnabled()) {
        const { records, totalCount, totalPages } = await fetchShipmentsFromSpring(client, {
          page: query.page,
          limit: query.limit,
          status: query.status,
          shipperName: query.shipperName,
          carrierName: query.carrierName,
          sort: query.sort,
        });
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.max(1, Number(query.limit) || 10);
        return new Response(true, 200, "Read operation successful", {
          records,
          totalCount,
          totalPages,
          currentPage: page,
          filterCount: records.length,
        });
      }
      let filtered = [...store];
      if (query.status) filtered = filtered.filter((s) => s.status === query.status);
      if (query.shipperName)
        filtered = filtered.filter((s) =>
          s.shipperName.toLowerCase().includes((query.shipperName as string).toLowerCase())
        );
      if (query.carrierName)
        filtered = filtered.filter((s) =>
          s.carrierName.toLowerCase().includes((query.carrierName as string).toLowerCase())
        );

      const sortParams = (query.sort ?? "createdAt:desc").split(":");
      const [sortBy, order] = sortParams.length === 2 ? sortParams : ["createdAt", "desc"];
      filtered.sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[sortBy];
        const bVal = (b as unknown as Record<string, unknown>)[sortBy];
        if (aVal instanceof Date && bVal instanceof Date)
          return order === "desc" ? bVal.getTime() - aVal.getTime() : aVal.getTime() - bVal.getTime();
        const aStr = String(aVal ?? "");
        const bStr = String(bVal ?? "");
        return order === "desc" ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
      });

      const page = Math.max(1, Number(query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
      const totalCount = filtered.length;
      const totalPages = Math.ceil(totalCount / limit) || 1;
      const skip = (page - 1) * limit;
      const records = filtered.slice(skip, skip + limit);

      const output = {
        records,
        totalCount,
        totalPages,
        currentPage: page,
        filterCount: records.length,
      };
      return new Response(true, 200, "Read operation successful", output);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<{
        records: IShipment[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
        filterCount: number;
      }>;
    }
  }

  async retrieve(id: string): Promise<Response<IShipment | undefined>> {
    try {
      const client = getShipmentClient();
      if (client && isSpringBootEnabled()) {
        const record = await fetchShipmentById(client, id);
        if (!record) return new Response(true, 200, "Record not available", undefined);
        return new Response(true, 200, "Read operation successful", record);
      }
      const record = store.find((s) => s.id === id);
      if (!record) return new Response(true, 200, "Record not available", undefined);
      return new Response(true, 200, "Read operation successful", record);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IShipment | undefined>;
    }
  }

  async create(data: IShipmentCreate): Promise<Response<IShipment>> {
    try {
      const client = getShipmentClient();
      if (client && isSpringBootEnabled()) {
        const record = await createShipmentViaSpring(client, data);
        return new Response(true, 201, "Insert operation successful", record);
      }
      const now = new Date();
      const record: IShipment = {
        id: uuid(),
        shipperName: data.shipperName,
        carrierName: data.carrierName,
        pickupLocation: data.pickupLocation,
        deliveryLocation: data.deliveryLocation,
        trackingNumber: data.trackingNumber ?? null,
        status: data.status ?? "pending",
        rate: String(data.rate ?? 0),
        trackingData: data.trackingData ?? null,
        createdAt: now,
        updatedAt: now,
      };
      store.push(record);
      return new Response(true, 201, "Insert operation successful", record);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IShipment>;
    }
  }

  async update(id: string, data: IShipmentUpdate): Promise<Response<IShipment>> {
    try {
      const client = getShipmentClient();
      if (client && isSpringBootEnabled()) {
        const record = await updateShipmentViaSpring(client, id, data);
        if (!record) return new Response(false, 404, "Record not available", undefined as unknown as IShipment);
        return new Response(true, 200, "Update operation successful", record);
      }
      const idx = store.findIndex((s) => s.id === id);
      if (idx === -1) return new Response(false, 404, "Record not available", undefined as unknown as IShipment);
      const existing = store[idx];
      const updated: IShipment = {
        ...existing,
        ...(data.shipperName != null && { shipperName: data.shipperName }),
        ...(data.carrierName != null && { carrierName: data.carrierName }),
        ...(data.pickupLocation != null && { pickupLocation: data.pickupLocation }),
        ...(data.deliveryLocation != null && { deliveryLocation: data.deliveryLocation }),
        ...(data.trackingNumber !== undefined && { trackingNumber: data.trackingNumber }),
        ...(data.status != null && { status: data.status }),
        ...(data.rate != null && { rate: String(data.rate) }),
        ...(data.trackingData !== undefined && { trackingData: data.trackingData }),
        updatedAt: new Date(),
      };
      store[idx] = updated;
      return new Response(true, 200, "Update operation successful", updated);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IShipment>;
    }
  }

  async delete(id: string): Promise<Response<IShipment | undefined>> {
    try {
      const client = getShipmentClient();
      if (client && isSpringBootEnabled()) {
        const ok = await deleteShipmentViaSpring(client, id);
        if (!ok) return new Response(true, 200, "Record not available", undefined);
        return new Response(true, 200, "Delete operation successful", undefined);
      }
      const idx = store.findIndex((s) => s.id === id);
      if (idx === -1) return new Response(true, 200, "Record not available", undefined);
      const [removed] = store.splice(idx, 1);
      return new Response(true, 200, "Delete operation successful", removed);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IShipment | undefined>;
    }
  }

  async count(): Promise<Response<number>> {
    try {
      return new Response(true, 200, "Count operation successful", store.length);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<number>;
    }
  }
}
