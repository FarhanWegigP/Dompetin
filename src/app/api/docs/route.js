import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import YAML from "yaml";

// merge every YAML file in /etc/swagger
export async function GET() {
  const swaggerPath = path.join(process.cwd(), "etc/swagger");
  let result = { openapi: "3.0.0", info: { title: "Dompet.in API", version: "1.0.0" }, paths: {}, components: { schemas: {} } };

  fs.readdirSync(swaggerPath)
    .filter(f => f.endsWith(".yaml"))
    .forEach(file => {
      const doc = YAML.parse(fs.readFileSync(path.join(swaggerPath, file), "utf8"));
      Object.assign(result.paths, doc.paths || {});
      Object.assign(result.components.schemas, doc.components?.schemas || {});
    });

  return NextResponse.json(result);
}
