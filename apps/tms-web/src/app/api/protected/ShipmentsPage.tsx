import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { gql } from "graphql-tag";
import { ShipmentGrid } from "@/components/ShipmentGrid";
import { ShipmentTileView } from "@/components/ShipmentTileView";
import { Layout } from "@/components/Layout";

const SHIPMENTS_PAGINATED = gql`
  query ShipmentsPaginated($page: Int!, $pageSize: Int!) {
    shipmentsPaginated(page: $page, pageSize: $pageSize) {
      items {
        id
        shipperName
        carrierName
        pickupLocation
        deliveryLocation
        trackingNumber
        status
        rate
        createdAt
        updatedAt
      }
      totalCount
      page
      pageSize
      totalPages
    }
  }
`;

export function ShipmentsPage(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get("view");
  const [view, setView] = useState<"grid" | "tile">(viewParam === "tile" ? "tile" : "grid");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const next = searchParams.get("view") === "tile" ? "tile" : "grid";
    setView(next);
  }, [searchParams]);

  const onViewChange = (v: "grid" | "tile"): void => {
    setView(v);
    const next = new URLSearchParams(searchParams);
    next.set("view", v);
    setSearchParams(next, { replace: true });
  };
  const { data, loading, error } = useQuery<{
    shipmentsPaginated: {
      items: Array<{
        id: string;
        shipperName: string;
        carrierName: string;
        pickupLocation: string;
        deliveryLocation: string;
        trackingNumber: string | null;
        status: string;
        rate: string;
        createdAt: string;
        updatedAt: string;
      }>;
      totalPages: number;
    };
  }>(SHIPMENTS_PAGINATED, {
    variables: { page, pageSize: 10 },
  });

  const shipments = data?.shipmentsPaginated?.items ?? [];
  const totalPages = data?.shipmentsPaginated?.totalPages ?? 0;

  return (
    <Layout view={view} onViewChange={onViewChange}>
      {loading && <p className="text-muted-foreground p-4">Loading shipments…</p>}
      {error && (
        <p className="text-red-600 p-4">
          Error: {error.message}. Ensure the Node GraphQL server is running and use header x-role: employee.
        </p>
      )}
      {!loading && !error && view === "grid" && (
        <ShipmentGrid shipments={shipments} totalPages={totalPages} page={page} onPageChange={setPage} />
      )}
      {!loading && !error && view === "tile" && (
        <ShipmentTileView shipments={shipments} totalPages={totalPages} page={page} onPageChange={setPage} />
      )}
    </Layout>
  );
}
