import mongoose from 'mongoose'

export const conncectDB = async ()=>{
    try {

        mongoose.connection.on('connected',()=>{
            console.log('Database connected')
        })
        await mongoose.connect(`${process.env.MONGODB_URI}whisper_chat`)
    } catch (error) {
        console.log(error)
    }
}