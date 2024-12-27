import { NextApiHandler } from 'next'
import NextAuth from 'next-auth'
import { createServer } from 'http'
import { initSocketServer } from '../../server/socketServer'

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, {
  // Your NextAuth configuration here
})

const httpServer = createServer(authHandler)
initSocketServer(httpServer)

export default function handler(req, res) {
  if (req.method === 'GET' && req.url === '/api/socketio') {
    // Handle Socket.IO upgrade
    httpServer.handleUpgrade(req, req.socket, Buffer.alloc(0), (socket) => {
      httpServer.emit('connection', socket, req)
    })
  } else {
    // Handle regular API routes
    return authHandler(req, res)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

