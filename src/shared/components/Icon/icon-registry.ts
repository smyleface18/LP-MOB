/**
 * Registro curado de íconos de phosphor-react-native.
 *
 * IMPORTANTE: cada ícono se importa desde su subpath propio
 * (`phosphor-react-native/src/icons/<Nombre>`), NUNCA desde el entrypoint
 * principal (`phosphor-react-native`). El entrypoint principal es un barrel
 * que reexporta los ~1512 íconos de la librería con `export *`, y Metro no
 * hace tree-shaking de eso: aunque hagas `import { FireIcon } from
 * 'phosphor-react-native'`, Metro igual empaqueta los 1512 (verificado:
 * el bundle web se mantuvo en 7.82 MB con named imports del barrel, contra
 * 1.92 MB sin íconos). Importando desde el subpath de cada ícono, Metro solo
 * incluye ese archivo (chico, y typeado — no hace falta un .d.ts aparte
 * porque resuelve directo al .tsx fuente gracias a `moduleResolution:
 * "bundler"` + `customConditions: ["react-native"]` en tsconfig, que hacen
 * match con la condición "react-native" que el propio paquete expone en su
 * "exports" para `./src/icons/*`).
 *
 * Cómo agregar un ícono nuevo:
 * 1. Buscá el nombre exacto en https://phosphoricons.com (ej. "Star").
 * 2. Agregá un import desde su subpath propio:
 *    `import { StarIcon } from 'phosphor-react-native/src/icons/Star';`
 * 3. Agregalo como entrada de `iconRegistry`.
 * 4. Usalo en tu componente: <Icon name="StarIcon" />. `IconName` se
 *    actualiza solo (es `keyof typeof iconRegistry`), con autocompletado.
 *
 * No agregues íconos "por si acaso" — cada entrada nueva suma su archivo
 * individual al bundle de todos los usuarios de la app. Solo lo que el
 * proyecto usa de verdad.
 */
import { FireIcon } from 'phosphor-react-native/src/icons/Fire';
import { HeartIcon } from 'phosphor-react-native/src/icons/Heart';
import { HouseIcon } from 'phosphor-react-native/src/icons/House';
import { TrophyIcon } from 'phosphor-react-native/src/icons/Trophy';
import { PlusCircleIcon } from 'phosphor-react-native/src/icons/PlusCircle';
import { MagnifyingGlassIcon } from 'phosphor-react-native/src/icons/MagnifyingGlass';
import { SlidersIcon } from 'phosphor-react-native/src/icons/Sliders';
import { CaretDownIcon } from 'phosphor-react-native/src/icons/CaretDown';
import { ArrowCounterClockwiseIcon } from 'phosphor-react-native/src/icons/ArrowCounterClockwise';
import { CloudCheckIcon } from 'phosphor-react-native/src/icons/CloudCheck';
import { PencilSimpleIcon } from 'phosphor-react-native/src/icons/PencilSimple';
import { TrashIcon } from 'phosphor-react-native/src/icons/Trash';
import { TagIcon } from 'phosphor-react-native/src/icons/Tag';
import { InfoIcon } from 'phosphor-react-native/src/icons/Info';
import { CheckCircleIcon } from 'phosphor-react-native/src/icons/CheckCircle';
import { ArrowLeftIcon } from 'phosphor-react-native/src/icons/ArrowLeft';
import { TranslateIcon } from 'phosphor-react-native/src/icons/Translate';
import { TextAaIcon } from 'phosphor-react-native/src/icons/TextAa';
import { HeadphonesIcon } from 'phosphor-react-native/src/icons/Headphones';
import { BookOpenIcon } from 'phosphor-react-native/src/icons/BookOpen';
import { NotePencilIcon } from 'phosphor-react-native/src/icons/NotePencil';
import { MicrophoneIcon } from 'phosphor-react-native/src/icons/Microphone';
import { XIcon } from 'phosphor-react-native/src/icons/X';
import { UserIcon } from 'phosphor-react-native/src/icons/User';
import { GameControllerIcon } from 'phosphor-react-native/src/icons/GameController';
import { GridFourIcon } from 'phosphor-react-native/src/icons/GridFour';
import { QuestionIcon } from 'phosphor-react-native/src/icons/Question';

export const iconRegistry = {
  FireIcon,
  HeartIcon,
  HouseIcon,
  TrophyIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  SlidersIcon,
  CaretDownIcon,
  ArrowCounterClockwiseIcon,
  CloudCheckIcon,
  PencilSimpleIcon,
  TrashIcon,
  TagIcon,
  InfoIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  TranslateIcon,
  TextAaIcon,
  HeadphonesIcon,
  BookOpenIcon,
  NotePencilIcon,
  MicrophoneIcon,
  XIcon,
  UserIcon,
  GameControllerIcon,
  GridFourIcon,
  QuestionIcon,
} as const;

export type IconName = keyof typeof iconRegistry;
