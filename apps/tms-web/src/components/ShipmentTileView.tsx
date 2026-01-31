import { Link } from "react-router-dom";
import { formatDate, formatRate } from "@/utils/format";

interface ShipmentTile {
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

interface ShipmentTileViewProps {
  shipments: ShipmentTile[];
  totalPages: number;
  page: number;
  onPageChange: (p: number) => void;
}

export function ShipmentTileView({ shipments, totalPages, page, onPageChange }: ShipmentTileViewProps): React.ReactElement {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shipments.map((s) => (
          <div
            key={s.id}
            className="bg-surface-elevated border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">{s.status}</span>
              <span className="text-sm font-medium">{formatRate(s.rate)}</span>
            </div>
            <p className="font-medium text-primary-text truncate">{s.shipperName} → {s.carrierName}</p>
            <p className="text-sm text-muted-foreground truncate" title={s.pickupLocation}>{s.pickupLocation}</p>
            <p className="text-sm text-muted-foreground truncate" title={s.deliveryLocation}>{s.deliveryLocation}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatDate(s.createdAt)}</p>
            <div className="mt-3 flex gap-2">
              <Link to={`/shipments/${s.id}`} className="text-sm text-accent hover:underline font-medium">
                View details
              </Link>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1.5 rounded-md border border-border bg-surface-elevated hover:bg-muted disabled:opacity-50 text-sm"
          >
            Previous
          </button>
          <span className="px-3 py-1.5 text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1.5 rounded-md border border-border bg-surface-elevated hover:bg-muted disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
