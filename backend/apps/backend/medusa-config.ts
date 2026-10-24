import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

/**
 * Redis, when the environment provides it (the live server: a Redis service
 * beside Postgres, as the other store on the same Dokploy runs). Medusa then
 * keeps sessions, cache, events, workflows and locks there, so they survive a
 * restart and a deploy. Without REDIS_URL — local development — every one of
 * them stays on Medusa's in-memory default, exactly as before.
 */
const redisUrl = process.env.REDIS_URL

const redisModules = redisUrl
  ? [
      { resolve: '@medusajs/medusa/cache-redis', options: { redisUrl } },
      { resolve: '@medusajs/medusa/event-bus-redis', options: { redisUrl } },
      { resolve: '@medusajs/medusa/workflow-engine-redis', options: { redis: { redisUrl } } },
      {
        resolve: '@medusajs/medusa/locking',
        options: {
          providers: [
            { resolve: '@medusajs/medusa/locking-redis', id: 'locking-redis', is_default: true, options: { redisUrl } },
          ],
        },
      },
    ]
  : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    ...(redisUrl ? { redisUrl } : {}),
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [
    // SEENERGY Vitrin: the storefront's editable design content.
    { resolve: './src/modules/vitrin' },
    // SEENERGY Talepler: requests left on the storefront's forms.
    { resolve: './src/modules/inquiry' },
    // Pictures uploaded in the admin. Medusa's local provider writes each
    // file's public URL with a hard default of http://localhost:9000/static,
    // so on a live server every upload would have been stored with a
    // localhost address. The base comes from the environment instead; unset
    // (development) it is the same default as before.
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/file-local',
            id: 'local',
            options: {
              backend_url: `${process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'}/static`,
            },
          },
        ],
      },
    },
    ...redisModules,
  ],
})
