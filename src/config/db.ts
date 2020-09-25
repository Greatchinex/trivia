// @ts-ignore
import mongoose from "mongoose";
import bluebird from "bluebird";
import dotenv from "dotenv";

dotenv.config();

(<any>mongoose).Promise = bluebird;

try {
  mongoose.connect(process.env.DB_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch (err) {
  throw err;
}

// Message if Successfully Connected to DB
mongoose.connection.on("connected", () => {
  console.log(`Connected to database ${process.env.DB_URL}`);
});

// Message if There is an error in database Connection
mongoose.connection.on("error", (err: any) => {
  throw err;
});

// To Remove moongoose depreciation warnings
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
