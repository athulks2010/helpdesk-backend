import cron from 'node-cron'
import { log } from 'console'

/** Placeholder IMAP/piping runners — wire credentials from env when available */
export async function runEmailPiping() {
  if (!process.env.IMAP_HOST) {
    return { ran: false, reason: 'IMAP not configured' }
  }
  // Full IMAP sync can be expanded with imapflow; keep hook parity with Laravel cron
  return { ran: true, imported: 0 }
}

export function startCronJobs() {
  // Every 15 minutes — email piping (Laravel /cron/piping)
  cron.schedule('*/15 * * * *', async () => {
    try {
      const result = await runEmailPiping()
      log('[cron:piping]', result)
    } catch (e: any) {
      log('[cron:piping:error]', e?.message)
    }
  })
  log('Cron jobs registered')
}
