/**
 * Exportaciones del módulo de servicios
 */

// Utilidades base
export { EventEmitter } from './EventEmitter';
export { ReconnectionManager } from './ReconnectionManager';

// Configuración
export { SocketConfig } from './SocketConfig';

// Tipos
export type { ServerToClientEvents, ClientToServerEvents } from './SocketEvents';

// Servicio principal
export { socketService, SocketService } from './socket.service';
