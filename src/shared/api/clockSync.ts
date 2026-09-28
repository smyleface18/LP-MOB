import type { Socket } from 'socket.io-client';

const CLOCK_SYNC_SAMPLES = 5;
const CLOCK_SYNC_TIMEOUT_MS = 2_000;

/**
 * Estima el offset con el servidor (serverTime - Date.now() local) con el
 * algoritmo de Cristian, como un NTP simplificado: por cada muestra, offset =
 * serverTime - punto medio del viaje. Se queda con la de menor RTT, que es la
 * de menor error posible. El servidor responde el evento `timeSync` con
 * `{ serverTime }` por el ack (namespaces /game y /story).
 *
 * Devuelve null si no hubo ninguna muestra válida (socket caído o timeouts).
 */
export async function estimateClockOffset(socket: Socket): Promise<number | null> {
  let best: { rtt: number; offset: number } | null = null;

  for (let i = 0; i < CLOCK_SYNC_SAMPLES; i++) {
    if (!socket.connected) break;
    try {
      const sentAt = Date.now();
      const { serverTime } = (await socket
        .timeout(CLOCK_SYNC_TIMEOUT_MS)
        .emitWithAck('timeSync')) as { serverTime: number };
      const receivedAt = Date.now();
      const rtt = receivedAt - sentAt;
      const offset = serverTime - (sentAt + receivedAt) / 2;
      if (!best || rtt < best.rtt) best = { rtt, offset };
    } catch {
      // Muestra perdida (timeout): se usan las demás.
    }
  }

  return best?.offset ?? null;
}
