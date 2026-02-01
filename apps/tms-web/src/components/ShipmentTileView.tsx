import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { gql } from "graphql-tag";
import { formatDate, formatRate } from "@/utils/format";
import { getAuth } from "@/libs/auth";
import { getFlaggedShipmentIds, toggleFlaggedShipmentId } from "@/libs/flaggedShipments";

const DELETE_SHIPMENT = gql`
  mutation DeleteShipment($id: String!) {
    deleteShipment(id: $id)
  }
`;

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
  updatedAt?: string;
}

interface ShipmentTileViewProps {
  shipments: ShipmentTile[];
  totalPages: number;
  page: number;
  onPageChange: (p: number) => void;
}

export function ShipmentTileView({ shipments, totalPages, page, onPageChange }: ShipmentTileViewProps): React.ReactElement {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(() => getFlaggedShipmentIds());
  const auth = getAuth();
  const isAdmin = auth?.role === "admin";

  const [deleteShipment] = useMutation<{ deleteShipment: boolean }>(DELETE_SHIPMENT, {
    refetchQueries: ["ShipmentsPaginated"],
    onCompleted: () => {
      setOpenMenuId(null);
      navigate("/shipments?view=tile");
    },
  });

  const toggleFlag = useCallback((id: string): void => {
    toggleFlaggedShipmentId(id);
    setFlaggedIds(getFlaggedShipmentIds());
    setOpenMenuId(null);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shipments.map((s) => (
          <div
            key={s.id}
            className="bg-surface-elevated border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">{s.status}</span>
              <div className="flex items-center gap-2">
                {flaggedIds.has(s.id) && (
                  <span className="text-accent text-xs font-medium" title="Flagged">Flagged</span>
                )}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)}
                    className="w-9 h-9 rounded-full border border-border bg-surface-elevated hover:bg-muted text-muted-foreground aria-expanded:bg-muted flex items-center justify-center shadow-sm transition-colors"
                    aria-label="Options (edit, flag, delete)"
                    aria-haspopup="true"
                    aria-expanded={openMenuId === s.id}
                    title="Options: edit, flag, delete"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  {openMenuId === s.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        aria-hidden
                        onClick={() => setOpenMenuId(null)}
                      />
                      <ul
                        className="absolute right-0 top-full mt-1 py-1 w-44 bg-surface-elevated border border-border rounded-lg shadow-lg z-20 list-none"
                        role="menu"
                        aria-label="Tile options: view, edit, flag, delete"
                      >
                        <li role="none">
                          <Link
                            to={`/shipments/${s.id}?view=tile`}
                            className="block px-4 py-2 text-sm text-primary-text hover:bg-muted"
                            role="menuitem"
                            onClick={() => setOpenMenuId(null)}
                          >
                            View details
                          </Link>
                        </li>
                        {isAdmin && (
                          <li role="none">
                            <Link
                              to={`/shipments/${s.id}/edit?view=tile`}
                              className="block px-4 py-2 text-sm text-primary-text hover:bg-muted"
                              role="menuitem"
                              onClick={() => setOpenMenuId(null)}
                            >
                              Edit
                            </Link>
                          </li>
                        )}
                        <li role="none">
                          <button
                            type="button"
                            onClick={() => toggleFlag(s.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-primary-text hover:bg-muted"
                            role="menuitem"
                          >
                            {flaggedIds.has(s.id) ? "Unflag" : "Flag"}
                          </button>
                        </li>
                        {isAdmin && (
                          <li role="none">
                            <button
                              type="button"
                              onClick={() => {
                                deleteShipment({ variables: { id: s.id } });
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-primary-text hover:bg-muted"
                              role="menuitem"
                            >
                              Delete
                            </button>
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="font-medium text-primary-text truncate">{s.shipperName} → {s.carrierName}</p>
            <p className="text-sm text-muted-foreground truncate" title={s.pickupLocation}>{s.pickupLocation}</p>
            <p className="text-sm text-muted-foreground truncate" title={s.deliveryLocation}>{s.deliveryLocation}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatDate(s.createdAt)}</p>
            <div className="mt-3">
              <Link
                to={`/shipments/${s.id}?view=tile`}
                className="text-sm text-accent hover:underline font-medium"
              >
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
