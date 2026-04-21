/**
 * Gestor de reconexión con exponential backoff
 * Responsabilidad única: manejar lógica de reconexión
 */

interface ReconnectionConfig {
  maxAttempts: number;
  baseDelay: number; // ms
  maxDelay: number; // ms
}

export class ReconnectionManager {
  private attempts = 0;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private config: ReconnectionConfig;

  constructor(config: Partial<ReconnectionConfig> = {}) {
    this.config = {
      maxAttempts: config.maxAttempts ?? 5,
      baseDelay: config.baseDelay ?? 1000,
      maxDelay: config.maxDelay ?? 10000,
    };
  }

  /**
   * Calcular el delay usando exponential backoff
   */
  private calculateDelay(): number {
    const delay = Math.min(
      this.config.baseDelay * Math.pow(2, this.attempts),
      this.config.maxDelay
    );
    return delay;
  }

  /**
   * Obtener el siguiente delay de reconexión
   */
  getNextDelay(): number | null {
    if (this.hasReachedMaxAttempts()) {
      return null;
    }
    return this.calculateDelay();
  }

  /**
   * Incrementar intento de reconexión
   */
  recordAttempt(): void {
    this.attempts++;
  }

  /**
   * Verificar si se alcanzaron los máximos intentos
   */
  hasReachedMaxAttempts(): boolean {
    return this.attempts >= this.config.maxAttempts;
  }

  /**
   * Obtener número de intentos actuales
   */
  getAttemptCount(): number {
    return this.attempts;
  }

  /**
   * Resetear el contador
   */
  reset(): void {
    this.attempts = 0;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Programar una reconexión
   */
  scheduleReconnection(
    onReconnect: () => void,
    isConnected: () => boolean
  ): void {
    if (this.hasReachedMaxAttempts()) {
      return;
    }

    const delay = this.calculateDelay();
    this.timeoutId = setTimeout(() => {
      if (!isConnected()) {
        this.recordAttempt();
        onReconnect();
      }
    }, delay);
  }

  /**
   * Limpiar recursos
   */
  destroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
