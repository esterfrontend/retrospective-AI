import { nanoid } from 'nanoid'
import mongoose from 'mongoose'
import Board from '~/models/Board'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { boardId, note } = body

    if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
        return { success: false, message: 'Invalid retrospective ID' }
    }

    const board = await Board.findById(boardId)
    if (!board) {
        return { success: false, message: 'Invalid retrospective ID' }
    }

    
    const newNote = {
      id: nanoid(),
      columnId: note.columnId,
      userId: note.userId,
      content: note.content,
      createdAt: new Date()
    }

    board.notes.push(newNote)
    await board.save()

    return {
      success: true,
      message: 'Note added successfully',
      note: newNote,
      board
    }
  } catch (err: any) {
    console.error('[Board Create Note] Error:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Failed to create note'
    })
  }
})
