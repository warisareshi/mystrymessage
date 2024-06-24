import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

export const connectDB = async () => {
  if (connection.isConnected) {
    // in case the connection is already established
    console.log("DB is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(
      (process.env.MONGODB_URI as string) || ""
    );
    // now set the connection.isConnected property to true
    connection.isConnected = db.connections[0].readyState;
    // give the confirmation message
    console.log("Database is connected successfully");
  } catch (err) {
    console.log("Database Connection Error", err);
    // if the connection fails, exit the process 
    process.exit(1);
  }
};
