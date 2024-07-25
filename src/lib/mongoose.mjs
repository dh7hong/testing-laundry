import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Check if the connection is already established
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  // Use cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if not already created
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "laundry", // Set the database name here
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
