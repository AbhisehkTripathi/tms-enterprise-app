import ShipmentService from "@services/shipment.service";
import { isSpringBootEnabled } from "@libs/shipmentClient";
import { SAMPLE_SHIPMENTS } from "./shipment.seed";

/**
 * Seeds the in-memory shipment store when empty and Spring Boot is not used.
 * Call before or on server start so grid, tile, and report views have sample data.
 */
export async function runShipmentSeed(): Promise<{ seeded: number; skipped: boolean }> {
  if (isSpringBootEnabled()) {
    console.log("Shipment seed skipped (SPRING_BOOT_SHIPMENT_URL is set; data from Java service).");
    return { seeded: 0, skipped: true };
  }

  const service = new ShipmentService();
  const countRes = await service.count();
  const count = countRes.data ?? 0;

  if (count > 0) {
    console.log(`Shipment seed skipped (already ${count} shipment(s) in store).`);
    return { seeded: 0, skipped: true };
  }

  let seeded = 0;
  for (const payload of SAMPLE_SHIPMENTS) {
    const res = await service.create(payload);
    if (res.success) seeded += 1;
  }

  console.log(`Seeded ${seeded} sample shipments (in-memory; grid/tile/report).`);
  return { seeded, skipped: false };
}
