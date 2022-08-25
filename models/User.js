import mongoose from "mongoose";
//in database various fields were stored..
const userSchema = new mongoose.Schema(
  {
    //passing the various object

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "admin", "root"],
    },
  },
  {
    timestamps: true, //in collection created and updated field will add
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
