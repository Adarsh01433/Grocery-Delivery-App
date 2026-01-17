import mongoose from 'mongoose'

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('✅ DB Connected')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1) // 🔥 MANDATORY
  }
}
