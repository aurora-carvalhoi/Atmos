var express = require("express");
var router = express.Router();

var analiseController = require("../controllers/analisePreditivaController");

router.get("/:empresa/:server",analiseController.buscarAnalisePreditiva);

module.exports = router;

