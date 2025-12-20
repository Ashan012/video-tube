import mongoose from "mongoose";

const connection = {};

export async function dbconnect() {
  if (connection.isConnected) {
    console.log("DB is already connected!!!!");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    connection.isConnected = db.connections[0].readyState;
    console.log("database uri", db.connection.host);
  } catch (error) {
    console.error(error);
    console.log("DB CONNECTION FAILED");
    process.exit(1);
  }
}
