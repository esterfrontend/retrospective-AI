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
    getNotes: (state) => state.notes,
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

    async refreshBoard(): Promise<void> {
      const { getBoardById } = useMongodbApi();
      const response = await getBoardById(this.current?._id?.toString() || "");
      if (response.success) {
        const notes = response.board?.notes as RetroNote[];
        this.setNotes(notes);
      }
    },

    setNewBoard(board: IBoard): void {
      this.current = board;
      this.setNotes(board.notes as unknown as RetroNote[]);
    },

    // TODO DELETE NOTES

    async addNote(note: RetroNote): Promise<void> {
      const { createPost } = useMongodbApi();

      if (!this.current) {
        throw new Error("No current board available");
      }

      const boardId =
        (this.current as any)?._id?.toString() || (this.current as any)?.id;

      if (!boardId) {
        throw new Error("Board ID not found");
      }

      try {
        console.log("addNote", note);
        console.log("boardId", boardId);
        await createPost(boardId, {
          content: note.content,
          userId: note.userId,
          columnId: note.columnId,
        });
        this.notes.push(note);
      } catch (error) {
        console.error("[addNote]", error);
      }
    },

    clear(): void {
      this.current = null;
      this.notes = [];
    },
  },

  persist: true,
});
