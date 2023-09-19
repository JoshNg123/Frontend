const submittedDataModel = require("./model.js");
const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
const { restart } = require("nodemon");
const port = 5000;

const dbURI =
  "mongodb+srv://JoshNg123:Josh171202@cluster0.osxnq15.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(port);
    console.log(`Server is listening on port ${port}`);
  })
  .catch((err) => console.log(err));

app.post("/MyPortfolio", async (req, res) => {
  try {
    const newItem = req.body;
    const createdItem = await submittedDataModel.create(newItem);
    res.status(201).send("Item created");
  } catch (err) {
    console.log(err);
  }
});

app.get("/MyPortfolio", async (req, res) => {
  try {
    const data = await submittedDataModel.find();
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});
