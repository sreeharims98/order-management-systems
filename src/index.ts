import "dotenv/config";
import http from "http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

const requestHandler = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0] || { version: "unknown" };
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(version);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(String(err));
  }
};

const port = Number(process.env.PORT || 3000);

http.createServer(requestHandler).listen(port, () => {
  console.log(`Neon server running at http://localhost:${port}`);
});
