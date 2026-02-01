import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "graphql-tag";
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

const UPDATE_SHIPMENT = gql`
  mutation UpdateShipment($id: String!, $input: ShipmentInput!) {
    updateShipment(id: $id, input: $input) {
      id
      shipperName
      carrierName
      pickupLocation
      deliveryLocation
      trackingNumber
      status
      rate
      updatedAt
    }
  }
`;

export function ShipmentEditPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backView = searchParams.get("view");
  const backPath = backView === "tile" ? "/shipments?view=tile" : "/shipments";

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
    } | null;
  }>(SHIPMENT_BY_ID, { variables: { id: id ?? "" }, skip: !id });

  const [updateShipment, { loading: updating, error: updateError }] = useMutation<{
    updateShipment: { id: string };
  }>(UPDATE_SHIPMENT, {
    refetchQueries: [{ query: SHIPMENT_BY_ID, variables: { id: id ?? "" } }],
  });

  const s = data?.shipment;

  const [shipperName, setShipperName] = useState("");
  const [carrierName, setCarrierName] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [status, setStatus] = useState("pending");
  const [rate, setRate] = useState("");

  useEffect(() => {
    if (s) {
      setShipperName(s.shipperName);
      setCarrierName(s.carrierName);
      setPickupLocation(s.pickupLocation);
      setDeliveryLocation(s.deliveryLocation);
      setTrackingNumber(s.trackingNumber ?? "");
      setStatus(s.status);
      setRate(s.rate ?? "0");
    }
  }, [s]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateShipment({
        variables: {
          id,
          input: {
            shipperName: shipperName.trim(),
            carrierName: carrierName.trim(),
            pickupLocation: pickupLocation.trim(),
            deliveryLocation: deliveryLocation.trim(),
            trackingNumber: trackingNumber.trim() || null,
            status: status.trim() || "pending",
            rate: parseFloat(rate) || 0,
            trackingData: null,
          },
        },
      });
      navigate(`/shipments/${id}?view=${backView ?? ""}`);
    } catch {
      // updateError is shown below
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-surface-elevated border border-border rounded-lg shadow-sm">
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="mb-4 text-sm text-accent hover:underline font-medium"
        >
          ← Cancel
        </button>
        <h1 className="text-lg font-semibold text-primary-text mb-4">Edit shipment</h1>
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
        {!loading && !error && s && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Shipper name</label>
              <input
                type="text"
                value={shipperName}
                onChange={(e) => setShipperName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-surface text-primary-text"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Carrier name</label>
              <input
                type="text"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-surface text-primary-text"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Pickup location</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-surface text-primary-text"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Delivery location</label>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-surface text-primary-text"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Tracking number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-surface text-primary-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-surface text-primary-text"
              >
                <option value="pending">Pending</option>
                <option value="in_transit">In transit</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Rate</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-surface text-primary-text"
              />
            </div>
            {updateError && (
              <p className="text-sm text-red-600" role="alert">
                {updateError.message}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50"
              >
                {updating ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate(backPath)}
                className="px-4 py-2 border border-border rounded-md font-medium text-primary-text hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
