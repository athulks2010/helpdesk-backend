import Pusher from 'pusher'
import crypto from 'crypto'

let pusher: Pusher | null = null

export const getPusher = () => {
  if (pusher) return pusher
  if (!process.env.PUSHER_APP_KEY) return null
  pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID || '',
    key: process.env.PUSHER_APP_KEY || '',
    secret: process.env.PUSHER_APP_SECRET || '',
    cluster: process.env.PUSHER_APP_CLUSTER || 'mt1',
    useTLS: true,
  })
  return pusher
}

/** Laravel-compatible private channel auth signature */
export const authorizePusherChannel = (socketId: string, channelName: string) => {
  const secret = process.env.PUSHER_APP_SECRET || ''
  const key = process.env.PUSHER_APP_KEY || ''
  const stringToSign = `${socketId}:${channelName}`
  const signature = crypto.createHmac('sha256', secret).update(stringToSign).digest('hex')
  return { auth: `${key}:${signature}` }
}
