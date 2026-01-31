import { Query, Resolver, Mutation, Arg, Int, Authorized } from "type-graphql";
import { Shipment, ShipmentInput, ShipmentPage } from "@graphschema/shipment.schema";
import ShipmentService from "./shipment.service";
import type { IShipment } from "@models/shipment.schema";

const shipmentService = new ShipmentService();

function toShipment(e: IShipment): Shipment {
  return {
    id: e.id,
    shipperName: e.shipperName,
    carrierName: e.carrierName,
    pickupLocation: e.pickupLocation,
    deliveryLocation: e.deliveryLocation,
    trackingNumber: e.trackingNumber,
    status: e.status,
    rate: e.rate,
    trackingData: e.trackingData,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

@Resolver(() => Shipment)
export class ShipmentResolver {
  @Query(() => [Shipment])
  @Authorized("admin", "employee")
  async listShipments(
    @Arg("status", { nullable: true }) status: string | undefined,
    @Arg("shipperName", { nullable: true }) shipperName: string | undefined,
    @Arg("carrierName", { nullable: true }) carrierName: string | undefined,
    @Arg("sortBy", { nullable: true }) sortBy: string | undefined,
    @Arg("sortOrder", { nullable: true }) sortOrder: "ASC" | "DESC" | undefined
  ): Promise<Shipment[]> {
    const sort = [sortBy ?? "createdAt", sortOrder === "ASC" ? "asc" : "desc"].join(":");
    const result = await shipmentService.list({
      status,
      shipperName,
      carrierName,
      page: 1,
      limit: 50,
      sort,
    });
    if (!result.success || !result.data) return [];
    return result.data.records.map(toShipment);
  }

  @Query(() => Shipment, { nullable: true })
  @Authorized("admin", "employee")
  async shipment(@Arg("id") id: string): Promise<Shipment | null> {
    const result = await shipmentService.retrieve(id);
    if (!result.success || !result.data) return null;
    return toShipment(result.data);
  }

  @Query(() => ShipmentPage)
  @Authorized("admin", "employee")
  async shipmentsPaginated(
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("pageSize", () => Int, { defaultValue: 10 }) pageSize: number,
    @Arg("status", { nullable: true }) status: string | undefined,
    @Arg("shipperName", { nullable: true }) shipperName: string | undefined,
    @Arg("carrierName", { nullable: true }) carrierName: string | undefined,
    @Arg("sortBy", { nullable: true }) sortBy: string | undefined,
    @Arg("sortOrder", { nullable: true }) sortOrder: "ASC" | "DESC" | undefined
  ): Promise<ShipmentPage> {
    const sort = [sortBy ?? "createdAt", sortOrder === "ASC" ? "asc" : "desc"].join(":");
    const result = await shipmentService.list({
      page,
      limit: pageSize,
      status,
      shipperName,
      carrierName,
      sort,
    });
    if (!result.success || !result.data) {
      return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
    }
    const { records, totalCount, totalPages } = result.data;
    return {
      items: records.map(toShipment),
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  }

  @Mutation(() => Shipment)
  @Authorized("admin")
  async addShipment(@Arg("input") input: ShipmentInput): Promise<Shipment> {
    const result = await shipmentService.create({
      shipperName: input.shipperName,
      carrierName: input.carrierName,
      pickupLocation: input.pickupLocation,
      deliveryLocation: input.deliveryLocation,
      trackingNumber: input.trackingNumber ?? null,
      status: input.status ?? "pending",
      rate: input.rate ?? 0,
      trackingData: input.trackingData ?? null,
    });
    if (!result.success || !result.data) throw new Error(result.message ?? "Create failed");
    return toShipment(result.data);
  }

  @Mutation(() => Shipment)
  @Authorized("admin")
  async updateShipment(
    @Arg("id") id: string,
    @Arg("input") input: ShipmentInput
  ): Promise<Shipment> {
    const result = await shipmentService.update(id, {
      shipperName: input.shipperName,
      carrierName: input.carrierName,
      pickupLocation: input.pickupLocation,
      deliveryLocation: input.deliveryLocation,
      trackingNumber: input.trackingNumber ?? null,
      status: input.status ?? undefined,
      rate: input.rate ?? undefined,
      trackingData: input.trackingData ?? undefined,
    });
    if (!result.success || !result.data) throw new Error(result.message ?? "Update failed");
    return toShipment(result.data);
  }
}
