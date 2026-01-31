import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/libs/apollo";
import { ProtectedRoute } from "@/app/api/protected/ProtectedRoute";
import { ShipmentsPage } from "@/app/api/protected/ShipmentsPage";
import { ShipmentDetailPage } from "@/app/api/protected/ShipmentDetailPage";
import { LoginPage } from "@/app/LoginPage";
import { HomePage } from "@/app/HomePage";

function App(): React.ReactElement {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/shipments"
            element={
              <ProtectedRoute>
                <ShipmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipments/:id"
            element={
              <ProtectedRoute>
                <ShipmentDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/reports" element={<ProtectedRoute><div className="p-4">Reports (placeholder)</div></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
