import { useCallback, useMemo, useState } from 'react';
import { PanelEditorProps } from '../../components/PanelEditor';
import { CharacterSheet, DraftInput, MyTurn, StoryCharacter, StoryRules } from '../../types';
import { StoryGameHook } from '../../hooks/useStoryGame';

// Si todavía no llegaron las reglas del servidor (no debería pasar en un turno).
const FALLBACK_LIMITS: PanelEditorProps['limits'] = {
  minWords: 8,
  maxChars: 320,
  maxSceneChars: 200,
  characters: {
    maxPerPanel: 3,
    maxNewPerPanel: 2,
    maxPerStory: 6,
    fields: { name: 30, kind: 30, description: 100 },
  },
};

const EMPTY_DRAFT: DraftInput = { text: '', scene: '', characterIds: [], newCharacters: [] };

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const sameDraft = (a: DraftInput, b: DraftInput) =>
  a.text.trim() === b.text.trim() &&
  a.scene.trim() === b.scene.trim() &&
  [...a.characterIds].sort().join() === [...b.characterIds].sort().join() &&
  JSON.stringify(a.newCharacters) === JSON.stringify(b.newCharacters);

const limitsFrom = (rules: StoryRules | null): PanelEditorProps['limits'] =>
  rules
    ? {
        minWords: rules.draft.minWords,
        maxChars: rules.draft.maxChars,
        maxSceneChars: rules.draft.maxSceneChars,
        characters: {
          maxPerPanel: rules.characters.maxPerPanel,
          maxNewPerPanel: rules.characters.maxNewPerPanel,
          maxPerStory: rules.characters.maxPerStory,
          fields: rules.characters.limits,
        },
      }
    : FALLBACK_LIMITS;

interface UseStoryDraftParams {
  turnOrder: number | null;
  myTurn: MyTurn | null;
  cast: StoryCharacter[];
  rules: StoryRules | null;
  lastReview: StoryGameHook['state']['lastReview'];
  pending: StoryGameHook['state']['pending'];
  timeLeft: number;
  submitDraft: StoryGameHook['actions']['submitDraft'];
  confirmPanel: StoryGameHook['actions']['confirmPanel'];
}

/**
 * Estado del editor de la viñeta del autor. Empieza vacío en cada turno, o
 * con el último borrador si el jugador se reconectó a mitad de su turno.
 * Devuelve las props de PanelEditor, o null si el jugador no es el autor.
 */
export const useStoryDraft = ({
  turnOrder,
  myTurn,
  cast,
  rules,
  lastReview,
  pending,
  timeLeft,
  submitDraft,
  confirmPanel,
}: UseStoryDraftParams): PanelEditorProps | null => {
  const [draft, setDraft] = useState<DraftInput>(EMPTY_DRAFT);
  const [draftTurn, setDraftTurn] = useState<number | null>(null);
  const lastDraft = myTurn?.drafts.at(-1) ?? null;

  // Turno nuevo: editor limpio (o el último borrador, al reconectarse). Se
  // ajusta durante el render (patrón de React para derivar estado de props),
  // así nunca se ve un render con el texto del turno anterior.
  if (turnOrder !== draftTurn) {
    setDraftTurn(turnOrder);
    setDraft(
      lastDraft
        ? {
            text: lastDraft.text,
            scene: lastDraft.scene,
            characterIds: lastDraft.characterIds,
            newCharacters: lastDraft.newCharacters,
          }
        : EMPTY_DRAFT,
    );
  }

  const limits = useMemo(() => limitsFrom(rules), [rules]);
  const wordCount = countWords(draft.text);

  const validationError = !draft.scene.trim()
    ? 'Describe the scene where your panel happens.'
    : wordCount < limits.minWords
      ? `Write at least ${limits.minWords} words.`
      : null;

  const isDirty = lastDraft ? !sameDraft(draft, lastDraft) : true;

  const onTextChange = useCallback((text: string) => setDraft((prev) => ({ ...prev, text })), []);
  const onSceneChange = useCallback(
    (scene: string) => setDraft((prev) => ({ ...prev, scene })),
    [],
  );
  const onToggleCharacter = useCallback(
    (id: string) =>
      setDraft((prev) => ({
        ...prev,
        characterIds: prev.characterIds.includes(id)
          ? prev.characterIds.filter((x) => x !== id)
          : [...prev.characterIds, id],
      })),
    [],
  );
  const onAddCharacter = useCallback(
    (character: CharacterSheet) =>
      setDraft((prev) => ({ ...prev, newCharacters: [...prev.newCharacters, character] })),
    [],
  );
  const onRemoveCharacter = useCallback(
    (index: number) =>
      setDraft((prev) => ({
        ...prev,
        newCharacters: prev.newCharacters.filter((_, i) => i !== index),
      })),
    [],
  );

  const onSubmit = useCallback(() => {
    void submitDraft({
      text: draft.text.trim(),
      scene: draft.scene.trim(),
      characterIds: draft.characterIds,
      newCharacters: draft.newCharacters,
    });
  }, [draft, submitDraft]);

  const onConfirm = useCallback(() => void confirmPanel(), [confirmPanel]);

  if (!myTurn || turnOrder === null) return null;

  return {
    ...draft,
    cast,
    limits,
    onTextChange,
    onSceneChange,
    onToggleCharacter,
    onAddCharacter,
    onRemoveCharacter,
    lastReview: lastReview?.panelOrder === turnOrder ? lastReview : null,
    attemptsLeft: myTurn.attemptsLeft,
    hasDraft: myTurn.drafts.length > 0,
    isDirty,
    reviewing: myTurn.reviewing || pending === 'submit',
    confirming: pending === 'confirm',
    validationError,
    wordCount,
    timeUp: timeLeft <= 0,
    onSubmit,
    onConfirm,
  };
};
