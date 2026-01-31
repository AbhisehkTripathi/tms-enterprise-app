import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { gql } from "graphql-tag";
import { formatDate, formatRate } from "@/utils/format";
import { Layout } from "@/components/Layout";

const SHIPMENT_BY_ID = gql`
  query Shipment($id: String!) {
    shipment(id: $id) {
      id
      shipperName
      carrierName
      pickupLocation
      deliveryLocation
      trackingNumber
      status
      rate
      trackingData
      createdAt
      updatedAt
    }
  }
`;

export function ShipmentDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery<{
    shipment: {
      id: string;
      shipperName: string;
      carrierName: string;
      pickupLocation: string;
      deliveryLocation: string;
      trackingNumber: string | null;
      status: string;
      rate: string;
      trackingData: Record<string, unknown> | null;
      createdAt: string;
      updatedAt: string;
    } | null;
  }>(SHIPMENT_BY_ID, { variables: { id: id ?? "" }, skip: !id });

  const s = data?.shipment;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-surface-elevated border border-border rounded-lg shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/shipments")}
          className="mb-4 text-sm text-accent hover:underline font-medium"
        >
          ← Back to shipments
        </button>
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
        {!loading && !error && s && (
          <dl className="grid grid-cols-1 gap-3">
            <div><dt className="font-medium text-muted-foreground">ID</dt><dd>{s.id}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Shipper</dt><dd>{s.shipperName}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Carrier</dt><dd>{s.carrierName}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Pickup</dt><dd>{s.pickupLocation}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Delivery</dt><dd>{s.deliveryLocation}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Tracking</dt><dd>{s.trackingNumber ?? "—"}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Status</dt><dd>{s.status}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Rate</dt><dd>{formatRate(s.rate)}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Created</dt><dd>{formatDate(s.createdAt)}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Updated</dt><dd>{formatDate(s.updatedAt)}</dd></div>
            {s.trackingData && (
              <div><dt className="font-medium text-muted-foreground">Tracking data</dt><dd><pre className="text-sm bg-muted p-2 rounded">{JSON.stringify(s.trackingData, null, 2)}</pre></dd></div>
            )}
          </dl>
        )}
      </div>
    </Layout>
  );
}
