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

    clear(): void {
      this.current = null;
      this.notes = [];
    },
  },

  persist: true,
});
