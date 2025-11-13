import Board from '~/models/Board'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const boardId = query.id as string | undefined

    if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
      return { success: false, message: 'Invalid board ID' }
    }

    const board = await Board.findById(boardId)
    if (!board) {
      return { success: false, message: 'Board not found' }
    }

    return { success: true, board }

  } catch (err: any) {
    console.error('[Board GET] Error:', err)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load board' })
  }
})
