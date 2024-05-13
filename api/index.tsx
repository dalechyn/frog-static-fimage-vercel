import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  verify: true,
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.frame(
    '/',
    (c) => {
      return c.res({
        image: (
          <div tw="flex">
              (clicked) Current time: {new Date().toISOString()}
          </div>
        ),
      })
    },
    {
      initial: {
        refreshing: true,
        image: () => (
          <div tw="flex">
              Current time: {new Date().toISOString()}
          </div>
        ),
        intents: [<Button>Check again</Button>],
      },
    },
  )

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
