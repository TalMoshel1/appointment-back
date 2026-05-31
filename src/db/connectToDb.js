import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

async function connectToDb() {

  const MONGODB_PASSWORD= process.env.MONGODB_PASSWORD
  const cluster_user= process.env.cluster_user


    try {
      await mongoose.connect(`mongodb+srv://${cluster_user}:${MONGODB_PASSWORD}@cluster0.c7gwjly.mongodb.net/?appName=Cluster0`)
      .then((res)=>{
        console.log('connected to DB!')
        return res
      })
    } catch (error) {
      return Promise.reject(new Error(error))
    }
  }


export default connectToDb