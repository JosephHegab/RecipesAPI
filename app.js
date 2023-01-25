const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 3000;
mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb+srv://joseph123:rV32mBRUPm.yXtY@cluster0.7pi0kvv.mongodb.net/test",
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", (error) => {
  console.log("Connected to Database");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const recipeSchema = new mongoose.Schema({
  recipeName: {
    type: String,
    required: true,
  },
  recipe: {
    type: String,
    required: true,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/recipe", (req, res) => {
  const newRecipe = new Recipe({
    recipeName: req.body.recipeName,
    recipe: req.body.recipe,
  });

  newRecipe.save((err, recipe) => {
    return res.status(201).send(recipe);
  });
});

app.get("/recipe", (req, res) => {
  Recipe.find((err, recipes) => {
    return res.send(recipes);
  });
});

app.delete("/recipe/:id", (req, res) => {
  Recipe.findByIdAndDelete(req.params.id, (err, recipe) => {
    return res.send(recipe);
  });
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
