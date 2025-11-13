import { defineStore } from "pinia";
import type { IBoard } from "~/models/Board";
import type { RetroNote } from "~/models/retrospective";

export const useRetrospectiveStore = defineStore("retrospective", {
  state: () => {
    return {
      current: null as IBoard | null,
      notes: [] as RetroNote[],
    };
  },

  getters: {
    hasCurrent: (state) => state.current !== null,
    hasNotes: (state) => state.notes.length > 0,
  },

  actions: {
    setCurrent(data: IBoard): void {
      this.current = data;
    },

    setNotes(notes: RetroNote[]): void {
      this.notes = notes;
    },

    async fetchBoard(boardId: string): Promise<void> {
      const { getBoardById } = useMongodbApi();
      const response = await getBoardById(boardId);
      if (response.success) {
        this.setCurrent(response.board as unknown as IBoard);
      }
    },

    async addNote(note: RetroNote): Promise<void> {
      const { createPost } = useMongodbApi();
      const response = await createPost(this.current?.id as string, note);
      if (response.success) {
        this.notes.push(response.note as unknown as RetroNote);
      }
    },

    clear(): void {
      this.current = null;
      this.notes = [];
    },
  },

  persist: true,
});
