// const express = requires('express')
// const baseRouter = requires('./cases/base.js')
// const cacheRouter = requires('./cases/cache.js')
// const replicationRouter = requires('./cases/replication.js')
// const rateLimitingRouter = requires('express')
import express from 'express'
import baseRouter from './strategy/base.js'
import cacheRouter from './strategy/cache.js'
import replicationRouter from './strategy/replication.js'
import rateLimitingRouter from './strategy/rate-limiting.js'
const app = express()
const port = 3000


app.use('/base', baseRouter)
app.use('/cache', cacheRouter)
app.use('/replication', replicationRouter)
app.use('/rate-limiting', rateLimitingRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
