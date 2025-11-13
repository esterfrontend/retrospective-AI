import { ref, unref, watch, computed } from "vue";
import type { IBoard } from "~/models/Board";

type BoardResponse = {
  success: boolean;
  board?: IBoard;
  message?: string;
};

export const useRetrospective = (boardId: string | Ref<string> | null) => {
  const retrospectiveStore = useRetrospectiveStore();
  const id = computed(() => unref(boardId));

  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const board = ref<IBoard | null>(null);

  const fetchBoard = async (): Promise<void> => {
    console.log("!!!!WTF", retrospectiveStore.hasCurrent);
    const currentId = id.value;

    if (!currentId) {
      error.value = "Board ID is required";
      board.value = null;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<BoardResponse>("/api/boards", {
        method: "GET",
        params: { id: currentId },
      });

      if (response.success && response.board) {
        board.value = response.board;
        retrospectiveStore.setCurrent(response.board);
      } else {
        board.value = null;
        error.value = response.message || "Failed to fetch board";
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Failed to fetch board";

      console.error("[useRetrospective] Error fetching board:", err);

      error.value = errorMessage;
      board.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    board,
    isLoading,
    error,
    fetchBoard,
    refresh: fetchBoard,
  };
};
