export const useMongodbApi = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createBoard = async (data: any) => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch('/api/boards/create', {
        method: 'POST',
        body: {
          name: data.name || 'Untitled Retrospective',
          retoType: data.retoType || 'columns',
          columns: data.columns ? [...data.columns] : [],
          user: data.user,
        },
      })
      return res
    } catch (err: any) {
      console.error('[useMongodbApi:createBoard]', err)
      error.value = err?.statusMessage || 'Error creating board'
      throw err
    }
  }

  const joinBoard = async (boardId: string, user: { name: string; email: string }) => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch('/api/boards/join', {
        method: 'POST',
        body: { id: boardId, user },
      })
      return res
    } catch (err: any) {
      console.error('[useMongodbApi:joinBoard]', err)
      error.value = err?.statusMessage || 'Error joining board'
      throw err
    }
  }

  const getBoardById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch('/api/boards', {
        method: 'GET',
        params: { id },
      })
      return res
    } catch (err: any) {
      console.error('[useMongodbApi:getBoardById]', err)
      error.value = err?.statusMessage || 'Error fetching board'
      throw err
    }
  }

  const createPost = async (boardId: string, note: {
    content: string
    userId: string
    columnId: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch('/api/posts/create', {
        method: 'POST',
        body: { boardId, note },
      })
      return res
    } catch (err: any) {
      console.error('[useMongodbApi:createPost]', err)
      error.value = err?.statusMessage || 'Error creating post'
      throw err
    }
  }

  return {
    loading,
    error,
    createBoard,
    joinBoard,
    getBoardById,
    createPost,
  }
}
