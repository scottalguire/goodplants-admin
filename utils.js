const fs = require("fs")
const path = require("path")

/**
 * Retreives the .json data file, converts it to a JSON object, and returns a Promise
 */
function getPlantsJSON() {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(process.cwd(), process.env.DATA_PATH),
      {
        encoding: "utf8",
      },
      (err, data) => {
        if (err) {
          reject(err)
          throw new Error(err)
        }

        resolve(JSON.parse(data))
      }
    )
  })
}

/**
 * Accepts a JSON object, coverts it to a formatted string, writes it to the data file, and returns a Promise
 * @param {*} json
 */
function updatePlantsJSON(json) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(process.cwd(), process.env.DATA_PATH),
      JSON.stringify(json, null, 2),
      (err) => {
        if (err) reject(err)
        resolve()
      }
    )
  })
}

module.exports = {
  getPlantsJSON,
  updatePlantsJSON,
}
