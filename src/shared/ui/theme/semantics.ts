import { colors, withAlpha } from './primitives';

export interface ColorTheme {
  /**
   * Color principal de marca (rojo). Úsalo para:
   * - CTAs primarios (botón "Continuar", "Empezar lección")
   * - Elementos que requieren máxima atención del usuario
   * - Iconos activos/seleccionados en navegación
   * NO lo uses en: superficies grandes (fondos de pantalla completa),
   * texto largo, o más de 1-2 elementos por pantalla — pierde su
   * jerarquía si se satura la UI de rojo.
   */
  primary: string;

  /**
   * Estado "presionado" de primary. Úsalo SOLO en el evento táctil
   * (onPressIn / active state) de botones y elementos con primary.
   * Da feedback físico de que el tap fue registrado.
   */
  primaryPressed: string;

  /**
   * Versión tenue del rojo para fondos, nunca para texto ni iconos.
   * Úsalo para:
   * - Fondo de badges/chips ("Nuevo", "3 días de racha en riesgo")
   * - Banners de alerta suave (no error crítico, solo aviso)
   * - Estado "seleccionado" de una card sin usar borde sólido
   * NO lo uses como fondo de botón — se confunde con estado disabled.
   */
  primarySubtle: string;

  /**
   * Naranja de marca. Acción secundaria, complementa al rojo sin
   * competir con él. Úsalo para:
   * - Botones secundarios ("Omitir", "Más tarde") junto a un primary
   * - Iconos de categoría (ej. sección "Pronunciación")
   * - Elementos de energía/motivación que no son el CTA principal
   */
  secondary: string;

  /**
   * Versión tenue del naranja. Mismo uso que primarySubtle pero
   * para contexto secundario: fondos de tags de categoría,
   * highlights suaves en listas.
   */
  secondarySubtle: string;

  secondaryButton: string; // uso específico: fondo de botones sólidos con texto blanco encima

  /**
   * Amarillo — reservado EXCLUSIVAMENTE para gamificación:
   * - Racha de días (streak)
   * - XP / puntos ganados
   * - Insignias y logros desbloqueados
   * - Estrellas de calificación
   * No lo uses para botones ni navegación — si se usa fuera de
   * gamificación, el usuario deja de asociarlo con "logro/recompensa".
   */
  accent: string;

  /** Fondo tenue de accent. Úsalo detrás de badges de logros o
   * contadores de racha cuando necesites un chip, no solo el ícono. */
  accentSubtle: string;

  /**
   * Verde semántico de éxito. Úsalo SOLO para estado, nunca como
   * color decorativo:
   * - Respuesta correcta en un ejercicio
   * - Confirmación de acción completada (checkmarks, toasts de éxito)
   * - Progreso completado (barra de progreso al 100%)
   */
  success: string;

  /** Fondo tenue de success: fondo de la card de "¡Correcto!",
   * fondo de toast de confirmación. */
  successSubtle: string;

  /**
   * Fondo base de toda pantalla (el más externo, detrás de todo).
   * Nunca le pongas texto directamente encima sin pasar antes por
   * `surface` — está pensado como lienzo, no como superficie de contenido.
   */
  background: string;

  /**
   * Superficie de contenido: cards, inputs, list items, tab bars.
   * Es un nivel de elevación por encima de `background`. Úsalo en
   * cualquier contenedor rectangular que agrupe contenido.
   */
  surface: string;

  /**
   * Segundo nivel de elevación, por encima de `surface`. Úsalo para
   * elementos que "flotan" sobre el contenido normal:
   * - Modales, bottom sheets, dropdowns, tooltips
   * - Cualquier cosa con sombra que deba distinguirse de las cards normales
   */
  surfaceElevated: string;

  /**
   * Líneas divisorias y bordes sutiles: separadores de lista,
   * borde de inputs sin foco, contorno de cards planas.
   * Nunca lo uses para bordes de énfasis (usa primary o accent para eso).
   */
  border: string;

  /** Texto principal: títulos, cuerpo de texto, labels importantes.
   * Es el color de texto por defecto — úsalo salvo que tengas una
   * razón específica para usar textSecondary o textInverse. */
  textPrimary: string;

  /** Texto de menor jerarquía: subtítulos, timestamps, placeholders,
   * captions, metadata ("hace 2 días", "12 palabras"). */
  textSecondary: string;

