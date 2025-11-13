import Board, { type IBoard } from '~/models/Board'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  const boardId = event.context.params.id

  if (!mongoose.Types.ObjectId.isValid(boardId))
    throw createError({ statusCode: 400, statusMessage: 'Invalid board ID' })

  const board: IBoard | null = await Board.findById(boardId)
    .populate('users', 'name email')
    .populate('admin', 'name email')
    .lean()

  if (!board)
    throw createError({ statusCode: 404, statusMessage: 'Board not found' })

  return board
})
