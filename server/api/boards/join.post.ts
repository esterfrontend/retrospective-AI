import Board from '~/models/Board'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
    const { id, user } = body

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, message: 'Invalid retrospective ID' }
      }
  
      const board = await Board.findById(id)
      if (!board) {
        return { success: false, message: 'Invalid retrospective ID' }
      }
  
      const exists = board.users.find((u: any) => u.email === user.email)
      if (!exists) {
        board.users.push({ name: user.name, email: user.email })
        await board.save()
      }
  
      return { success: true, board }
  
    } catch (err: any) {
      console.error('[Board Join] Error:', err)
      throw createError({ statusCode: err.statusCode || 500, statusMessage: err.message || 'Internal Server Error' })
    }
})