  /**
   * Texto que va ENCIMA de superficies de color sólido (botones
   * primary/secondary, badges de accent). El nombre es por función,
   * no por color fijo: en light es claro sobre fondo oscuro-saturado,
   * en dark se invierte según el fondo que reciba (ver uso en accent).
   */
  textInverse: string;

  /** Fondo semitransparente detrás de modales/sheets para oscurecer
   * el contenido de atrás y dirigir el foco. Nunca uses esto como
   * fondo de un componente normal — es solo para overlays. */
  overlay: string;

  /** Texto sobre botón/superficie primary (rojo). Constante en ambos
   * themes porque primary no cambia entre light/dark. */
  onPrimary: string;

  /** Texto sobre botón/superficie secondary (naranja). Igual razón. */
  onSecondary: string;

  /** Texto sobre superficie accent (amarillo) — necesita oscuro
   * porque el amarillo es un color claro, sin importar el theme. */
  onAccent: string;

  /** Texto sobre superficie success (verde). */
  onSuccess: string;

  /** Texto placeholder en inputs. Más tenue que textSecondary a propósito:
   * es una pista, no contenido real. Nunca lo uses para texto que el
   * usuario deba leer como información válida. */
  textPlaceholder: string;

  /** Color de error para íconos, bordes de input inválido, fondos subtle.
   * Deliberadamente distinto del rojo de marca (primary) para no
   * confundir "acción" con "error". */
  error: string;
  errorSubtle: string;
  onError: string; // texto sobre botón/superficie sólida de error
  onErrorSubtle: string; // texto sobre fondo subtle de error (chips, banners)

  /** Texto de mensajes de error inline (debajo de un input, por ejemplo).
   * Es más oscuro/saturado que `error` a propósito: un ícono de error
   * solo necesita 3:1 de contraste (elemento gráfico), pero texto de
   * error necesita 4.5:1 — por eso son dos tokens distintos. */
  textError: string;
}

export const lightColors: ColorTheme = {
  primary: colors.brand.red,
  primaryPressed: colors.brand.redDark,
  primarySubtle: colors.brand.redLight,

  secondary: colors.brand.orange,
  secondarySubtle: colors.brand.orangeLight,
  secondaryButton: colors.brand.orangeStrong,

  accent: colors.brand.yellow,
  accentSubtle: colors.brand.yellowLight,

  success: colors.brand.green,
  successSubtle: colors.brand.greenLight,

  background: colors.neutral.white,
  surface: colors.neutral.white,
  surfaceElevated: colors.neutral.white,

  border: withAlpha(colors.brand.black, 0.08),
  textPrimary: colors.brand.black,
  textSecondary: colors.neutral.gray,
  textInverse: colors.neutral.white,

  overlay: withAlpha(colors.brand.black, 0.5),

  onPrimary: colors.neutral.white,
  onSecondary: colors.neutral.white,
  onAccent: colors.brand.black,
  onSuccess: colors.neutral.white,

  textPlaceholder: colors.neutral.grayLight,

  error: colors.danger.base,
  errorSubtle: colors.danger.light,
  onError: colors.neutral.white,
  onErrorSubtle: colors.danger.dark,
  textError: colors.danger.dark,
};

export const darkColors: ColorTheme = {
  primary: colors.brand.red,
  primaryPressed: colors.brand.redDark,
  primarySubtle: withAlpha(colors.brand.red, 0.16),

  secondary: colors.brand.orange,
  secondarySubtle: withAlpha(colors.brand.orange, 0.16),
  secondaryButton: colors.brand.orangeStrong,

  accent: colors.brand.yellow,
  accentSubtle: withAlpha(colors.brand.yellow, 0.16),

  success: colors.brand.green,
  successSubtle: withAlpha(colors.brand.green, 0.16),

  background: colors.surfaceDark.base,
  surface: colors.surfaceDark.raised,
  surfaceElevated: colors.surfaceDark.overlay2,

  border: withAlpha(colors.neutral.white, 0.12),
  textPrimary: colors.neutral.white,
  textSecondary: colors.neutral.gray,
  textInverse: colors.brand.black,

  overlay: withAlpha('#000000', 0.65),

  onPrimary: colors.neutral.white,
  onSecondary: colors.neutral.white,
  onAccent: colors.brand.black,
  onSuccess: colors.neutral.white,

  textPlaceholder: withAlpha(colors.neutral.white, 0.35),

  error: colors.danger.base,
  errorSubtle: withAlpha(colors.danger.base, 0.16),
  onError: colors.neutral.white,
  onErrorSubtle: '#FDA4AF',
  textError: '#FB7185',
};
