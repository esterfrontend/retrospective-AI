import mongoose from 'mongoose'

export default defineNuxtPlugin(async (nuxtApp) => {
  const uri = process.env.MONGODB_URI

  console.warn('🟣 DB connected 🟣')

  if (!uri) {
    console.warn('[MongoDB] URI not found, skipping connection')
    return
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri)
      console.info('[MongoDB] Connected successfully')
    } else {
      console.info('[MongoDB] Already connected')
    }

    nuxtApp.provide('mongoose', mongoose)
  } catch (e) {
    console.error('[MongoDB] Connection error:', e)
  }
})
