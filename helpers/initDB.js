import mongoose from "mongoose";
function initDB() {
  //1a4SwzHzgR632Yh4
  if (mongoose.connections[0].readyState) {
    console.log("already connected");

    return;
  }
  // ZUFAakL2HOrxmsJu
  const url = process.env.MONGO_URI;
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("connected", () => {
    console.log("connected to mongo");
  });
  mongoose.connection.on("error", (err) => {
    console.log("not connected to mongo", err);
  });
}
export default initDB;
