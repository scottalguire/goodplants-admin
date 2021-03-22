var express = require("express");
var router = express.Router();
const { getPlantsJSON, updatePlantsJSON } = require("../utils");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "goodplants Admin" });
});

router.delete("/delete/:id", function (req, res, next) {
  if (!req.params.id) res.status(403).send({ message: "An id must be provided to delete a plant." });

  getPlantsJSON().then((json) => {
    const matchIndex = json.findIndex((plant) => plant.id === parseInt(req.params.id));

    if (matchIndex === -1) {
      res.status(404).send({ message: "A plant with that id was not found." });
      return;
    }

    const newJson = [...json];
    newJson.splice(matchIndex, 1);

    updatePlantsJSON(newJson).then(() => {
      res.status(201).send({ message: "Plant successfully deleted" });
    });
  });
});

router.patch("/update/:id", function (req, res, next) {
  if (!req.params.id) res.status(403).send({ message: "An id must be provided to delete a plant." });

  getPlantsJSON().then((json) => {
    const matchIndex = json.findIndex((plant) => plant.id === parseInt(req.params.id));

    if (matchIndex === -1) {
      res.status(404).send({ message: "A plant with that id was not found." });
      return;
    }

    const {
      plant_name,
      description,
      price,
      family,
      genus,
      categories,
      care,
      scientific_name,
      image_url,
      image_alt,
    } = req.body;

    const currentPlant = json[matchIndex];

    const newPlant = {
      id: currentPlant.id,
      price: price || currentPlant.price,
      name: plant_name || currentPlant.name,
      description: description || currentPlant.description,
      scientific_name: scientific_name || currentPlant.scientific_name,
      family: family || currentPlant.family,
      genus: genus || currentPlant.genus,
      categories: (categories && categories.split(",").map((c) => c.trim())) || currentPlant.categories,
      care: (care && care.split(",").map((c) => c.trim())) || currentPlant.care,
      image: { url: image_url || currentPlant.image.url, alt: image_alt || currentPlant.image.alt },
    };

    const newJson = [...json];
    newJson[matchIndex] = newPlant;

    updatePlantsJSON(newJson).then(() => {
      res.status(201).send(newPlant);
    });
  });
});

router.post("/create", function (req, res, next) {
  getPlantsJSON().then((json) => {
    const {
      plant_name,
      description,
      price,
      family,
      genus,
      categories,
      care,
      scientific_name,
      image_url,
      image_alt,
    } = req.body;

    const plant = {
      id: json.length + 1,
      price: price || "",
      name: plant_name || "",
      description: description || "",
      scientific_name: scientific_name || "",
      family: family || "",
      genus: genus || "",
      categories: (categories && categories.split(",").map((c) => c.trim())) || [],
      care: (care && care.split(",").map((c) => c.trim())) || [],
      image: { url: image_url || "", alt: image_alt || "" },
    };

    const dataModified = [...json, plant];

    updatePlantsJSON(dataModified).then(() => {
      res.status(201).send(plant);
    });
  });
});

module.exports = router;
