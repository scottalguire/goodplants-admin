var express = require("express")
var router = express.Router()
const getPlantsJSON = require("../utils").getPlantsJSON

/* GET home page. */
router.get("/", function (req, res, next) {
  getPlantsJSON()
    .then((json) => {
      res.render("home", { title: "goodplants Admin", data: json })
    })
    .catch((err) => console.log(err))
})

router.get("/create", function (req, res, next) {
  res.render("create", { title: "Create Plant - goodplants admin" })
})

router.get("/modify/:id", function (req, res, next) {
  if (!req.params.id) res.render("error", { message: "Plant id not provided." })

  getPlantsJSON().then((json) => {
    const matchIndex = json.findIndex((plant) => plant.id === parseInt(req.params.id))

    if (matchIndex === -1) {
      res.status(404).send({ message: "A plant with that id was not found." })
      return
    }

    res.render("modify", { title: "Modify Plant - goodplants admin", plant: json[matchIndex] })
  })
})

module.exports = router
