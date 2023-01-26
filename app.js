const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 3000;
mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb+srv://root:EoeSL7UI6Ovy5KpG@cluster0.7aauazq.mongodb.net/?retryWrites=true&w=majority",
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
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ error: "Invalid id format" });
  }
  Recipe.findByIdAndDelete(req.params.id, (err, recipe) => {
    if (err) return res.status(500).send(err);
    if (!recipe) return res.status(404).send({ error: "Recipe not found" });
    return res.status(200).send({ message: "Recipe successfully deleted" });
  });
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
