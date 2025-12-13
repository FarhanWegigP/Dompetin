import { createSwaggerSpec } from "next-swagger-doc";

// Ini adalah endpoint yang akan diakses oleh Swagger UI
export async function GET() {
  // createSwaggerSpec membaca swagger.config.js dan semua komentar JSDoc di apiFolder
  const spec = await createSwaggerSpec(); 
  
  return new Response(JSON.stringify(spec), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}