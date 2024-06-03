import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from 'hono/bun'
import { expenseRoute } from "../server/routes/expenses";

const app = new Hono();
app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/expenses", expenseRoute);

app.get('*', serveStatic({ root: './client/dist' }))
app.get('*', serveStatic({ path: './client/dist/index.html' }))

export default app
export type ApiRoutes = typeof apiRoutes;