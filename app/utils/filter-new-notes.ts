import type { RetroNote } from "~/models/retrospective";

export function filterNewNotes(
  newNotes: RetroNote[],
  existingNotes: RetroNote[]
): RetroNote[] {
  if (!newNotes || newNotes.length === 0) return [];

  const existingNoteIds = new Set(existingNotes.map((note) => note.id));
  const trulyNewNotes = newNotes.filter(
    (storeNote) => !existingNoteIds.has(storeNote.id)
  );

  return trulyNewNotes;
}
