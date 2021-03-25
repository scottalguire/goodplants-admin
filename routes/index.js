var express = require("express");
var router = express.Router();
const getPlantsJSON = require("../utils").getPlantsJSON;

/* GET home page. */
router.get("/", function (req, res, next) {
  getPlantsJSON()
    .then((json) => {
      //"https://stage.getedealer.com/retail/39-qc4EqQtmYstAm7N_frQ?
      // type=VEHICLE&
      // status[0]=FOR_SALE&
      // status[1]=DRAFT&
      // archived=false&
      // sort[0][id]=customersCount&
      // sort[0][sortDirection]=DESCENDING"

      // format: queryType[index][key]=[value]
      // example: sort[0][id]=price&sort[0][direction]=ASCENDING
      // req.query = {
      //   sort: [
      //     {
      //       id: "price",
      //       direction: "ASCENDING",
      //     },
      //   ],
      // };

      console.log(req.query);

      const sorter = (arr, key, direction = "DESCENDING") =>
        arr.sort((a, b) => {
          if (direction === "DESCENDING") {
            return a[key] > b[key] ? 1 : -1;
          } else {
            return a[key] < b[key] ? 1 : -1;
          }
        });

      const sort = req.query && req.query.sort;

      if (sort) {
        sort.forEach((sortObject) => {
          if (!sortObject.id) return;

          switch (sortObject.id) {
            case "id":
              sorter(json, "id", sortObject.sortDirection || "DESCENDING");
          }
        });
      }

      res.render("home", { title: "goodplants Admin", image_base_url: process.env.IMAGE_BASE_URL, data: json });
    })
    .catch((err) => console.log(err));
});

router.get("/create", function (req, res, next) {
  res.render("create", { title: "Create Plant", image_base_url: process.env.IMAGE_BASE_URL });
});

router.get("/modify/:id", function (req, res, next) {
  if (!req.params.id) res.render("error", { message: "Plant id not provided." });

  getPlantsJSON().then((json) => {
    const matchIndex = json.findIndex((plant) => plant.id === parseInt(req.params.id));

    if (matchIndex === -1) {
      res.status(404).send({ message: "A plant with that id was not found." });
      return;
    }

    res.render("modify", {
      title: "Modify Plant",
      image_base_url: process.env.IMAGE_BASE_URL,
      plant: json[matchIndex],
    });
  });
});

module.exports = router;
