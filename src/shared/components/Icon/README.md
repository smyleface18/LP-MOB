# Icon

Wrapper themeado sobre [phosphor-react-native](https://github.com/phosphor-icons/react-native).
Todos los tamaños y colores salen de `useTheme()` por defecto — nunca hardcodees
un color o tamaño de ícono en una pantalla si el default del theme sirve.

## Reglas de `weight`

- **`regular`** (default): navegación, íconos de UI en general.
- **`bold`** o **`fill`**: estados activos/seleccionados (tab activo, opción
  marcada). Elegí uno de los dos por pantalla/contexto y no lo mezcles con el
  otro para el mismo tipo de elemento sin una razón concreta — dos íconos
  "activos" con weights distintos en la misma pantalla se lee como
  inconsistencia visual, no como intención.
- **`duotone`**: reservado EXCLUSIVAMENTE para elementos de gamificación
  (racha, trofeos, XP, logros, insignias). En estos casos `accentColor` debe
  ser `theme.color.accent` (el amarillo de marca, ya es el default del
  componente) — nunca otro color. Usar duotone fuera de gamificación rompe la
  asociación visual "amarillo duotone = logro/recompensa" en toda la app.

## Uso

```tsx
import { Icon } from '@/shared/components/Icon';

// UI estándar
<Icon name="HouseIcon" />

// Tab activo
<Icon name="HouseIcon" weight="fill" color={theme.color.primary} />

// Gamificación (racha) — duotone + accentColor amarillo
<Icon name="FireIcon" size="lg" weight="duotone" />
```

`name` autocompleta contra `iconRegistry` (`icon-registry.ts`, en esta misma
carpeta) — un subset curado, NO todos los íconos de phosphor-react-native.
`size` acepta un key de `theme.iconSize` (`sm | md | lg | xl`) o un número.

## Agregar un ícono nuevo

`iconRegistry` existe para que el bundle solo cargue los íconos que la app
realmente usa (ver el comment-block en `icon-registry.ts` para el por qué:
importar desde el entrypoint principal de phosphor-react-native, aunque sea
con named imports, infla el bundle web de ~1.9 MB a ~7.8 MB porque Metro no
tree-shakea su barrel de 1512 íconos).

Si necesitás un ícono que no está en el registro:

1. Buscá el nombre exacto en [phosphoricons.com](https://phosphoricons.com)
   (ej. "Star").
2. En `icon-registry.ts`, agregá el import desde el **subpath propio del
   ícono** (nunca desde `'phosphor-react-native'` a secas):
   ```ts
   import { StarIcon } from 'phosphor-react-native/src/icons/Star';
   ```
3. Sumalo al objeto `iconRegistry`.
4. Usalo: `<Icon name="StarIcon" />` — `IconName` se actualiza solo.

No agregues íconos que no vayas a usar todavía — cada uno que sumás queda en
el bundle de toda la app.
