import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User", //establish relation bw user and user model cart
  },
  products: [
    {
      quantity: { type: Number, default: 1 },
      product: { type: ObjectId, ref: "product" },
    },
  ],
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
//indivisual document in cart collection
// {
//     user:"214234214-id",
//     products:[{_id:"2213123",quantity:1,product:"324534"},{_id:"2313124",quantity:3,product:"5464654"},]
// },
// {
//     user:"wrrwefwfw",
//     products:[{quantity:1,product:"3424"},{quantity:1,product:"32423"},]
// },
