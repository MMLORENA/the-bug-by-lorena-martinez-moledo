import type { Document } from "mongoose";
import mongoose from "mongoose";
import { environment } from "../environment/loadEnvironments.js";

const connectDatabase = async (mongoDbUrl: string) => {
  mongoose.set("strictQuery", false);
  mongoose.set("debug", environment.mongoDbDebug);
  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret: Document) {
      delete ret._id;
      delete ret.__v;

      return ret;
    },
  });

  await mongoose.connect(mongoDbUrl);
};

export default connectDatabase;
