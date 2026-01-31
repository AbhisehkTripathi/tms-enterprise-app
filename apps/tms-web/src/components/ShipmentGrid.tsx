import { Link } from "react-router-dom";
import { formatDate, formatRate } from "@/utils/format";

interface ShipmentRow {
  id: string;
  shipperName: string;
  carrierName: string;
  pickupLocation: string;
  deliveryLocation: string;
  trackingNumber: string | null;
  status: string;
  rate: string;
  createdAt: string;
}

interface ShipmentGridProps {
  shipments: ShipmentRow[];
  totalPages: number;
  page: number;
  onPageChange: (p: number) => void;
}

const COLUMNS = [
  "Shipper",
  "Carrier",
  "Pickup",
  "Delivery",
  "Tracking",
  "Status",
  "Rate",
  "Created",
  "Actions",
] as const;

export function ShipmentGrid({ shipments, totalPages, page, onPageChange }: ShipmentGridProps): React.ReactElement {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-surface-elevated rounded-lg overflow-hidden border border-border">
        <thead>
          <tr className="bg-muted">
            {COLUMNS.map((col) => (
              <th key={col} className="text-left px-4 py-3 text-sm font-medium text-primary border-b border-border">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr key={s.id} className="border-b border-border hover:bg-muted/50">
              <td className="px-4 py-2 text-sm">{s.shipperName}</td>
              <td className="px-4 py-2 text-sm">{s.carrierName}</td>
              <td className="px-4 py-2 text-sm max-w-[120px] truncate" title={s.pickupLocation}>{s.pickupLocation}</td>
              <td className="px-4 py-2 text-sm max-w-[120px] truncate" title={s.deliveryLocation}>{s.deliveryLocation}</td>
              <td className="px-4 py-2 text-sm">{s.trackingNumber ?? "—"}</td>
              <td className="px-4 py-2 text-sm">{s.status}</td>
              <td className="px-4 py-2 text-sm">{formatRate(s.rate)}</td>
              <td className="px-4 py-2 text-sm">{formatDate(s.createdAt)}</td>
              <td className="px-4 py-2">
                <Link to={`/shipments/${s.id}`} className="text-blue-600 hover:underline text-sm">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 rounded border border-border disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">Page {page} of {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 rounded border border-border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
