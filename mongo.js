import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.error(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));

const mongooseConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

mongooseConnection();

export default mongooseConnection;