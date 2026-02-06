import { serve } from "@hono/node-server"
import { createAPI } from "./api/api"

export async function startServer() {
    const app = await createAPI()
    const port = Number(process.env.PORT) || 3000

    serve({
        fetch: app.fetch,
        port
    })

    console.log(`API server running on http://localhost:${port}`)
}