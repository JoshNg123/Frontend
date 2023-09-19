const moongoose = require("mongoose");
const Schema = moongoose.Schema;

const todoSchema = new Schema(
  {
    cryptoCode: String,
    date: Date,
    buySell: String,
    cryptoUnit: String,
  },
  { versionKey: false },
  { collection: "submittedData" }
);

const toDo = moongoose.model("submittedData", todoSchema);
module.exports = toDo;
