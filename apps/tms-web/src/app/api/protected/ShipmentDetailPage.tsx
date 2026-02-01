import { useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "graphql-tag";
import { formatDate, formatRate } from "@/utils/format";
import { Layout } from "@/components/Layout";
import { getAuth } from "@/libs/auth";
import { isShipmentFlagged, toggleFlaggedShipmentId } from "@/libs/flaggedShipments";

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

const DELETE_SHIPMENT = gql`
  mutation DeleteShipment($id: String!) {
    deleteShipment(id: $id)
  }
`;

export function ShipmentDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backView = searchParams.get("view");
  const backPath = backView === "tile" ? "/shipments?view=tile" : "/shipments";
  const auth = getAuth();
  const isAdmin = auth?.role === "admin";
  const shipmentId = id ?? "";
  const [flagged, setFlagged] = useState(() => isShipmentFlagged(shipmentId));

  const handleToggleFlag = (): void => {
    toggleFlaggedShipmentId(shipmentId);
    setFlagged(isShipmentFlagged(shipmentId));
  };

  const [deleteShipment] = useMutation<{ deleteShipment: boolean }>(DELETE_SHIPMENT, {
    refetchQueries: ["ShipmentsPaginated"],
    onCompleted: () => navigate(backPath),
  });

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
  }>(SHIPMENT_BY_ID, { variables: { id: shipmentId }, skip: !id });

  const s = data?.shipment;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-surface-elevated border border-border rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="text-sm text-accent hover:underline font-medium"
          >
            ← Back to {backView === "tile" ? "tile view" : "shipments"}
          </button>
          {isAdmin && s && (
            <>
              <Link
                to={`/shipments/${shipmentId}/edit?view=${backView ?? ""}`}
                className="text-sm text-accent hover:underline font-medium"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => deleteShipment({ variables: { id: shipmentId } })}
                className="text-sm text-red-600 hover:underline font-medium"
              >
                Delete
              </button>
            </>
          )}
          {s && (
            <button
              type="button"
              onClick={handleToggleFlag}
              className="text-sm text-accent hover:underline font-medium"
            >
              {flagged ? "Unflag" : "Flag"}
            </button>
          )}
        </div>
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
