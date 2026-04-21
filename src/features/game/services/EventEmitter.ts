/**
 * EventEmitter genérico y reutilizable
 * Patrón Observer con tipos seguros (TypeScript)
 */

type EventCallback<T = any> = (data: T) => void;

interface EventMap {
  [key: string]: any;
}

export class EventEmitter<Events extends EventMap = EventMap> {
  private listeners: Map<keyof Events, EventCallback[]> = new Map();

  /**
   * Suscribirse a un evento
   * @param event - Nombre del evento
   * @param callback - Función a ejecutar cuando ocurra el evento
   */
  on<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Desuscribirse de un evento
   * @param event - Nombre del evento
   * @param callback - Función a remover
   */
  off<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>
  ): void {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return;

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Suscribirse a un evento una sola vez
   * @param event - Nombre del evento
   * @param callback - Función a ejecutar
   */
  once<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>
  ): void {
    const wrappedCallback = (data: Events[K]) => {
      callback(data);
      this.off(event, wrappedCallback);
    };
    this.on(event, wrappedCallback);
  }

  /**
   * Emitir un evento a todos los suscriptores
   * @param event - Nombre del evento
   * @param data - Datos a pasar a los callbacks
   */
  protected emit<K extends keyof Events>(
    event: K,
    data?: Events[K]
  ): void {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return;

    callbacks.forEach((callback) => {
      try {
        callback(data as Events[K]);
      } catch (error) {
        console.error(`Error in event listener for "${String(event)}":`, error);
      }
    });
  }

  /**
   * Remover todos los listeners
   */
  destroy(): void {
    this.listeners.clear();
  }
}
