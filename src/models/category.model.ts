import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    //   slug: {
    //     type: String,
    //     required: true,
    //     index: true,
    //   },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
