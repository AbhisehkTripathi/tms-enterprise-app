/**
 * Manual seed: run against a running tms-api server to create sample shipments via GraphQL.
 * Use when server is already running (in-memory or Spring Boot mode).
 *
 * Usage: npx ts-node -r tsconfig-paths/register scripts/seed-via-api.ts
 * Or:    npm run seed:api
 */
import axios from "axios";
import { SAMPLE_SHIPMENTS } from "../src/seed/shipment.seed";

const API_URL = process.env.SEED_GRAPHQL_URL ?? "http://localhost:3010/api/v1/user";

async function seedViaApi(): Promise<void> {
  let seeded = 0;
  for (let i = 0; i < SAMPLE_SHIPMENTS.length; i++) {
    const s = SAMPLE_SHIPMENTS[i];
    if (!s) continue;
    const mutation = `mutation AddShipment($input: ShipmentInput!) { addShipment(input: $input) { id } }`;
    const variables = {
      input: {
        shipperName: s.shipperName,
        carrierName: s.carrierName,
        pickupLocation: s.pickupLocation,
        deliveryLocation: s.deliveryLocation,
        trackingNumber: s.trackingNumber ?? null,
        status: s.status ?? "pending",
        rate: s.rate ?? 0,
        trackingData: s.trackingData ?? null,
      },
    };
    try {
      const res = await axios.post(
        API_URL,
        { query: mutation, variables },
        {
          headers: {
            "Content-Type": "application/json",
            "x-role": "admin",
          },
          timeout: 10000,
        }
      );
      if (res.data?.data?.addShipment?.id) {
        seeded += 1;
      } else if (res.data?.errors?.length) {
        process.stderr.write(`addShipment ${i + 1} error: ${JSON.stringify(res.data.errors)}\n`);
      }
    } catch (err) {
      process.stderr.write(
        `Request failed: ${err instanceof Error ? err.message : String(err)}\n`
      );
      process.exit(1);
    }
  }
  console.log(`Seeded ${seeded} sample shipments via API (${API_URL}).`);
}

seedViaApi();
