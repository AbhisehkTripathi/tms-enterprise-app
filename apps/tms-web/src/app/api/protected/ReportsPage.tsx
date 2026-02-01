import { useQuery } from "@apollo/client/react";
import { gql } from "graphql-tag";
import { Layout } from "@/components/Layout";
import { formatDate, formatRate } from "@/utils/format";

const SHIPMENTS_PAGINATED = gql`
  query ReportsShipmentsPaginated($page: Int!, $pageSize: Int!) {
    shipmentsPaginated(page: $page, pageSize: $pageSize) {
      items {
        id
        shipperName
        carrierName
        status
        rate
        createdAt
      }
      totalCount
      totalPages
    }
  }
`;

export function ReportsPage(): React.ReactElement {
  const { data, loading, error } = useQuery<{
    shipmentsPaginated: {
      items: Array<{
        id: string;
        shipperName: string;
        carrierName: string;
        status: string;
        rate: string;
        createdAt: string;
      }>;
      totalCount: number;
      totalPages: number;
    };
  }>(SHIPMENTS_PAGINATED, {
    variables: { page: 1, pageSize: 20 },
  });

  const report = data?.shipmentsPaginated;
  const items = report?.items ?? [];
  const totalCount = report?.totalCount ?? 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-primary-text mb-4">Reports</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Report generated via GraphQL (shipmentsPaginated). Admin and employee can view.
        </p>
        {loading && <p className="text-muted-foreground p-4">Loading report…</p>}
        {error && (
          <p className="text-red-600 p-4">
            Error: {error.message}. Ensure the GraphQL server is running and you are logged in with x-role.
          </p>
        )}
        {!loading && !error && (
          <>
            <div className="bg-surface-elevated border border-border rounded-lg p-4 mb-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase mb-1">Summary</h2>
              <p className="text-2xl font-semibold text-primary-text">Total shipments: {totalCount}</p>
            </div>
            <div className="bg-surface-elevated border border-border rounded-lg overflow-hidden">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-primary-text">Shipper</th>
                    <th className="text-left px-4 py-3 font-medium text-primary-text">Carrier</th>
                    <th className="text-left px-4 py-3 font-medium text-primary-text">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-primary-text">Rate</th>
                    <th className="text-left px-4 py-3 font-medium text-primary-text">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr key={s.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-4 py-2 text-primary-text">{s.shipperName}</td>
                      <td className="px-4 py-2 text-primary-text">{s.carrierName}</td>
                      <td className="px-4 py-2 text-primary-text">{s.status}</td>
                      <td className="px-4 py-2 text-primary-text">{formatRate(s.rate)}</td>
                      <td className="px-4 py-2 text-muted-foreground">{formatDate(s.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length === 0 && (
                <p className="p-4 text-muted-foreground text-center">No shipments to display.</p>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
