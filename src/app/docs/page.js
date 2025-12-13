"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Memuat komponen Swagger UI hanya di sisi client
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  // Mengarahkan Swagger UI ke endpoint JSON yang sudah kita buat
  const specUrl = "/api/docs/swagger.json"; 

  return (
    <div style={{ padding: "20px" }}>
      <SwaggerUI url={specUrl} />
    </div>
  );
}