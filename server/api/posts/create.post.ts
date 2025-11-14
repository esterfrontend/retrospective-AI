import { nanoid } from 'nanoid'
import mongoose from 'mongoose'
import Board from '~/models/Board'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { boardId, note } = body

    console.log('[Board Create Note] Received:', { boardId, note })

    if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
        console.error('[Board Create Note] Invalid boardId:', boardId)
        return { success: false, message: 'Invalid retrospective ID' }
    }

    if (!note) {
        console.error('[Board Create Note] Note is missing')
        return { success: false, message: 'Note data is required' }
    }

    if (!note.columnId || !note.userId || !note.content) {
        console.error('[Board Create Note] Missing required fields:', note)
        return { success: false, message: 'Missing required note fields (columnId, userId, content)' }
    }

    const board = await Board.findById(boardId)
    if (!board) {
        console.error('[Board Create Note] Board not found:', boardId)
        return { success: false, message: 'Board not found' }
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
    console.error('[Board Create Note] Error stack:', err.stack)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Failed to create note'
    })
  }
})
