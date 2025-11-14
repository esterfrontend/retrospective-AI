import Board, { type IBoard } from '~/models/Board'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, retroType, columns, user, admin } = body

  try {
    // Create board
    const board: IBoard = await Board.create({
      name,
      retroType,
      columns,
      admin,
      users: [],
      notes: []
    })

    // Add creator as user
    board.users.push(user);
    await board.save();

    return {
      success: true,
      message: 'Board created successfully',
      board
    }

  } catch (err) {
    console.error(err)
    throw createError({ statusCode: 500, statusMessage: 'Error creating board' })
  }
})
