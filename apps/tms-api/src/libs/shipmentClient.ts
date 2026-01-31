import axios, { AxiosInstance } from "axios";
import type { IShipment, IShipmentCreate, IShipmentUpdate } from "@models/shipment.schema";

const baseURL = process.env.SPRING_BOOT_SHIPMENT_URL ?? "";

function mapFromDto(d: {
  id: string;
  shipperName: string;
  carrierName: string;
  pickupLocation: string;
  deliveryLocation: string;
  trackingNumber: string | null;
  status: string;
  rate: string | number;
  trackingData: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}): IShipment {
  return {
    id: d.id,
    shipperName: d.shipperName,
    carrierName: d.carrierName,
    pickupLocation: d.pickupLocation,
    deliveryLocation: d.deliveryLocation,
    trackingNumber: d.trackingNumber,
    status: d.status,
    rate: typeof d.rate === "number" ? String(d.rate) : d.rate,
    trackingData: d.trackingData,
    createdAt: new Date(d.createdAt),
    updatedAt: new Date(d.updatedAt),
  };
}

/**
 * Returns an axios instance for the Shipment REST API when base URL is set; otherwise null.
 */
export function getShipmentClient(): AxiosInstance | null {
  if (!baseURL || baseURL === "") return null;
  return axios.create({ baseURL, timeout: 10000 });
}

export async function fetchShipmentsFromSpring(
  client: AxiosInstance,
  query: { page?: number; limit?: number; status?: string; shipperName?: string; carrierName?: string; sort?: string }
): Promise<{ records: IShipment[]; totalCount: number; totalPages: number }> {
  const [sortBy, order] = (query.sort ?? "createdAt:desc").split(":");
  const res = await client.get("/api/shipments", {
    params: {
      page: (query.page ?? 1) - 1,
      size: query.limit ?? 10,
      status: query.status,
      shipperName: query.shipperName,
      carrierName: query.carrierName,
      sortBy: sortBy ?? "createdAt",
      sortOrder: order ?? "desc",
    },
  });
  const content = res.data.content ?? [];
  const total = res.data.totalElements ?? 0;
  const totalPages = res.data.totalPages ?? 1;
  const records = content.map((d: Record<string, unknown>) =>
    mapFromDto({
      id: d.id as string,
      shipperName: d.shipperName as string,
      carrierName: d.carrierName as string,
      pickupLocation: d.pickupLocation as string,
      deliveryLocation: d.deliveryLocation as string,
      trackingNumber: (d.trackingNumber as string) ?? null,
      status: (d.status as string) ?? "pending",
      rate: (d.rate as number) ?? 0,
      trackingData: (d.trackingData as Record<string, unknown>) ?? null,
      createdAt: d.createdAt as string,
      updatedAt: d.updatedAt as string,
    })
  );
  return { records, totalCount: total, totalPages };
}

export async function fetchShipmentById(client: AxiosInstance, id: string): Promise<IShipment | null> {
  try {
    const res = await client.get(`/api/shipments/${id}`);
    return mapFromDto(res.data);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null;
    throw err;
  }
}

export async function createShipmentViaSpring(
  client: AxiosInstance,
  data: IShipmentCreate
): Promise<IShipment> {
  const payload = {
    shipperName: data.shipperName,
    carrierName: data.carrierName,
    pickupLocation: data.pickupLocation,
    deliveryLocation: data.deliveryLocation,
    trackingNumber: data.trackingNumber ?? null,
    status: data.status ?? "pending",
    rate: data.rate ?? 0,
    trackingData: data.trackingData ?? null,
  };
  const res = await client.post("/api/shipments", payload);
  return mapFromDto(res.data);
}

export async function updateShipmentViaSpring(
  client: AxiosInstance,
  id: string,
  data: IShipmentUpdate
): Promise<IShipment | null> {
  try {
    const res = await client.patch(`/api/shipments/${id}`, {
      shipperName: data.shipperName,
      carrierName: data.carrierName,
      pickupLocation: data.pickupLocation,
      deliveryLocation: data.deliveryLocation,
      trackingNumber: data.trackingNumber,
      status: data.status,
      rate: data.rate,
      trackingData: data.trackingData,
    });
    return mapFromDto(res.data);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null;
    throw err;
  }
}

export async function deleteShipmentViaSpring(client: AxiosInstance, id: string): Promise<boolean> {
  try {
    await client.delete(`/api/shipments/${id}`);
    return true;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return false;
    throw err;
  }
}

export function isSpringBootEnabled(): boolean {
  return Boolean(baseURL && baseURL !== "");
}
