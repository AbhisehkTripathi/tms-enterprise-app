/**
 * Shipment data shape only. No database or persistence layer.
 */
export interface IShipment {
  id: string;
  shipperName: string;
  carrierName: string;
  pickupLocation: string;
  deliveryLocation: string;
  trackingNumber: string | null;
  status: string;
  rate: string;
  trackingData: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShipmentCreate {
  shipperName: string;
  carrierName: string;
  pickupLocation: string;
  deliveryLocation: string;
  trackingNumber?: string | null;
  status?: string;
  rate?: number;
  trackingData?: Record<string, unknown> | null;
}

export interface IShipmentUpdate {
  shipperName?: string;
  carrierName?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  trackingNumber?: string | null;
  status?: string;
  rate?: number;
  trackingData?: Record<string, unknown> | null;
}
