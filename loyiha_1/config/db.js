const mongoose = require('mongoose')

const connectDB = async () => {
    mongoose.set('strictQuery', false)
    
    const connecting = await mongoose.connect(process.env.MONGO_URI)
    
    console.log(`mongodb set to : ${connecting.connection.host}`.blue)
}

module.exports = connectDB